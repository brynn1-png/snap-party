"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import imageCompression from "browser-image-compression";
import { enqueuePhoto, getQueueCount } from "@/lib/offlineQueue";
import { processQueue, startSyncListener } from "@/lib/syncWorker";

const PHOTO_LIMIT = 15;

export default function CameraPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [shotsUsed, setShotsUsed] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const [queuedCount, setQueuedCount] = useState(0);
  const supabase = createClient();
  const shotsUsedRef = useRef(0);
  const guestNameRef = useRef("");

  const startCamera = useCallback(async (facing: "user" | "environment") => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setReady(true);
    } catch {
      setError("Camera access denied. Please allow camera permissions.");
    }
  }, []);

  useEffect(() => {
    if (initialized) return;

    const token = localStorage.getItem("current_session_token");
    const guestName = localStorage.getItem("current_guest_name");

    if (!token) {
      router.push(`/e/${slug}`);
      return;
    }

    guestNameRef.current = guestName || "";

    async function loadSession() {
      const { data: session } = await supabase
        .from("sessions")
        .select("id, shots_used, guest_name")
        .eq("session_token", token)
        .single();

      if (session) {
        setShotsUsed(session.shots_used);
        shotsUsedRef.current = session.shots_used;
        setInitialized(true);

        if (session.shots_used >= PHOTO_LIMIT) {
          router.push(`/e/${slug}/done`);
          return;
        }

        if (guestName && !session.guest_name) {
          await supabase
            .from("sessions")
            .update({ guest_name: guestName })
            .eq("id", session.id);
        }

        startCamera(facingMode);
      }
    }
    loadSession();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  useEffect(() => {
    async function initQueue() {
      const count = await getQueueCount();
      setQueuedCount(count);
      if (count > 0 && navigator.onLine) {
        await processQueue((_, synced) => {
          setQueuedCount((prev) => Math.max(0, prev - synced));
        });
      }
    }
    initQueue();

    const stopListener = startSyncListener((status, synced) => {
      if (status === "idle" && synced > 0) {
        setQueuedCount((prev) => Math.max(0, prev - synced));
      }
    });

    return stopListener;
  }, []);

  function stampNameOnCanvas(canvas: HTMLCanvasElement) {
    const name = guestNameRef.current;
    if (!name) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = Math.max(16, canvas.width * 0.035);
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textBaseline = "bottom";
    ctx.textAlign = "left";

    const padding = 16;
    const x = padding;
    const y = canvas.height - padding;

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000000";
    ctx.strokeText(`📸 ${name}`, x, y);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`📸 ${name}`, x, y);
  }

  async function uploadInBackground(compressedFile: File, eventId: string, sessionId: string, guestName: string) {
    if (!navigator.onLine) {
      await enqueuePhoto({
        id: crypto.randomUUID(),
        blob: compressedFile,
        eventId,
        sessionId,
        guestName,
        timestamp: Date.now(),
      });
      setQueuedCount((prev) => prev + 1);
      setPendingCount((prev) => Math.max(0, prev - 1));
      return;
    }

    const formData = new FormData();
    formData.append("file", compressedFile);
    formData.append("eventId", eventId);
    formData.append("sessionId", sessionId);
    formData.append("guestName", guestName);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setShotsUsed(result.shotsUsed);
        shotsUsedRef.current = result.shotsUsed;

        if (result.shotsUsed >= PHOTO_LIMIT) {
          router.push(`/e/${slug}/done`);
        }
      } else {
        await enqueuePhoto({
          id: crypto.randomUUID(),
          blob: compressedFile,
          eventId,
          sessionId,
          guestName,
          timestamp: Date.now(),
        });
        setQueuedCount((prev) => prev + 1);
      }
    } catch {
      await enqueuePhoto({
        id: crypto.randomUUID(),
        blob: compressedFile,
        eventId,
        sessionId,
        guestName,
        timestamp: Date.now(),
      });
      setQueuedCount((prev) => prev + 1);
    }

    setPendingCount((prev) => Math.max(0, prev - 1));
  }

  async function capture() {
    if (!videoRef.current || !canvasRef.current) return;
    if (shotsUsedRef.current + pendingCount >= PHOTO_LIMIT) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);

    // Reset transform after drawImage
    if (facingMode === "user") {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    stampNameOnCanvas(canvas);

    // capture thumbnail for animation
    const thumbCanvas = document.createElement("canvas");
    thumbCanvas.width = 160;
    thumbCanvas.height = Math.round(160 * (canvas.height / canvas.width));
    const thumbCtx = thumbCanvas.getContext("2d");
    if (thumbCtx) {
      thumbCtx.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);
      const thumbUrl = thumbCanvas.toDataURL("image/webp", 0.8);
      setCapturedImage(thumbUrl);
      setTimeout(() => setCapturedImage(null), 1400);
    }

    // white flash
    setFlash(true);
    setTimeout(() => setFlash(false), 100);

    setPendingCount((prev) => prev + 1);

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/webp", 0.82)
      );

      if (!blob) {
        setPendingCount((prev) => Math.max(0, prev - 1));
        return;
      }

      const compressedFile = await imageCompression(
        new File([blob], "photo.webp", { type: "image/webp" }),
        {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 1280,
          initialQuality: 0.82,
          useWebWorker: true,
        }
      );

      const eventId = localStorage.getItem("current_event_id");
      const sessionToken = localStorage.getItem("current_session_token");
      const guestName = localStorage.getItem("current_guest_name") || "";
      if (!eventId || !sessionToken) return;

      const { data: session } = await supabase
        .from("sessions")
        .select("id")
        .eq("session_token", sessionToken)
        .single();

      if (!session) return;

      uploadInBackground(compressedFile, eventId, session.id, guestName);
    } catch {
      setPendingCount((prev) => Math.max(0, prev - 1));
    }
  }

  function toggleCamera() {
    const newFacing = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacing);
    startCamera(newFacing);
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sp-midnight px-4">
        <div className="relative w-full max-w-sm">
          <div className="absolute -inset-1 bg-gradient-to-r from-sp-coral/10 to-sp-magenta/10 rounded-3xl blur-xl" />
          <div className="relative rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sp-coral/10">
              <svg className="h-7 w-7 text-sp-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <p className="mb-6 text-lg font-semibold text-sp-coral">{error}</p>
            <button
              onClick={() => {
                setError("");
                startCamera(facingMode);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sp-coral to-sp-magenta text-sm font-semibold text-white hover:shadow-lg hover:shadow-sp-magenta/25 transition-all duration-300 hover:scale-[1.02]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-sp-midnight">
      {/* Ambient glow */}
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-sp-coral/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-sp-violet/10 blur-[100px] pointer-events-none" />

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Gradient overlay at edges for depth */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-sp-midnight/60 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-sp-midnight/60 to-transparent z-10" />

      {/* white flash */}
      {flash && (
        <div className="absolute inset-0 z-30 bg-white opacity-70" />
      )}

      {/* capture animation */}
      {capturedImage && (
        <img
          src={capturedImage}
          alt=""
          className="pointer-events-none absolute z-30 rounded-2xl border border-white/10 shadow-2xl"
          style={{
            top: "50%",
            left: "50%",
            width: "70vw",
            maxWidth: "320px",
            transform: "translate(-50%, -50%) scale(1)",
            animation: "capture-fly 1.3s ease-out forwards",
          }}
        />
      )}

      <style>{`
        @keyframes capture-fly {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.85);
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% - 35vw), calc(-50% + 35vh)) scale(0.15);
          }
        }
      `}</style>

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/60 to-transparent px-5 pt-5 pb-8">
        <div className="flex items-center gap-2">
          {/* Shot counter */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sp-success/10 px-3.5 py-1.5 border border-sp-success/20">
            <svg className="h-3.5 w-3.5 text-sp-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            </svg>
            <span className="text-xs font-semibold text-sp-success">{shotsUsed + pendingCount} / {PHOTO_LIMIT}</span>
          </div>

          {/* Uploading badge */}
          {pendingCount > 0 && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-sp-warning/10 px-3.5 py-1.5 border border-sp-warning/20">
              <svg className="h-3.5 w-3.5 animate-spin text-sp-warning" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-xs font-semibold text-sp-warning">{pendingCount}</span>
            </div>
          )}

          {/* Queued badge */}
          {queuedCount > 0 && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-sp-coral/10 px-3.5 py-1.5 border border-sp-coral/20">
              <svg className="h-3.5 w-3.5 text-sp-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-semibold text-sp-coral">{queuedCount}</span>
            </div>
          )}
        </div>

        {/* Flip camera button */}
        <button
          onClick={toggleCamera}
          className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          Flip
        </button>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center px-6 pb-10">
        {/* Capture button */}
        <div className="relative mb-4">
          {/* Soft ambient glow */}
          <div className="absolute -inset-6 rounded-full bg-sp-magenta/20 blur-3xl pointer-events-none" />

          {/* Outer ring */}
          <div className="absolute -inset-3 rounded-full border border-white/10" />

          {/* Main button */}
          <button
            onClick={capture}
            disabled={!ready || shotsUsed + pendingCount >= PHOTO_LIMIT}
            className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sp-coral via-sp-magenta to-sp-violet shadow-xl shadow-sp-magenta/20 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {/* Inner white ring */}
            <div className="absolute inset-1.5 rounded-full border-2 border-white/25" />

            <svg className="relative h-8 w-8 text-white drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            </svg>
          </button>
        </div>

        {/* Helper text */}
        <p className="text-xs font-medium text-white/30">
          {shotsUsed + pendingCount >= PHOTO_LIMIT ? "You've reached the limit" : "Tap to capture"}
        </p>
      </div>
    </div>
  );
}
