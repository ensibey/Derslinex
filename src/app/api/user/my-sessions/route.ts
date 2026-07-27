import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/user/my-sessions
 * Headers: x-user-id, x-user-role ("student" | "teacher")
 * Giriş yapmış kullanıcının atandığı ders oturumlarını getirir.
 */
export async function GET(request: Request) {
  try {
    const headers = request.headers;
    const userId = parseInt(headers.get("x-user-id") || "0");
    const role   = headers.get("x-user-role") as "student" | "teacher" | null;

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: "Yetkilendirme başlıkları eksik" },
        { status: 401 }
      );
    }

    if (role === "teacher") {
      const sessions = await prisma.liveSession.findMany({
        where: { teacherId: userId },
        orderBy: { startTime: "desc" },
        include: {
          participants: {
            include: {
              student: { select: { id: true, name: true, email: true, avatar: true } },
            },
          },
          resources: true,
          feedbacks: true,
        },
      });
      return NextResponse.json({ success: true, sessions });
    }

    if (role === "student") {
      const participations = await prisma.sessionParticipant.findMany({
        where: { studentId: userId },
        include: {
          session: {
            include: {
              teacher: { select: { id: true, name: true, branch: true, avatar: true } },
              resources: true,
              feedbacks: {
                where: { studentId: userId },
              },
            },
          },
        },
        orderBy: { session: { startTime: "desc" } },
      });

      const sessions = participations.map((p) => ({
        ...p.session,
        participation: {
          joinedAt:   p.joinedAt,
          leftAt:     p.leftAt,
          isAttended: p.isAttended,
        },
        myFeedback: p.session.feedbacks[0] ?? null,
      }));

      return NextResponse.json({ success: true, sessions });
    }

    return NextResponse.json({ success: false, error: "Geçersiz rol" }, { status: 400 });
  } catch (error) {
    console.error("my-sessions GET Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
