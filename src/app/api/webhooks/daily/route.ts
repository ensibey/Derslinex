import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/webhooks/daily
 * Daily.co kayıt tamamlandığında çağırır.
 * Payload: Daily.co recording.ready webhook event
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Daily.co webhook yapısı
    const { event_type, payload } = body;

    if (event_type !== "recording.ready") {
      return NextResponse.json({ received: true });
    }

    const roomName: string = payload?.room_name;
    const recordingUrl: string = payload?.download_url || payload?.url;

    if (!roomName || !recordingUrl) {
      return NextResponse.json(
        { success: false, error: "Eksik payload" },
        { status: 400 }
      );
    }

    // roomName ile oturumu bul
    const session = await prisma.liveSession.findFirst({
      where: { roomName },
    });

    if (!session) {
      console.warn("Webhook: Oturum bulunamadı, roomName:", roomName);
      return NextResponse.json({ received: true });
    }

    await prisma.liveSession.update({
      where: { id: session.id },
      data: { recordingUrl },
    });

    console.log(`Session ${session.id} için kayıt URL'si güncellendi:`, recordingUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Daily.co Webhook Error:", error);
    return NextResponse.json({ success: false, error: "Webhook hatası" }, { status: 500 });
  }
}
