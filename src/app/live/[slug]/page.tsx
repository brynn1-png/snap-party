"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useSupabase } from "@/lib/supabase/provider";
import Carousel from "@/components/Carousel";

interface EventData {
  id: string;
  name: string;
  slug: string;
  event_date: string | null;
  cover_photo_url: string | null;
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
        .select("id, name, slug, event_date, cover_photo_url")
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
      <div className="h-screen flex items-center justify-center bg-[#0a0a14]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-white/60 text-lg tracking-wide">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a14]">
        <div className="text-center">
          <p className="text-white text-xl mb-2">{error || "Event not found"}</p>
          <p className="text-white/40 text-sm">This event may not exist or you may not have access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0a14] overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {event.cover_photo_url ? (
          <>
            <img
              src={event.cover_photo_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-[#0a0a14]/80" />
          </>
        ) : (
          <>
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-violet-600/5 rounded-full blur-[120px]" />
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-fuchsia-600/5 rounded-full blur-[120px]" />
          </>
        )}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <h1 className="text-white text-2xl font-bold tracking-tight">
              {event.name}
            </h1>
          </div>
          {event.event_date && (
            <span className="text-white/30 text-sm font-medium">
              {new Date(event.event_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>
          )}
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
            <span className="text-white/60 text-sm font-medium tabular-nums">
              {photos.length}
            </span>
          </div>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200"
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

      {/* Carousel area */}
      <div className="relative z-10 flex-1 overflow-hidden px-2">
        {photos.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
              </div>
              <p className="text-white/30 text-lg font-medium">Waiting for photos...</p>
              <p className="text-white/15 text-sm mt-2">They will appear here in real time</p>
            </div>
          </div>
        ) : (
          <Carousel photos={photos} fullScreen />
        )}
      </div>
    </div>
  );
}
