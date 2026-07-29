import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/webhooks/daily
 * Daily.co kayıt tamamlandığında çağırır.
 * Payload: Daily.co recording.ready webhook event
 */
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret") || request.headers.get("x-webhook-secret");
    const expectedSecret = process.env.DAILY_WEBHOOK_SECRET || (process.env.NODE_ENV === "development" ? "derslinex_webhook_secret_2026" : undefined);

    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json({ success: false, error: "Yetkisiz webhook çağrısı" }, { status: 401 });
    }

    const body = await request.json();
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
