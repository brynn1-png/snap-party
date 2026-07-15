"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
  const supabase = createClient();

  useEffect(() => {
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
        .select("name")
        .eq("id", session.event_id)
        .single();

      if (event) setEventName(event.name);

      const { data: photosData } = await supabase
        .from("photos")
        .select("id, image_url, uploaded_at")
        .eq("session_id", session.id)
        .order("uploaded_at", { ascending: true });

      if (photosData) setPhotos(photosData);
      setLoading(false);
    }
    init();
  }, [supabase]);

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
      <div className="flex min-h-screen items-center justify-center bg-nb-lime px-4">
        <div className="nb-card bg-nb-white p-8 text-center">
          <p className="font-bold uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nb-lime px-4 py-12">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="nb-card mb-8 bg-nb-white p-8 text-center">
          <div className="mb-4 text-6xl">🎉</div>
          <h1 className="mb-2 text-3xl font-black uppercase text-black">
            You&apos;re All Done!
          </h1>
          {guestName && (
            <p className="mb-1 text-lg font-bold text-black">
              Thanks, {guestName}!
            </p>
          )}
          <p className="mb-2 font-medium text-black">
            Your photos have been uploaded.
          </p>
          {eventName && (
            <div className="nb-card-sm mt-4 bg-nb-yellow p-3">
              <p className="text-sm font-bold uppercase text-black">
                📸 {eventName}
              </p>
            </div>
          )}
        </div>

        {/* Photos */}
        {photos.length > 0 && (
          <div className="nb-card mb-8 bg-nb-white p-6">
            <h2 className="mb-4 text-lg font-black uppercase text-black">
              Your Photos ({photos.length})
            </h2>
            <div className="mb-4 grid grid-cols-3 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="nb-card-sm overflow-hidden bg-nb-white">
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
              className="nb-btn w-full bg-nb-lime py-3 text-black hover:bg-nb-yellow disabled:opacity-50"
            >
              {downloading ? "Preparing ZIP..." : `Download All (${photos.length})`}
            </button>
          </div>
        )}

        {photos.length === 0 && (
          <div className="nb-card mb-8 bg-nb-white p-6 text-center">
            <p className="font-medium text-black">No photos found for your session.</p>
          </div>
        )}

        {/* Guestbook */}
        <div className="nb-card bg-nb-white p-6">
          <h2 className="mb-4 text-lg font-black uppercase text-black">
            Leave a Message
          </h2>
          {sent ? (
            <div className="nb-card-sm bg-nb-lime p-4 text-center">
              <p className="font-bold uppercase text-black">
                🎉 Message sent! Thanks for being part of the memories.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-3">
              {guestName && (
                <div className="nb-card-sm bg-nb-yellow p-3">
                  <p className="text-sm font-bold uppercase text-black">
                    ✍️ {guestName}
                  </p>
                </div>
              )}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a message for the organizer..."
                rows={3}
                required
                className="w-full resize-none border-3 border-black bg-nb-white px-4 py-3 font-medium text-black outline-none focus:bg-nb-lime"
              />
              <button
                type="submit"
                disabled={sending || !message.trim()}
                className="nb-btn w-full bg-nb-pink py-3 text-black hover:bg-nb-orange disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
