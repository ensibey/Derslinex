import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

/**
 * GET /api/user/my-sessions
 * Verified via HttpOnly derslinex_token JWT or Auth headers.
 */
export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Yetkilendirme oturumu geçersiz veya süresi dolmuş" },
        { status: 401 }
      );
    }

    const { id: userId, role } = user;

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
          joinedAt: p.joinedAt,
          leftAt: p.leftAt,
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
