"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSupabase } from "@/lib/supabase/provider";
import { processQueue, startSyncListener } from "@/lib/syncWorker";

interface Photo {
  id: string;
  image_url: string;
  uploaded_at: string;
}

export default function DonePage() {
  const { slug } = useParams<{ slug: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [eventName, setEventName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const supabase = useSupabase();

  const refreshPhotos = useCallback(async (sid: string) => {
    const { data: photosData } = await supabase
      .from("photos")
      .select("id, image_url, uploaded_at")
      .eq("session_id", sid)
      .order("uploaded_at", { ascending: true });

    if (photosData) setPhotos(photosData);
  }, [supabase]);

  useEffect(() => {
    let stopListener: (() => void) | null = null;

    async function init() {
      const sessionToken = localStorage.getItem("current_session_token");
      const guest = localStorage.getItem("current_guest_name") || "";
      setGuestName(guest);

      if (!sessionToken) {
        setLoading(false);
        return;
      }

      const { data: session } = await supabase
        .from("sessions")
        .select("id, event_id")
        .eq("session_token", sessionToken)
        .single();

      if (!session) {
        setLoading(false);
        return;
      }

      const { data: event } = await supabase
        .from("events")
        .select("id, name")
        .eq("id", session.event_id)
        .single();

      if (!event || event.id !== session.event_id) {
        setLoading(false);
        return;
      }

      if (event) setEventName(event.name);

      await refreshPhotos(session.id);
      setLoading(false);

      // Process any remaining queued photos in the background
      setSyncing(true);
      await processQueue(async () => {
        await refreshPhotos(session.id);
      });
      setSyncing(false);

      // Listen for online events to retry failed uploads
      stopListener = startSyncListener(async () => {
        setSyncing(true);
        await refreshPhotos(session.id);
        setSyncing(false);
      });
    }
    init();

    return () => {
      stopListener?.();
    };
  }, [supabase, refreshPhotos]);

  async function handleDownload() {
    setDownloading(true);
    try {
      const JSZip = (await import("jszip")).default;
      const { default: saveAs } = await import("file-saver");
      const zip = new JSZip();
      const folder = zip.folder(`${eventName || slug}-photos`) || zip;

      for (const photo of photos) {
        const response = await fetch(photo.image_url);
        const blob = await response.blob();
        const ext = photo.image_url.split(".").pop()?.split("?")[0] || "jpg";
        folder.file(`${photo.id}.${ext}`, blob);
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${eventName || slug}-photos.zip`);
    } catch {
      // silent fail
    }
    setDownloading(false);
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    const sessionToken = localStorage.getItem("current_session_token");

    const { data: session } = await supabase
      .from("sessions")
      .select("id, event_id")
      .eq("session_token", sessionToken)
      .single();

    if (session) {
      await supabase.from("messages").insert({
        event_id: session.event_id,
        session_id: session.id,
        guest_name: guestName,
        message: message.trim(),
      });
    }

    setMessage("");
    setSent(true);
    setSending(false);
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

  return (
    <div className="min-h-screen bg-sp-midnight px-4 py-12">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-sp-coral/10 via-sp-magenta/10 to-sp-violet/10 rounded-3xl blur-xl" />
          <div className="relative rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8 text-center">
            <div className="mb-4 text-6xl">🎉</div>
            <h1 className="mb-2 text-3xl font-bold text-white">
              You&apos;re All Done!
            </h1>
            {guestName && (
              <p className="mb-1 text-lg text-white/60">
                Thanks, {guestName}!
              </p>
            )}
            <p className="mb-2 text-sm text-white/40">
              {syncing ? "Finishing up your uploads..." : "Your photos have been uploaded."}
            </p>
            {syncing && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin text-sp-warning" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-xs font-medium text-sp-warning">Syncing photos...</span>
              </div>
            )}
            {eventName && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="text-sm font-medium text-white/60">
                  📸 {eventName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Photos */}
        {photos.length > 0 && (
          <div className="relative mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-sp-coral/10 to-sp-violet/10 rounded-3xl blur-xl" />
            <div className="relative rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Your Photos ({photos.length})
              </h2>
              <div className="mb-4 grid grid-cols-3 gap-3">
                {photos.map((photo) => (
                  <div key={photo.id} className="rounded-xl overflow-hidden border border-white/5">
                    <img
                      src={photo.image_url}
                      alt="Your photo"
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {downloading ? "Preparing ZIP..." : `Download All (${photos.length})`}
              </button>
            </div>
          </div>
        )}

        {photos.length === 0 && (
          <div className="mb-8 rounded-3xl bg-white/[0.03] border border-white/10 p-6 text-center">
            <p className="text-sm text-white/40">No photos found for your session.</p>
          </div>
        )}

        {/* Guestbook */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-sp-violet/10 to-sp-magenta/10 rounded-3xl blur-xl" />
          <div className="relative rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Leave a Message
            </h2>
            {sent ? (
              <div className="rounded-xl bg-sp-success/10 border border-sp-success/20 p-4 text-center">
                <p className="text-sm font-medium text-sp-success">
                  🎉 Message sent! Thanks for being part of the memories.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3">
                {guestName && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                    <span className="text-sm font-medium text-white/60">
                      ✍️ {guestName}
                    </span>
                  </div>
                )}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a message for the organizer..."
                  rows={3}
                  required
                  className="w-full resize-none rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-sp-coral/50 focus:bg-white/[0.07] transition-all duration-300"
                />
                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sp-coral to-sp-magenta text-white font-semibold hover:shadow-lg hover:shadow-sp-magenta/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
