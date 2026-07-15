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
      <div className="flex min-h-screen items-center justify-center bg-nb-black px-4">
        <div className="nb-card bg-nb-pink p-8 text-center">
          <p className="mb-4 text-lg font-bold text-black">{error}</p>
          <button
            onClick={() => {
              setError("");
              startCamera(facingMode);
            }}
            className="nb-btn bg-nb-white px-6 py-3 text-black"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-nb-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* white flash */}
      {flash && (
        <div className="absolute inset-0 z-30 bg-white opacity-70" />
      )}

      {/* capture animation */}
      {capturedImage && (
        <img
          src={capturedImage}
          alt=""
          className="pointer-events-none absolute z-30 rounded-lg border-2 border-white shadow-lg"
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
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-black/60 px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="nb-tag bg-nb-lime text-black">
            {shotsUsed + pendingCount} / {PHOTO_LIMIT}
          </div>
          {pendingCount > 0 && (
            <div className="nb-tag bg-nb-orange text-black">
              {pendingCount} uploading
            </div>
          )}
          {queuedCount > 0 && (
            <div className="nb-tag bg-nb-pink text-black">
              {queuedCount} queued
            </div>
          )}
        </div>
        <button
          onClick={toggleCamera}
          className="nb-btn bg-nb-white px-4 py-2 text-sm text-black"
        >
          Flip
        </button>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center bg-black/60 px-4 py-8">
        <button
          onClick={capture}
          disabled={!ready || shotsUsed + pendingCount >= PHOTO_LIMIT}
          className="h-20 w-20 rounded-full border-4 border-white bg-nb-pink transition-transform hover:scale-110 active:scale-95 disabled:opacity-30"
        >
          <span className="text-2xl">📸</span>
        </button>
      </div>
    </div>
  );
}
