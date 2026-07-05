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

    if (!file || !eventId || !sessionId) {
      return NextResponse.json(
        { error: "Missing file, eventId, or sessionId" },
        { status: 400 }
      );
    }

    const filePath = `events/${eventId}/${sessionId}/${Date.now()}.jpg`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(filePath, buffer, {
        contentType: "image/jpeg",
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
    });

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    const { data: session } = await supabase
      .from("sessions")
      .select("shots_used")
      .eq("id", sessionId)
      .single();

    const newShotsUsed = (session?.shots_used ?? 0) + 1;

    await supabase
      .from("sessions")
      .update({ shots_used: newShotsUsed })
      .eq("id", sessionId);

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
