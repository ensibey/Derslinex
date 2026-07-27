import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateIcsContent, generateGoogleCalendarUrl } from "@/lib/mail";

/**
 * GET /api/sessions/[sessionId]/calendar?type=ics|google
 * Ders için takvim verisi döner.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId: rawId } = await params;
  const sessionId = parseInt(rawId);
  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "google";

  const session = await prisma.liveSession.findUnique({ where: { id: sessionId } });

  if (!session) {
    return NextResponse.json({ error: "Ders bulunamadı" }, { status: 404 });
  }

  if (type === "ics") {
    const icsContent = generateIcsContent({
      id: session.id,
      title: session.title,
      startTime: session.startTime,
      durationMinutes: session.durationMinutes,
      description: session.description,
    });

    return new NextResponse(icsContent, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="ders-${session.id}.ics"`,
      },
    });
  }

  // Google Takvim URL yönlendirmesi
  const googleUrl = generateGoogleCalendarUrl({
    title: session.title,
    startTime: session.startTime,
    durationMinutes: session.durationMinutes,
    description: session.description,
  });

  return NextResponse.redirect(googleUrl);
}
