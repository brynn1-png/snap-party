"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/lib/supabase/client";
import QRCode from "qrcode";
import Link from "next/link";

interface EventData {
  id: string;
  name: string;
  slug: string;
  qr_token: string;
  photo_limit: number;
  created_at: string;
}

interface Photo {
  id: string;
  image_url: string;
  uploaded_at: string;
  session_id: string;
}

interface Session {
  id: string;
  session_token: string;
  shots_used: number;
  created_at: string;
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [event, setEvent] = useState<EventData | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const supabase = createClient();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window?.location?.origin;

  useEffect(() => {
    async function fetchData() {
      const { data: eventData } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (eventData) {
        setEvent(eventData);

        const qrUrl = `${baseUrl}/e/${eventData.slug}`;
        const dataUrl = await QRCode.toDataURL(qrUrl, {
          width: 300,
          margin: 2,
          color: { dark: "#000000", light: "#FFFFFF" },
        });
        setQrDataUrl(dataUrl);

        const { data: photosData } = await supabase
          .from("photos")
          .select("*")
          .eq("event_id", id)
          .order("uploaded_at", { ascending: false });

        if (photosData) setPhotos(photosData);

        const { data: sessionsData } = await supabase
          .from("sessions")
          .select("*")
          .eq("event_id", id)
          .order("created_at", { ascending: false });

        if (sessionsData) setSessions(sessionsData);
      }
      setLoading(false);
    }
    fetchData();
  }, [id, supabase, baseUrl]);

  useEffect(() => {
    if (!event) return;

    const channel = supabase
      .channel(`photos-${event.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "photos", filter: `event_id=eq.${event.id}` },
        (payload) => {
          setPhotos((prev) => [payload.new as Photo, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "photos", filter: `event_id=eq.${event.id}` },
        (payload) => {
          setPhotos((prev) => prev.filter((p) => p.id !== (payload.old as Photo).id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [event, supabase]);

  async function handleDelete(photoId: string) {
    setDeleting(photoId);
    await supabase.from("photos").delete().eq("id", photoId);
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    setDeleting(null);
  }

  async function handleDownloadAll() {
    if (!event) return;
    const JSZip = (await import("jszip")).default;
    const { default: saveAs } = await import("file-saver");
    const zip = new JSZip();
    const folder = zip.folder(event.name) || zip;

    for (const photo of photos) {
      const response = await fetch(photo.image_url);
      const blob = await response.blob();
      const ext = photo.image_url.split(".").pop()?.split("?")[0] || "jpg";
      folder.file(`${photo.id}.${ext}`, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${event.name}-photos.zip`);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="nb-card bg-nb-yellow p-8 text-center">
          <p className="font-bold uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="nb-card bg-nb-pink p-8 text-center">
          <p className="font-bold uppercase">Event not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <Link
        href="/dashboard"
        className="mb-6 inline-block text-sm font-bold uppercase text-black underline"
      >
        &larr; Back to Events
      </Link>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="nb-card bg-nb-yellow p-6 md:col-span-2">
          <h1 className="mb-2 text-3xl font-black uppercase text-black">
            {event.name}
          </h1>
          <div className="flex flex-wrap gap-4">
            <div className="nb-tag bg-nb-white">
              {sessions.length} guests
            </div>
            <div className="nb-tag bg-nb-white">
              {photos.length} photos
            </div>
            <div className="nb-tag bg-nb-white">
              {event.photo_limit} shots/guest
            </div>
          </div>
        </div>

        <div className="nb-card bg-nb-white p-6 text-center">
          {qrDataUrl ? (
            <>
              <img
                src={qrDataUrl}
                alt="Event QR Code"
                className="mx-auto mb-3 border-2 border-black"
              />
              <p className="text-xs font-bold uppercase text-black">
                Scan to join
              </p>
              <p className="mt-1 break-all text-xs text-black">
                {baseUrl}/e/{event.slug}
              </p>
            </>
          ) : (
            <p className="font-bold uppercase">Generating QR...</p>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={handleDownloadAll}
          disabled={photos.length === 0}
          className="nb-btn bg-nb-lime px-6 py-3 text-black hover:bg-nb-yellow disabled:opacity-50"
        >
          Download ZIP ({photos.length})
        </button>
      </div>

      <h2 className="mb-4 text-xl font-black uppercase text-black">
        Live Gallery
      </h2>

      {photos.length === 0 ? (
        <div className="nb-card bg-nb-blue p-8 text-center">
          <p className="text-lg font-bold uppercase text-black">
            Waiting for photos...
          </p>
          <p className="mt-2 text-sm font-medium text-black">
            Photos will appear here in real time as guests take them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((photo) => (
            <div key={photo.id} className="nb-card-sm group relative bg-nb-white">
              <img
                src={photo.image_url}
                alt="Event photo"
                className="aspect-square w-full object-cover"
              />
              <button
                onClick={() => handleDelete(photo.id)}
                disabled={deleting === photo.id}
                className="absolute right-2 top-2 nb-btn bg-nb-pink px-3 py-1 text-xs text-black opacity-0 transition-opacity group-hover:opacity-100"
              >
                {deleting === photo.id ? "..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
