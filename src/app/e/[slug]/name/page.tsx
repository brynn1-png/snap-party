"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSupabase } from "@/lib/supabase/provider";

export default function NamePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [eventName, setEventName] = useState("");
  const [eventId, setEventId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const supabase = useSupabase();

  useEffect(() => {
    const existingName = localStorage.getItem("current_guest_name");
    if (existingName) {
      router.push(`/e/${slug}/camera`);
      return;
    }

    async function init() {
      const { data: event, error: eventError } = await supabase
        .from("events")
        .select("id, name")
        .eq("slug", slug)
        .single();

      if (eventError || !event) {
        setError("Event not found");
        setLoading(false);
        return;
      }

      setEventName(event.name);
      setEventId(event.id);
      setLoading(false);
    }
    init();
  }, [slug, supabase, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    setSubmitting(true);

    const sessionToken = crypto.randomUUID();
    const { error: sessionError } = await supabase.from("sessions").insert({
      event_id: eventId,
      session_token: sessionToken,
      guest_name: name.trim(),
      device: navigator.userAgent,
    });

    if (sessionError) {
      setError("Failed to start session. Please try again.");
      setSubmitting(false);
      return;
    }

    localStorage.setItem(`session_${eventId}`, sessionToken);
    localStorage.setItem("current_event_id", eventId);
    localStorage.setItem("current_session_token", sessionToken);
    localStorage.setItem("current_guest_name", name.trim());
    router.push(`/e/${slug}/camera`);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sp-midnight px-4">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
          <p className="font-medium text-white/40">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sp-midnight px-4">
        <div className="rounded-2xl bg-sp-coral/10 border border-sp-coral/20 p-8 text-center">
          <p className="text-xl font-semibold text-sp-coral">Event not found</p>
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
            <div className="mb-4 text-6xl">✍️</div>
            <h1 className="mb-2 text-2xl font-bold text-white">
              {eventName}
            </h1>
            <p className="mb-6 text-sm text-white/40">
              Enter your name so we can stamp your photos
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 outline-none focus:border-sp-coral/50 focus:bg-white/[0.07] transition-all duration-300 text-center text-lg font-medium"
                autoFocus
              />
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-sp-coral/10 border border-sp-coral/20">
                  <p className="text-sm text-sp-coral">{error}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={submitting || !name.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sp-coral to-sp-magenta text-white font-semibold hover:shadow-lg hover:shadow-sp-magenta/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Joining...
                  </span>
                ) : (
                  "Continue to Camera"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
