"use client";

import { useEffect, useState, useMemo, use } from "react";
import { createClient } from "@/lib/supabase/client";
import QRCode from "qrcode";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

interface Activity {
  id: string;
  type: "photo" | "scan" | "message";
  guest_name: string;
  detail: string;
  created_at: string;
}

function UploadsChart({ photos }: { photos: Photo[] }) {
  const [nowMs] = useState(() => Date.now());
  const { chartData, recentCount } = useMemo(() => {
    const now = new Date(nowMs);
    const hours: number[] = new Array(24).fill(0);
    let recent = 0;
    photos.forEach((p) => {
      const d = new Date(p.uploaded_at);
      const diffMs = nowMs - d.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours >= 0 && diffHours < 24) {
        hours[23 - diffHours]++;
      }
      if (diffMs < 60 * 60 * 1000) {
        recent++;
      }
    });
    const max = Math.max(...hours, 1);
    const data = hours.map((count, i) => ({
      hour: i,
      count,
      pct: (count / max) * 100,
      label: `${((i + (now.getHours() - 23 + 24) % 24) % 24).toString().padStart(2, "0")}:00`,
    }));
    return { chartData: data, recentCount: recent };
  }, [photos]);

  const svgPoints = chartData
    .map((d, i) => `${(i / 23) * 100},${100 - d.pct}`)
    .join(" ");
  const svgArea = `0,100 ${svgPoints} 100,100`;

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-sp-success animate-pulse" />
          <h3 className="text-sm font-semibold text-gray-900">Live Uploads</h3>
          <span className="text-xs text-gray-400">Real-time</span>
        </div>
        <span className="text-xs font-medium text-gray-400 px-3 py-1 rounded-full bg-gray-50 border border-gray-100">Today</span>
      </div>

      <div className="relative h-44">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <polygon points={svgArea} fill="url(#chartGrad)" />
          <polyline
            points={svgPoints}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{recentCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">uploads this hour</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-3 text-[10px] text-gray-300">
        {["12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM", "Now"].map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function ActivityFeed({ activity }: { activity: Activity[] }) {
  const [nowMs] = useState(() => Date.now());
  const iconMap = {
    photo: (
      <div className="w-8 h-8 rounded-full bg-sp-coral/10 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-sp-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
        </svg>
      </div>
    ),
    scan: (
      <div className="w-8 h-8 rounded-full bg-sp-violet/10 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-sp-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
        </svg>
      </div>
    ),
    message: (
      <div className="w-8 h-8 rounded-full bg-sp-teal/10 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-sp-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      </div>
    ),
  };

  const activityWithTime = useMemo(() => {
    return activity.map((a) => {
      const seconds = Math.floor((nowMs - new Date(a.created_at).getTime()) / 1000);
      let timeStr: string;
      if (seconds < 60) {
        timeStr = "just now";
      } else if (seconds < 3600) {
        timeStr = `${Math.floor(seconds / 60)}m ago`;
      } else if (seconds < 86400) {
        timeStr = `${Math.floor(seconds / 3600)}h ago`;
      } else {
        timeStr = `${Math.floor(seconds / 86400)}d ago`;
      }
      return { ...a, timeStr };
    });
  }, [activity]);

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
        <span className="text-xs font-medium text-sp-violet cursor-pointer hover:text-sp-purple transition-colors">View All</span>
      </div>
      <div className="space-y-4">
        {activityWithTime.length === 0 ? (
          <p className="text-sm text-gray-300 text-center py-4">No activity yet</p>
        ) : (
          activityWithTime.map((a) => (
            <div key={a.id} className="flex items-center gap-3">
              {iconMap[a.type]}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">{a.guest_name}</span>{" "}
                  {a.detail}
                </p>
                <p className="text-xs text-gray-300 mt-0.5">{a.timeStr}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
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
  const [galleryFilter, setGalleryFilter] = useState<"all" | "photos">("all");
  const [galleryView, setGalleryView] = useState<"grid" | "list">("grid");
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

  const activity = useMemo<Activity[]>(() => {
    const items: Activity[] = [];

    photos.slice(0, 10).forEach((p) => {
      items.push({
        id: `photo-${p.id}`,
        type: "photo",
        guest_name: p.guest_name || "Someone",
        detail: "uploaded a photo",
        created_at: p.uploaded_at,
      });
    });

    sessions.slice(0, 5).forEach((s) => {
      if (s.guest_name) {
        items.push({
          id: `scan-${s.id}`,
          type: "scan",
          guest_name: s.guest_name,
          detail: "scanned the QR code",
          created_at: s.created_at,
        });
      }
    });

    messages.slice(0, 5).forEach((m) => {
      items.push({
        id: `msg-${m.id}`,
        type: "message",
        guest_name: m.guest_name,
        detail: "left a message",
        created_at: m.created_at,
      });
    });

    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return items.slice(0, 15);
  }, [photos, sessions, messages]);

  const filteredPhotos = useMemo(() => {
    if (galleryFilter === "photos") return photos;
    return photos;
  }, [photos, galleryFilter]);

  const todayPhotos = photos.filter((p) => {
    const d = new Date(p.uploaded_at);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;

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

  function handlePrint() {
    if (photos.length === 0) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const imgs = photos.map((p) => `<img src="${p.image_url}" style="max-width:300px;max-height:300px;margin:8px;border-radius:8px;" />`).join("");
    printWindow.document.write(`<!DOCTYPE html><html><head><title>${event?.name || "Event"} - Photos</title><style>body{font-family:sans-serif;text-align:center;padding:20px;} h1{margin-bottom:20px;} img{display:inline-block;}</style></head><body><h1>${event?.name || "Event"} Photos</h1><div>${imgs}</div></body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
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
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <svg className="w-5 h-5 text-gray-300 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-medium text-gray-400">Loading event...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-sp-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-2">Event not found</p>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-72 sm:h-80 lg:h-96 overflow-hidden">
        {event.cover_photo_url && !coverError ? (
          <img
            src={event.cover_photo_url}
            alt={event.name}
            onError={() => setCoverError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sp-coral/20 via-sp-violet/20 to-sp-magenta/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Back button - top left corner */}
        <Link
          href="/dashboard"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-10 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-black/30 backdrop-blur-sm text-sm font-medium text-white/80 hover:text-white hover:bg-black/50 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </Link>

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-7xl w-full">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full bg-sp-success text-[11px] font-bold text-white uppercase tracking-wide">Live</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">{event.name}</h1>
            {event.event_date && (
              <p className="text-sm text-white/60 mb-4">
                {new Date(event.event_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <Link
                href={`/e/${event.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-semibold text-white hover:bg-white/20 transition-all duration-200"
              >
                View Event Page
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </Link>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${baseUrl}/e/${event.slug}`);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sp-violet text-sm font-semibold text-white hover:bg-sp-purple transition-all duration-200"
              >
                Share Event
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 -mt-6 relative z-10">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sp-violet/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-sp-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Guests</p>
              <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
              <p className="text-[11px] text-gray-300">Total Scans</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sp-info/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-sp-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Photos</p>
              <p className="text-2xl font-bold text-gray-900">{photos.length}</p>
              <p className="text-[11px] text-gray-300">Total Uploaded</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sp-success/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-sp-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Uploads</p>
              <p className="text-2xl font-bold text-gray-900">{todayPhotos}</p>
              <p className="text-[11px] text-sp-success font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sp-success inline-block" /> Live
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sp-orange/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-sp-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Shots</p>
              <p className="text-2xl font-bold text-gray-900">{event.photo_limit}</p>
              <p className="text-[11px] text-gray-300"> per Guest</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Uploads Chart */}
            <UploadsChart photos={photos} />

            {/* Live Gallery */}
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-sp-success animate-pulse" />
                  <h3 className="text-sm font-semibold text-gray-900">Live Gallery</h3>
                  <span className="text-xs text-gray-400">{photos.length} photos</span>
                </div>
                <div className="flex items-center gap-2">
                  <select className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sp-violet/20">
                    <option>Newest First</option>
                    <option>Oldest First</option>
                  </select>
                  <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg p-0.5">
                    <button
                      onClick={() => setGalleryView("grid")}
                      className={`p-1.5 rounded-md transition-colors ${galleryView === "grid" ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setGalleryView("list")}
                      className={`p-1.5 rounded-md transition-colors ${galleryView === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-1 mb-5 p-1 bg-gray-50 rounded-lg w-fit">
                {(["all", "photos"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setGalleryFilter(f)}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 capitalize ${
                      galleryFilter === f
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Gallery Grid */}
              {filteredPhotos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-400 mb-1">Waiting for photos...</p>
                  <p className="text-xs text-gray-300">Photos will appear here in real time as guests take them</p>
                </div>
              ) : galleryView === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredPhotos.map((photo, idx) => (
                    <div key={photo.id} className="group relative rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                      <img
                        src={photo.image_url}
                        alt="Event photo"
                        className="aspect-square w-full object-cover"
                      />
                      {idx < 3 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-sp-violet text-[10px] font-bold text-white uppercase tracking-wide">New</span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {photo.guest_name && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-xs font-bold text-white">{photo.guest_name}</p>
                        </div>
                      )}
                      <button
                        onClick={() => handleDelete(photo.id)}
                        disabled={deleting === photo.id}
                        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 disabled:opacity-50"
                      >
                        {deleting === photo.id ? (
                          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPhotos.map((photo) => (
                    <div key={photo.id} className="group flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                      <img
                        src={photo.image_url}
                        alt="Event photo"
                        className="w-14 h-14 rounded-lg object-cover border border-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{photo.guest_name || "Guest"}</p>
                        <p className="text-xs text-gray-300">{new Date(photo.uploaded_at).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(photo.id)}
                        disabled={deleting === photo.id}
                        className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* QR Code */}
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 text-center">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Event QR Code</h3>
              <p className="text-xs text-gray-400 mb-4">Scan to join the event</p>
              {qrDataUrl ? (
                <>
                  <div className="inline-block p-3 bg-white rounded-2xl border border-gray-100 shadow-sm mb-4">
                    <img
                      src={qrDataUrl}
                      alt="Event QR Code"
                      className="w-44 h-44"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="text-xs text-gray-400 truncate max-w-[180px]">{baseUrl}/e/{event.slug}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(`${baseUrl}/e/${event.slug}`)}
                      className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center gap-2 text-gray-300 py-8">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-sm">Generating QR...</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleDownloadAll}
                disabled={photos.length === 0 || downloading}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-sp-violet/10 transition-colors">
                  {downloading ? (
                    <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-sp-violet transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  )}
                </div>
                <span className="text-[11px] font-medium text-gray-500">{downloading ? "Saving..." : "Download"}</span>
              </button>

              <button
                onClick={handlePrint}
                disabled={photos.length === 0}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-sp-violet/10 transition-colors">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-sp-violet transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m0 0a48.159 48.159 0 018.5 0m-8.5 0V6.75a2 2 0 012-2h4.5a2 2 0 012 2v1.022" />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-gray-500">Print</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${baseUrl}/e/${event.slug}`);
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-sp-violet/10 transition-colors">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-sp-violet transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-gray-500">Share</span>
              </button>
            </div>

            {/* Guestbook */}
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-gray-900">Guestbook ({messages.length})</h3>
              </div>
              {messages.length === 0 ? (
                <p className="text-sm text-gray-300 text-center py-4">No messages yet</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-semibold text-gray-700">{msg.guest_name}</span>
                        <span className="text-[10px] text-gray-300">{new Date(msg.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Delete Event */}
            <button
              onClick={handleDeleteEvent}
              disabled={deletingEvent}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-sm font-semibold text-red-500 hover:bg-red-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingEvent ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              )}
              {deletingEvent ? "Deleting..." : "Delete Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
