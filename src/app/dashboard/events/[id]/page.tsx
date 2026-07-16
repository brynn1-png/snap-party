"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/lib/supabase/client";
import QRCode from "qrcode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Carousel from "@/components/Carousel";

interface EventData {
  id: string;
  name: string;
  slug: string;
  qr_token: string;
  photo_limit: number;
  event_date: string | null;
  cover_photo_url: string | null;
  created_at: string;
}

interface Photo {
  id: string;
  image_url: string;
  uploaded_at: string;
  session_id: string;
  guest_name: string | null;
}

interface Session {
  id: string;
  session_token: string;
  guest_name: string | null;
  shots_used: number;
  created_at: string;
}

interface Message {
  id: string;
  guest_name: string;
  message: string;
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
  const [downloading, setDownloading] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const supabase = createClient();
  const router = useRouter();

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
          .select("id, session_token, guest_name, shots_used, created_at")
          .eq("event_id", id)
          .order("created_at", { ascending: false });

        if (sessionsData) setSessions(sessionsData);

        const { data: messagesData } = await supabase
          .from("messages")
          .select("id, guest_name, message, created_at")
          .eq("event_id", id)
          .order("created_at", { ascending: false });

        if (messagesData) setMessages(messagesData);
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
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `event_id=eq.${event.id}` },
        (payload) => {
          setMessages((prev) => [payload.new as Message, ...prev]);
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
    setDownloading(true);
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
    setDownloading(false);
  }

  async function handleDeleteEvent() {
    if (!confirm("Are you sure you want to delete this event and all its photos, messages, and guest sessions? This cannot be undone.")) return;
    setDeletingEvent(true);
    await supabase.from("events").delete().eq("id", id);
    router.push("/dashboard");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
            <svg className="w-5 h-5 text-white/40 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-medium text-white/40">Loading event...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-sp-coral/10 border border-sp-coral/20 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-sp-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-white mb-2">Event not found</p>
          <Link href="/dashboard" className="text-sm text-white/40 hover:text-white/60 transition-colors">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      {/* Top bar */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Events
        </Link>
        <button
          onClick={handleDeleteEvent}
          disabled={deletingEvent}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sp-coral/10 border border-sp-coral/20 text-xs font-semibold text-sp-coral hover:bg-sp-coral/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deletingEvent ? (
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          )}
          {deletingEvent ? "Deleting..." : "Delete"}
        </button>
      </div>

      {/* Cover photo banner */}
      {event.cover_photo_url && !coverError ? (
        <div className="relative h-48 sm:h-56 rounded-3xl overflow-hidden mb-8 border border-white/5">
          <img
            src={event.cover_photo_url}
            alt={event.name}
            onError={() => setCoverError(true)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sp-midnight via-sp-midnight/30 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg mb-1">
              {event.name}
            </h1>
            {event.event_date && (
              <p className="text-sm text-white/50">
                {new Date(event.event_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="relative h-48 sm:h-56 rounded-3xl overflow-hidden mb-8 border border-white/5 bg-gradient-to-br from-sp-coral/40 to-sp-magenta/40">
          <div className="absolute inset-0 bg-gradient-to-t from-sp-midnight via-sp-midnight/30 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg mb-1">
              {event.name}
            </h1>
            {event.event_date && (
              <p className="text-sm text-white/50">
                {new Date(event.event_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Event header + QR */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        {/* Event info */}
        <div className="relative md:col-span-2">
          <div className="absolute -inset-1 bg-gradient-to-r from-sp-coral/10 to-sp-violet/10 rounded-3xl blur-xl" />
          <div className="relative p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm h-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {event.name}
            </h1>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                <svg className="w-4 h-4 text-sp-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span className="text-sm text-white/60"><span className="font-bold text-white">{sessions.length}</span> guests</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                <svg className="w-4 h-4 text-sp-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
                </svg>
                <span className="text-sm text-white/60"><span className="font-bold text-white">{photos.length}</span> photos</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                <svg className="w-4 h-4 text-sp-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                </svg>
                <span className="text-sm text-white/60"><span className="font-bold text-white">{event.photo_limit}</span> shots/guest</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-sp-violet/10 to-sp-magenta/10 rounded-3xl blur-xl" />
          <div className="relative p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm text-center h-full flex flex-col items-center justify-center">
            {qrDataUrl ? (
              <>
                <div className="relative mb-4">
                  <div className="absolute -inset-3 bg-white/5 rounded-2xl blur-lg" />
                  <img
                    src={qrDataUrl}
                    alt="Event QR Code"
                    className="relative rounded-xl border border-white/10"
                  />
                </div>
                <p className="text-xs font-semibold text-white/60 mb-1">Scan to join</p>
                <p className="text-[10px] text-white/20 break-all max-w-[200px]">
                  {baseUrl}/e/{event.slug}
                </p>
              </>
            ) : (
              <div className="flex items-center gap-2 text-white/30">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-sm">Generating QR...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Download button */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <button
          onClick={handleDownloadAll}
          disabled={photos.length === 0 || downloading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          )}
          {downloading ? "Downloading..." : `Download ZIP (${photos.length})`}
        </button>
      </div>

      {/* Gallery header */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-white">Live Gallery</h2>
        {photos.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sp-success/10 border border-sp-success/20">
            <div className="w-1.5 h-1.5 rounded-full bg-sp-success animate-pulse" />
            <span className="text-xs font-medium text-sp-success">Live</span>
          </div>
        )}
      </div>

      <Carousel photos={photos} />

      <h2 className="mb-4 text-xl font-bold text-white">Photos</h2>

      {/* Gallery */}
      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-3xl bg-white/[0.02] border border-white/5">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-white/40 mb-1">Waiting for photos...</p>
          <p className="text-xs text-white/20">Photos will appear here in real time as guests take them</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02]">
              <img
                src={photo.image_url}
                alt="Event photo"
                className="aspect-square w-full object-cover"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-sp-midnight/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {photo.guest_name && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                  <p className="text-xs font-bold text-white">
                    {photo.guest_name}
                  </p>
                </div>
              )}
              <button
                onClick={() => handleDelete(photo.id)}
                disabled={deleting === photo.id}
                className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-sp-coral/80 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-sp-coral disabled:opacity-50"
              >
                {deleting === photo.id ? (
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 className="mb-4 mt-8 text-xl font-semibold text-white">
        Guestbook ({messages.length})
      </h2>

      {messages.length === 0 ? (
        <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-8 text-center">
          <p className="text-lg font-semibold text-white/60">
            No messages yet
          </p>
          <p className="mt-2 text-sm text-white/30">
            Messages from guests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60">
                  {msg.guest_name}
                </span>
                <span className="text-xs text-white/30">
                  {new Date(msg.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm font-medium text-white/80">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
