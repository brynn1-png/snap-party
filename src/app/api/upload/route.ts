import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const eventId = formData.get("eventId") as string;
    const sessionId = formData.get("sessionId") as string;
    const guestName = formData.get("guestName") as string || null;

    if (!file || !eventId || !sessionId) {
      return NextResponse.json(
        { error: "Missing file, eventId, or sessionId" },
        { status: 400 }
      );
    }

    const { data: event } = await supabase
      .from("events")
      .select("photo_limit")
      .eq("id", eventId)
      .single();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Atomically reserves a shot slot and enforces photo_limit server-side —
    // the client-side counter is only a UI convenience and cannot be trusted.
    const { data: newShotsUsed, error: incrementError } = await supabase.rpc(
      "increment_session_shots",
      { p_session_id: sessionId, p_limit: event.photo_limit }
    );

    if (incrementError) {
      return NextResponse.json({ error: incrementError.message }, { status: 500 });
    }

    if (newShotsUsed === null) {
      return NextResponse.json({ error: "Shot limit reached" }, { status: 403 });
    }

    const ext = file.type === "image/webp" ? "webp" : "jpg";
    const contentType = file.type === "image/webp" ? "image/webp" : "image/jpeg";
    const filePath = `events/${eventId}/${sessionId}/${Date.now()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(filePath, buffer, {
        contentType,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from("photos")
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase.from("photos").insert({
      event_id: eventId,
      session_id: sessionId,
      image_url: urlData.publicUrl,
      file_size: file.size,
      guest_name: guestName,
    });

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      imageUrl: urlData.publicUrl,
      shotsUsed: newShotsUsed,
    });
  } catch {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
