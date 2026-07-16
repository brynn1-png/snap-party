"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function GuestLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [eventName, setEventName] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: event, error } = await supabase
        .from("events")
        .select("id, name, photo_limit")
        .eq("slug", slug)
        .single();

      if (error || !event) {
        console.error("Event lookup failed:", error);
        setStatus("error");
        return;
      }

      setEventName(event.name);

      const existingToken = localStorage.getItem(`session_${event.id}`);

      if (existingToken) {
        const { data: session } = await supabase
          .from("sessions")
          .select("id, shots_used")
          .eq("session_token", existingToken)
          .single();

        if (session) {
          if (session.shots_used >= (event.photo_limit ?? 15)) {
            router.push(`/e/${slug}/done`);
            return;
          }
          localStorage.setItem("current_event_id", event.id);
          localStorage.setItem("current_session_token", existingToken);

          const existingName = localStorage.getItem("current_guest_name");
          router.push(existingName ? `/e/${slug}/camera` : `/e/${slug}/name`);
          return;
        }
      }

      localStorage.setItem("current_event_id", event.id);
      setStatus("ready");
    }
    init();
  }, [slug, supabase, router]);

  async function handleStart() {
    const { data: event } = await supabase
      .from("events")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!event) return;

    localStorage.setItem("current_event_id", event.id);
    router.push(`/e/${slug}/name`);
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sp-midnight px-4">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
          <p className="font-medium text-white/40">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sp-midnight px-4">
        <div className="rounded-2xl bg-sp-coral/10 border border-sp-coral/20 p-8 text-center">
          <p className="text-xl font-semibold text-sp-coral">
            Event not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sp-midnight overflow-hidden px-4">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-sp-coral/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-sp-violet/8 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-sp-coral/10 via-sp-magenta/10 to-sp-violet/10 rounded-3xl blur-xl" />
          <div className="relative rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8 text-center">
            <div className="mb-4 text-6xl">📸</div>
            <h1 className="mb-2 text-2xl font-bold text-white">
              {eventName}
            </h1>
            <p className="mb-6 text-sm text-white/40">
              Tap below to start taking photos. No app needed.
            </p>
            <button
              onClick={handleStart}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sp-coral to-sp-magenta text-white font-semibold hover:shadow-lg hover:shadow-sp-magenta/25 transition-all duration-300 hover:scale-[1.02]"
            >
              Start Snapping
            </button>
            <p className="mt-4 text-xs text-white/20">
              Photos upload instantly to the organizer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
