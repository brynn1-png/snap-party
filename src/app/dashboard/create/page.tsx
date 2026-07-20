"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/lib/supabase/provider";
import Link from "next/link";

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
  const [eventDate, setEventDate] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = useSupabase();

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Cover photo must be under 5MB");
      return;
    }
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setCoverPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

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
        event_date: eventDate || null,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    if (coverFile && data) {
      const formData = new FormData();
      formData.append("file", coverFile);
      formData.append("eventId", data.id);

      const res = await fetch("/api/upload-cover", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.url) {
        await supabase
          .from("events")
          .update({ cover_photo_url: result.url })
          .eq("id", data.id);
      }
    }

    router.push(`/dashboard/events/${data.id}`);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-xl px-6 py-12 lg:px-8">
        {/* Back button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          
        </Link>

        {/* Card */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sp-coral to-sp-magenta flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Event</h1>
            <p className="text-sm text-gray-400">Set up a new event in seconds</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Cover Photo */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Cover Photo</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
              {coverPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-100 group">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-lg bg-white/90 text-sm font-medium text-gray-700 hover:bg-white transition-colors"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCoverPreview(null); setCoverFile(null); }}
                      className="px-4 py-2 rounded-lg bg-red-500/90 text-sm font-medium text-white hover:bg-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-44 rounded-xl border-2 border-dashed border-gray-200 hover:border-sp-coral/40 bg-gray-50 hover:bg-gray-100/50 transition-all duration-200 flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-sp-coral/10 flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6 text-gray-300 group-hover:text-sp-coral transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-400">Click to upload cover photo</p>
                    <p className="text-xs text-gray-300 mt-1">JPG, PNG up to 5MB</p>
                  </div>
                </button>
              )}
            </div>

            {/* Event Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Event Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-300 outline-none focus:border-sp-coral focus:bg-white focus:ring-2 focus:ring-sp-coral/10 transition-all duration-200"
                placeholder="e.g. Sarah & Mike Wedding"
              />
            </div>

            {/* Event Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Event Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-300 outline-none focus:border-sp-coral focus:bg-white focus:ring-2 focus:ring-sp-coral/10 transition-all duration-200"
              />
            </div>

            {/* Photo Limit */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Photo Limit per Guest</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setPhotoLimit(Math.max(1, photoLimit - 1))}
                    className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={photoLimit}
                    onChange={(e) => setPhotoLimit(Number(e.target.value))}
                    className="w-14 h-11 text-center text-lg font-bold text-gray-900 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoLimit(Math.min(100, photoLimit + 1))}
                    className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-400">shots per guest</p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sp-coral to-sp-magenta text-white font-semibold text-sm hover:shadow-lg hover:shadow-sp-magenta/20 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Event"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
