import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { endDailyRoom } from "@/lib/daily";
import { getAuthUser } from "@/lib/auth-middleware";

/**
 * POST /api/sessions/[sessionId]/end
 * Yalnızca öğretmen çağırabilir.
 * Daily.co odasını kapatır, katılım durumlarını günceller.
 * Body: { teacherId }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    const { sessionId: rawId } = await params;
    const sessionId = parseInt(rawId);
    if (!authUser || authUser.role !== "teacher") {
      return NextResponse.json({ success: false, error: "Dersi bitirmek için öğretmen oturumu gereklidir." }, { status: 401 });
    }

    const teacherId = authUser.id;

    const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
    if (!teacher || teacher.isBanned) {
      return NextResponse.json({ success: false, error: "Geçersiz veya engellenmiş öğretmen hesabı" }, { status: 403 });
    }

    const session = await prisma.liveSession.findUnique({
      where: { id: sessionId },
      include: { participants: true },
    });

    if (!session) {
      return NextResponse.json({ success: false, error: "Ders bulunamadı" }, { status: 404 });
    }

    if (session.teacherId !== teacherId) {
      return NextResponse.json({ success: false, error: "Yalnızca bu dersin öğretmeni dersi bitirebilir" }, { status: 403 });
    }

    if (session.status === "ENDED") {
      return NextResponse.json({ success: false, error: "Ders zaten bitti" }, { status: 400 });
    }

    const endTime = new Date();

    // Daily.co odasını sil
    if (session.roomName) {
      await endDailyRoom(session.roomName).catch((e) =>
        console.warn("Daily.co room delete warning:", e)
      );
    }

    // Her katılımcının leftAt ve isAttended değerlerini güncelle
    const updatePromises = session.participants.map((p) => {
      const joinedAt = p.joinedAt ? new Date(p.joinedAt) : null;
      let isAttended = false;

      if (joinedAt) {
        // Ders süresinin en az %50'si kadar kaldıysa yoklama tamam
        const attendedMs = endTime.getTime() - joinedAt.getTime();
        const requiredMs = (session.durationMinutes * 60_000) / 2;
        isAttended = attendedMs >= requiredMs;
      }

      return prisma.sessionParticipant.update({
        where: { id: p.id },
        data: { leftAt: endTime, isAttended },
      });
    });

    await Promise.all(updatePromises);

    // Ders durumunu ENDED yap
    await prisma.liveSession.update({
      where: { id: sessionId },
      data: { status: "ENDED" },
    });

    // Değerlendirme formuna yönlendirmek için öğrenci listesi döner
    const students = await prisma.sessionParticipant.findMany({
      where: { sessionId },
      include: { student: { select: { id: true, name: true } } },
    });

    return NextResponse.json({
      success: true,
      students: students.map((p) => ({
        id: p.student.id,
        name: p.student.name,
        isAttended: p.isAttended,
      })),
    });
  } catch (error) {
    console.error("Session End Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
