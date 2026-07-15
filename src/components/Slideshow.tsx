"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface SlidePhoto {
  id: string;
  image_url: string;
  guest_name: string | null;
}

interface SlideshowProps {
  photos: SlidePhoto[];
  onClose: () => void;
}

export default function Slideshow({ photos, onClose }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (paused || photos.length === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(goNext, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, photos.length, goNext]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goNext, goPrev]);

  if (photos.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-sp-midnight">
        <div className="rounded-2xl bg-sp-info/10 border border-sp-info/20 p-8 text-center">
          <p className="text-xl font-semibold text-sp-info">
            No photos yet
          </p>
        </div>
      </div>
    );
  }

  const current = photos[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-sp-midnight"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-sm font-medium text-white hover:bg-white/20 transition-all duration-300"
      >
        Close
      </button>

      {/* photo counter */}
      <div className="absolute left-4 top-4 z-10 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60">
        {currentIndex + 1} / {photos.length}
        {paused && " (paused)"}
      </div>

      {/* prev */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
      >
        &larr;
      </button>

      {/* photo */}
      <div className="relative flex h-full w-full items-center justify-center p-16">
        <img
          src={current.image_url}
          alt={`Photo by ${current.guest_name || "guest"}`}
          className="max-h-full max-w-full rounded-xl border border-white/10 object-contain shadow-lg"
        />
        {current.guest_name && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-sm font-medium text-white">
            {current.guest_name}
          </div>
        )}
      </div>

      {/* next */}
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
      >
        &rarr;
      </button>

      {/* bottom indicator */}
      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 flex gap-2">
        {photos.slice(0, Math.min(photos.length, 20)).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === currentIndex ? "bg-sp-coral scale-125" : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
