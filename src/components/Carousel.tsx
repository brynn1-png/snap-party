"use client";

import { useEffect, useRef } from "react";

interface SlidePhoto {
  id: string;
  image_url: string;
  guest_name: string | null;
}

interface CarouselProps {
  photos: SlidePhoto[];
  fullScreen?: boolean;
}

export default function Carousel({ photos, fullScreen = false }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || photos.length <= 1) return;

    let animId: number;
    let position = 0;
    const speed = fullScreen ? 1.5 : 1;
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
  }, [photos.length, fullScreen]);

  if (photos.length === 0) return null;

  const doubled = [...photos, ...photos];
  const cardSize = fullScreen ? 500 : 300;

  return (
    <div className={`relative overflow-hidden ${fullScreen ? "h-full" : "mb-8 rounded-2xl bg-white border border-gray-100 shadow-sm"}`}>
      <div className={fullScreen ? "h-full flex items-center" : "py-4"}>
        <div ref={trackRef} className={`flex ${fullScreen ? "gap-6 px-6" : "gap-4 px-4"}`}>
          {doubled.map((photo, i) => (
            <div
              key={`${photo.id}-${i}`}
              className={`relative flex-shrink-0 overflow-hidden ${fullScreen ? "rounded-2xl" : "rounded-xl border border-gray-100"}`}
              style={{ width: `${cardSize}px`, height: `${cardSize}px` }}
            >
              <img
                src={photo.image_url}
                alt={`Photo by ${photo.guest_name || "guest"}`}
                className="h-full w-full object-cover"
              />
              {photo.guest_name && (
                <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm font-medium text-white ${fullScreen ? "text-sm" : "text-xs"}`}>
                  {photo.guest_name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {!fullScreen && (
        <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-white border border-gray-100 shadow-sm text-xs font-medium text-gray-500">
          {photos.length} photos
        </div>
      )}
    </div>
  );
}
