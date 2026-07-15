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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-nb-black">
        <div className="nb-card bg-nb-blue p-8 text-center">
          <p className="text-xl font-bold uppercase text-black">
            No photos yet
          </p>
        </div>
      </div>
    );
  }

  const current = photos[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-nb-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 nb-btn bg-nb-pink px-4 py-2 text-black"
      >
        Close
      </button>

      {/* photo counter */}
      <div className="absolute left-4 top-4 z-10 nb-tag bg-nb-white text-black">
        {currentIndex + 1} / {photos.length}
        {paused && " (paused)"}
      </div>

      {/* prev */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 nb-btn bg-nb-lime px-3 py-2 text-2xl text-black"
      >
        &larr;
      </button>

      {/* photo */}
      <div className="relative flex h-full w-full items-center justify-center p-16">
        <img
          src={current.image_url}
          alt={`Photo by ${current.guest_name || "guest"}`}
          className="max-h-full max-w-full border-4 border-white object-contain shadow-lg"
        />
        {current.guest_name && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 nb-tag bg-nb-yellow text-black">
            {current.guest_name}
          </div>
        )}
      </div>

      {/* next */}
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 nb-btn bg-nb-lime px-3 py-2 text-2xl text-black"
      >
        &rarr;
      </button>

      {/* bottom indicator */}
      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 flex gap-2">
        {photos.slice(0, Math.min(photos.length, 20)).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 w-2 rounded-full border border-black transition-all ${
              i === currentIndex ? "bg-nb-lime scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
