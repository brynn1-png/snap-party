"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Event {
  id: string;
  name: string;
  slug: string;
  photo_limit: number;
  created_at: string;
  photo_count?: number;
  session_count?: number;
}

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchEvents() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

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
                  .eq("event_id", event.id),
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
      setLoading(false);
    }
    fetchEvents();
  }, [supabase]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-black uppercase text-black">
          Your Events
        </h1>
        <Link
          href="/dashboard/create"
          className="nb-btn bg-nb-pink px-6 py-3 text-black hover:bg-nb-orange"
        >
          + New Event
        </Link>
      </div>

      {loading && (
        <div className="nb-card bg-nb-yellow p-8 text-center">
          <p className="font-bold uppercase">Loading...</p>
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="nb-card bg-nb-yellow p-8 text-center">
          <p className="mb-4 text-lg font-bold uppercase text-black">
            No events yet
          </p>
          <Link
            href="/dashboard/create"
            className="nb-btn inline-block bg-nb-white px-6 py-3 text-black hover:bg-nb-lime"
          >
            Create Your First Event
          </Link>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/dashboard/events/${event.id}`}
            className="nb-card block bg-nb-white p-6 transition-colors hover:bg-nb-lime"
          >
            <h2 className="mb-2 text-xl font-black uppercase text-black">
              {event.name}
            </h2>
            <div className="mb-4 space-y-1 text-sm font-medium text-black">
              <p>
                Shots per guest: <span className="font-bold">{event.photo_limit}</span>
              </p>
              <p>
                Guests: <span className="font-bold">{event.session_count}</span>
              </p>
              <p>
                Photos: <span className="font-bold">{event.photo_count}</span>
              </p>
            </div>
            <div className="nb-tag bg-nb-blue">
              {new Date(event.created_at).toLocaleDateString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
