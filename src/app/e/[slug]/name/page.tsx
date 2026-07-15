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
      <div className="flex min-h-screen items-center justify-center bg-nb-yellow">
        <div className="nb-card bg-nb-white p-8 text-center">
          <p className="font-bold uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-nb-yellow">
        <div className="nb-card bg-nb-pink p-8 text-center">
          <p className="text-xl font-bold uppercase text-black">Event not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-nb-yellow px-4">
      <div className="nb-card w-full max-w-md bg-nb-white p-8 text-center">
        <div className="mb-4 text-6xl">✍️</div>
        <h1 className="mb-2 text-2xl font-black uppercase text-black">
          {eventName}
        </h1>
        <p className="mb-6 font-medium text-black">
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
            className="w-full border-3 border-black bg-nb-white px-4 py-3 text-center text-lg font-bold text-black outline-none focus:bg-nb-lime"
            autoFocus
          />
          {error && (
            <p className="border-2 border-black bg-nb-pink px-3 py-2 text-sm font-bold text-black">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="nb-btn w-full bg-nb-pink py-4 text-lg text-black hover:bg-nb-orange"
          >
            Continue to Camera
          </button>
        </form>
      </div>
    </div>
  );
}
