import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/sessions/[sessionId]/feedback
 * Öğretmenin ders sonu değerlendirmesini kaydeder.
 * Body: { teacherId, feedbacks: [{ studentId, rating, comment, homeworkGiven }] }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId: rawId } = await params;
    const sessionId = parseInt(rawId);

    const {
      teacherId,
      feedbacks,
    }: {
      teacherId: number;
      feedbacks: {
        studentId: number;
        rating: number;
        comment?: string;
        homeworkGiven: boolean;
      }[];
    } = await request.json();

    const session = await prisma.liveSession.findUnique({ where: { id: sessionId } });

    if (!session) {
      return NextResponse.json({ success: false, error: "Ders bulunamadı" }, { status: 404 });
    }

    if (session.teacherId !== teacherId) {
      return NextResponse.json({ success: false, error: "Yetkiniz yok" }, { status: 403 });
    }

    // Her öğrenci için değerlendirmeyi upsert et
    const results = await Promise.all(
      feedbacks.map((f) =>
        prisma.sessionFeedback.upsert({
          where: { sessionId_studentId: { sessionId, studentId: f.studentId } },
          create: {
            sessionId,
            teacherId,
            studentId: f.studentId,
            rating: Math.min(5, Math.max(1, f.rating)),
            comment: f.comment,
            homeworkGiven: f.homeworkGiven,
          },
          update: {
            rating: Math.min(5, Math.max(1, f.rating)),
            comment: f.comment,
            homeworkGiven: f.homeworkGiven,
          },
        })
      )
    );

    return NextResponse.json({ success: true, feedbacks: results });
  } catch (error) {
    console.error("Session Feedback Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

/**
 * GET /api/sessions/[sessionId]/feedback
 * Bir dersin değerlendirmelerini getirir.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId: rawId } = await params;
    const sessionId = parseInt(rawId);

    const feedbacks = await prisma.sessionFeedback.findMany({
      where: { sessionId },
      include: {
        student: { select: { id: true, name: true, avatar: true } },
      },
    });

    return NextResponse.json({ success: true, feedbacks });
  } catch (error) {
    console.error("Session Feedback GET Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
