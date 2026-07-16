"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Event {
  id: string;
  name: string;
  slug: string;
  photo_limit: number;
  event_date: string | null;
  cover_photo_url: string | null;
  created_at: string;
  photo_count?: number;
  session_count?: number;
}

const coverGradients = [
  "from-sp-coral/40 to-sp-orange/40",
  "from-sp-violet/40 to-sp-purple/40",
  "from-sp-teal/40 to-sp-blue/40",
  "from-sp-magenta/40 to-sp-coral/40",
  "from-sp-gold/40 to-sp-orange/40",
  "from-sp-purple/40 to-sp-violet/40",
];

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const fetchedOnce = useRef(false);
  const supabase = createClient();
  const pathname = usePathname();

  const fetchEvents = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }

    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .eq("organizer_id", user.id)
      .order("created_at", { ascending: false });

    if (eventsData) {
      const eventsWithCounts = await Promise.all(
        eventsData.map(async (event) => {
          const [{ count: photoCount }, { count: sessionCount }] =
            await Promise.all([
              supabase
                .from("photos")
                .select("*", { count: "exact", head: true })
                .eq("event_id", event.id),
                supabase
                  .from("sessions")
                  .select("*", { count: "exact", head: true })
                  .eq("event_id", event.id)
                  .not("guest_name", "is", null),
            ]);
          return {
            ...event,
            photo_count: photoCount || 0,
            session_count: sessionCount || 0,
          };
        })
      );
      setEvents(eventsWithCounts);
    }
    if (!fetchedOnce.current) {
      fetchedOnce.current = true;
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 3000);
    return () => clearInterval(interval);
  }, [pathname, fetchEvents]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
            Your Events
          </h1>
          <p className="text-sm text-white/30">Manage and monitor your events</p>
        </div>
        <Link
          href="/dashboard/create"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-sp-coral to-sp-magenta rounded-full hover:shadow-lg hover:shadow-sp-magenta/25 transition-all duration-300 hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Event
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
            <svg className="w-5 h-5 text-white/40 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-medium text-white/40">Loading events...</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No events yet</h3>
          <p className="text-sm text-white/30 mb-6">Create your first event to start collecting photos</p>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-sp-coral to-sp-magenta rounded-full hover:shadow-lg hover:shadow-sp-magenta/25 transition-all duration-300 hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Your First Event
          </Link>
        </div>
      )}

      {/* Event grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event, i) => (
          <Link
            key={event.id}
            href={`/dashboard/events/${event.id}`}
            className="group relative"
          >
            {/* Hover glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-sp-coral/10 to-sp-violet/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

            <div className="relative rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden">
              {/* Cover photo */}
              <div className="relative h-36 overflow-hidden">
                {event.cover_photo_url && !brokenImages.has(event.id) ? (
                  <img
                    src={event.cover_photo_url}
                    alt={event.name}
                    onError={() => setBrokenImages((prev) => new Set(prev).add(event.id))}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${coverGradients[i % coverGradients.length]}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-sp-midnight via-sp-midnight/20 to-transparent" />

                {/* Arrow */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>

                {/* Event name on cover */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h2 className="text-lg font-bold text-white drop-shadow-lg">
                    {event.name}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2.5 mb-4">
                  <div className="text-center p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-base font-bold text-sp-coral">{event.session_count}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Guests</p>
                  </div>
                  <div className="text-center p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-base font-bold text-sp-success">{event.photo_count}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Photos</p>
                  </div>
                  <div className="text-center p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-base font-bold text-sp-violet">{event.photo_limit}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Limit</p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <span className="text-xs text-white/20">
                    {event.event_date
                      ? new Date(event.event_date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : new Date(event.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    }
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
