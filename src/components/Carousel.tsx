"use client";

import { useEffect, useRef } from "react";

interface SlidePhoto {
  id: string;
  image_url: string;
  guest_name: string | null;
}

interface CarouselProps {
  photos: SlidePhoto[];
}

export default function Carousel({ photos }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || photos.length <= 1) return;

    let animId: number;
    let position = 0;
    const speed = 1;
    const el = track;

    function animate() {
      position -= speed;
      const halfWidth = el.scrollWidth / 2;
      if (Math.abs(position) >= halfWidth) {
        position = 0;
      }
      el.style.transform = `translateX(${position}px)`;
      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [photos.length]);

  if (photos.length === 0) return null;

  const doubled = [...photos, ...photos];

  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl bg-white/[0.03] border border-white/10">
      <div className="py-4">
        <div ref={trackRef} className="flex gap-4 px-4">
          {doubled.map((photo, i) => (
            <div
              key={`${photo.id}-${i}`}
              className="relative flex-shrink-0 overflow-hidden rounded-xl border border-white/5"
              style={{ width: "300px", height: "300px" }}
            >
              <img
                src={photo.image_url}
                alt={`Photo by ${photo.guest_name || "guest"}`}
                className="h-full w-full object-cover"
              />
              {photo.guest_name && (
                <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs font-medium text-white">
                  {photo.guest_name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60">
        {photos.length} photos
      </div>
    </div>
  );
}
