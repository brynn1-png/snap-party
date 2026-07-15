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

    function animate() {
      position -= speed;
      const halfWidth = track.scrollWidth / 2;
      if (Math.abs(position) >= halfWidth) {
        position = 0;
      }
      track.style.transform = `translateX(${position}px)`;
      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [photos.length]);

  if (photos.length === 0) return null;

  const doubled = [...photos, ...photos];

  return (
    <div className="nb-card relative mb-8 overflow-hidden bg-nb-black">
      <div className="py-4">
        <div ref={trackRef} className="flex gap-4 px-4">
          {doubled.map((photo, i) => (
            <div
              key={`${photo.id}-${i}`}
              className="nb-card-sm relative flex-shrink-0 overflow-hidden bg-nb-white"
              style={{ width: "300px", height: "300px" }}
            >
              <img
                src={photo.image_url}
                alt={`Photo by ${photo.guest_name || "guest"}`}
                className="h-full w-full object-cover"
              />
              {photo.guest_name && (
                <div className="absolute bottom-2 left-2 nb-tag bg-nb-yellow text-black text-xs">
                  📸 {photo.guest_name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 nb-tag bg-nb-white text-black">
        {photos.length} photos
      </div>
    </div>
  );
}
