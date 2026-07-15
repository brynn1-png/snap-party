"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NamePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [eventName, setEventName] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const existingName = localStorage.getItem("current_guest_name");
    if (existingName) {
      router.push(`/e/${slug}/camera`);
      return;
    }

    async function init() {
      const { data: event, error: eventError } = await supabase
        .from("events")
        .select("name")
        .eq("slug", slug)
        .single();

      if (eventError || !event) {
        setError("Event not found");
        setLoading(false);
        return;
      }

      setEventName(event.name);
      setLoading(false);
    }
    init();
  }, [slug, supabase, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
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
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sp-coral to-sp-magenta text-white font-semibold hover:shadow-lg hover:shadow-sp-magenta/25 transition-all duration-300 hover:scale-[1.02]"
              >
                Continue to Camera
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
