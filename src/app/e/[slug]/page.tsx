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
      console.log("Looking up event with slug:", slug);
      const { data: event, error } = await supabase
        .from("events")
        .select("id, name, photo_limit")
        .eq("slug", slug)
        .single();

      console.log("Supabase response:", { event, error });

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
          if (session.shots_used >= event.photo_limit) {
            router.push(`/e/${slug}/done`);
            return;
          }
          localStorage.setItem("current_event_id", event.id);
          localStorage.setItem("current_session_token", existingToken);
          localStorage.setItem("current_photo_limit", String(event.photo_limit));
          router.push(`/e/${slug}/camera`);
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
      .select("id, photo_limit")
      .eq("slug", slug)
      .single();

    if (!event) return;

    const sessionToken = crypto.randomUUID();
    const { error } = await supabase.from("sessions").insert({
      event_id: event.id,
      session_token: sessionToken,
      device: navigator.userAgent,
    });

    if (error) return;

    localStorage.setItem(`session_${event.id}`, sessionToken);
    localStorage.setItem("current_event_id", event.id);
    localStorage.setItem("current_session_token", sessionToken);
    localStorage.setItem("current_photo_limit", String(event.photo_limit));

    router.push(`/e/${slug}/camera`);
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-nb-yellow">
        <div className="nb-card bg-nb-white p-8 text-center">
          <p className="font-bold uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-nb-yellow">
        <div className="nb-card bg-nb-pink p-8 text-center">
          <p className="text-xl font-bold uppercase text-black">
            Event not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-nb-yellow px-4">
      <div className="nb-card w-full max-w-md bg-nb-white p-8 text-center">
        <div className="mb-4 text-6xl">📸</div>
        <h1 className="mb-2 text-2xl font-black uppercase text-black">
          {eventName}
        </h1>
        <p className="mb-6 font-medium text-black">
          Tap below to start taking photos. No app needed.
        </p>
        <button
          onClick={handleStart}
          className="nb-btn w-full bg-nb-pink py-4 text-lg text-black hover:bg-nb-orange"
        >
          Start Snapping
        </button>
        <p className="mt-4 text-xs font-medium text-black/60">
          Photos upload instantly to the organizer
        </p>
      </div>
    </div>
  );
}
