"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useSupabase } from "@/lib/supabase/provider";
import Carousel from "@/components/Carousel";

interface EventData {
  id: string;
  name: string;
  slug: string;
}

interface Photo {
  id: string;
  image_url: string;
  uploaded_at: string;
  session_id: string;
  guest_name: string | null;
}

export default function LivePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [event, setEvent] = useState<EventData | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const supabase = useSupabase();

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      }
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleFullscreen, isFullscreen]);

  useEffect(() => {
    async function fetchData() {
      const { data: eventData } = await supabase
        .from("events")
        .select("id, name, slug")
        .eq("slug", slug)
        .single();

      if (!eventData) {
        setError("Event not found");
        setLoading(false);
        return;
      }

      setEvent(eventData);

      const { data: photosData } = await supabase
        .from("photos")
        .select("*")
        .eq("event_id", eventData.id)
        .order("uploaded_at", { ascending: false });

      if (photosData) setPhotos(photosData);
      setLoading(false);
    }

    fetchData();
  }, [slug, supabase]);

  useEffect(() => {
    if (!event) return;

    const channel = supabase
      .channel(`live-photos-${event.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "photos", filter: `event_id=eq.${event.id}` },
        (payload) => {
          setPhotos((prev) => [payload.new as Photo, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "photos", filter: `event_id=eq.${event.id}` },
        (payload) => {
          setPhotos((prev) => prev.filter((p) => p.id !== (payload.old as Photo).id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [event, supabase]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <p className="text-white text-xl mb-2">{error || "Event not found"}</p>
          <p className="text-gray-400 text-sm">This event may not exist or you may not have access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950 overflow-hidden">
      <div className="flex items-center justify-between px-8 py-4">
        <h1 className="text-white text-2xl font-semibold tracking-tight">
          {event.name}
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm">
            {photos.length} {photos.length === 1 ? "photo" : "photos"}
          </span>
          <button
            onClick={toggleFullscreen}
            className="text-gray-400 hover:text-white transition-colors"
            title="Toggle fullscreen (F)"
          >
            {isFullscreen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-4">
        {photos.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 text-lg">Waiting for photos...</p>
              <p className="text-gray-600 text-sm mt-2">Photos will appear here as they are taken</p>
            </div>
          </div>
        ) : (
          <Carousel photos={photos} fullScreen />
        )}
      </div>
    </div>
  );
}
