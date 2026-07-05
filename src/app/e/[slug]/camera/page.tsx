"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import imageCompression from "browser-image-compression";

export default function CameraPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [shotsUsed, setShotsUsed] = useState(0);
  const [photoLimit, setPhotoLimit] = useState(15);
  const [uploading, setUploading] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false);
  const supabase = createClient();

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

    const limit = parseInt(localStorage.getItem("current_photo_limit") || "15", 10);
    const token = localStorage.getItem("current_session_token");

    if (!token) {
      router.push(`/e/${slug}`);
      return;
    }

    async function loadSession() {
      const { data: session } = await supabase
        .from("sessions")
        .select("shots_used")
        .eq("session_token", token)
        .single();

      if (session) {
        setShotsUsed(session.shots_used);
        setPhotoLimit(limit);
        setInitialized(true);

        if (session.shots_used >= limit) {
          router.push(`/e/${slug}/done`);
          return;
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

  async function capture() {
    if (!videoRef.current || !canvasRef.current || uploading) return;

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

    setUploading(true);

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.95)
      );

      if (!blob) {
        setError("Failed to capture photo");
        setUploading(false);
        return;
      }

      const compressedFile = await imageCompression(
        new File([blob], "photo.jpg", { type: "image/jpeg" }),
        {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        }
      );

      const eventId = localStorage.getItem("current_event_id");
      const sessionToken = localStorage.getItem("current_session_token");
      if (!eventId || !sessionToken) return;

      const { data: session } = await supabase
        .from("sessions")
        .select("id")
        .eq("session_token", sessionToken)
        .single();

      if (!session) return;

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("eventId", eventId);
      formData.append("sessionId", session.id);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        setError(`Upload failed: ${result.error}`);
        setUploading(false);
        return;
      }

      setShotsUsed(result.shotsUsed);

      if (result.shotsUsed >= photoLimit) {
        router.push(`/e/${slug}/done`);
      }
    } catch {
      setError("Upload failed. Try again.");
    }

    setUploading(false);
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
    <div className="relative h-screen w-screen bg-nb-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between bg-black/60 px-4 py-4">
        <div className="nb-tag bg-nb-lime text-black">
          {shotsUsed} / {photoLimit}
        </div>
        <button
          onClick={toggleCamera}
          className="nb-btn bg-nb-white px-4 py-2 text-sm text-black"
        >
          Flip
        </button>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center bg-black/60 px-4 py-8">
        <button
          onClick={capture}
          disabled={uploading || !ready}
          className="h-20 w-20 rounded-full border-4 border-white bg-nb-pink transition-transform hover:scale-110 disabled:opacity-50"
        >
          {uploading ? (
            <span className="text-xs font-bold text-white">...</span>
          ) : (
            <span className="text-2xl">📸</span>
          )}
        </button>
      </div>

      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="nb-card bg-nb-white px-8 py-4 text-center">
            <p className="font-bold uppercase text-black">Uploading...</p>
          </div>
        </div>
      )}
    </div>
  );
}
