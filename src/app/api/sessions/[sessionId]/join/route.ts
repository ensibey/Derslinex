import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDailyMeetingToken } from "@/lib/daily";

/**
 * POST /api/sessions/[sessionId]/join
 * Kullanıcıyı doğrular ve Daily.co meeting token döner.
 * Body: { userId, role: "student" | "teacher" }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId: rawId } = await params;
    const sessionId = parseInt(rawId);
    const body = await request.json();
    const { userId, role, userName }: { userId: number; role: "student" | "teacher"; userName: string } = body;

    if (!userId || !role) {
      return NextResponse.json({ success: false, error: "Eksik parametreler" }, { status: 400 });
    }

    const session = await prisma.liveSession.findUnique({
      where: { id: sessionId },
      include: { participants: true },
    });

    if (!session) {
      return NextResponse.json({ success: false, error: "Ders bulunamadı" }, { status: 404 });
    }

    if (session.status === "CANCELLED" || session.status === "ENDED") {
      return NextResponse.json({ success: false, error: "Bu ders sona erdi" }, { status: 403 });
    }

    if (!session.roomName || !session.roomUrl) {
      return NextResponse.json({ success: false, error: "Oda henüz hazır değil" }, { status: 503 });
    }

    // Yetki kontrolü
    const isTeacher = role === "teacher" && session.teacherId === userId;
    const isStudent = role === "student" && session.participants.some((p) => p.studentId === userId);

    if (!isTeacher && !isStudent) {
      return NextResponse.json({ success: false, error: "Bu derse erişim yetkiniz yok" }, { status: 403 });
    }

    // Token geçerlilik süresi: en az 24 saat veya ders bitiş zamanından 2 saat sonrası
    const nowSec = Math.floor(Date.now() / 1000);
    const startSec = Math.floor(new Date(session.startTime).getTime() / 1000);
    const ejectAt = Math.max(nowSec + 24 * 3600, startSec + ((session.durationMinutes || 60) + 120) * 60);

    const token = await getDailyMeetingToken(
      session.roomName,
      isTeacher,
      String(userId),
      userName || (isTeacher ? "Öğretmen" : "Öğrenci"),
      ejectAt
    );

    // Katılım zamanını kaydet
    if (isStudent) {
      await prisma.sessionParticipant.update({
        where: { sessionId_studentId: { sessionId, studentId: userId } },
        data: { joinedAt: new Date() },
      }).catch((e) => console.warn("Participant joinedAt update warning:", e));
    }

    // Eğer ilk katılımsa durumu LIVE yap
    if (session.status === "SCHEDULED") {
      await prisma.liveSession.update({
        where: { id: sessionId },
        data: { status: "LIVE" },
      }).catch((e) => console.warn("Session status LIVE update warning:", e));
    }

    return NextResponse.json({
      success: true,
      token,
      roomUrl: session.roomUrl,
      roomName: session.roomName,
      isOwner: isTeacher,
    });
  } catch (error: any) {
    console.error("Session Join Error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Sunucu hatası" }, { status: 500 });
  }
}
