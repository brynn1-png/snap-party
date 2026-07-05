"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function CreateEventPage() {
  const [name, setName] = useState("");
  const [photoLimit, setPhotoLimit] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const slug = generateSlug();
    const qr_token = generateToken();

    const { data, error: insertError } = await supabase
      .from("events")
      .insert({
        organizer_id: user.id,
        name,
        slug,
        qr_token,
        photo_limit: photoLimit,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push(`/dashboard/events/${data.id}`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 md:px-8">
      <div className="nb-card bg-nb-white p-8">
        <h1 className="mb-6 text-2xl font-black uppercase text-black">
          Create Event
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold uppercase text-black">
              Event Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-3 border-black bg-nb-white px-4 py-3 font-medium text-black outline-none focus:bg-nb-lime"
              placeholder="e.g. Sarah & Mike Wedding"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold uppercase text-black">
              Photo Limit per Guest
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={photoLimit}
              onChange={(e) => setPhotoLimit(Number(e.target.value))}
              className="w-full border-3 border-black bg-nb-white px-4 py-3 font-medium text-black outline-none focus:bg-nb-lime"
            />
          </div>
          {error && (
            <p className="border-2 border-black bg-nb-pink px-3 py-2 text-sm font-bold text-black">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="nb-btn w-full bg-nb-black py-3 text-white hover:bg-nb-pink disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
