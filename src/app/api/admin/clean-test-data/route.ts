import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminAuth } from "@/lib/adminAuth";

/**
 * POST /api/admin/clean-test-data
 * Purges all dummy/test sessions, participants, resources, and feedbacks from DB.
 */
export async function POST(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    // Delete all session related tables
    const feedbackCount = await prisma.sessionFeedback.deleteMany({});
    const resourceCount = await prisma.sessionResource.deleteMany({});
    const participantCount = await prisma.sessionParticipant.deleteMany({});
    const sessionCount = await prisma.liveSession.deleteMany({});

    return NextResponse.json({
      success: true,
      message: "Tüm test/örnek canlı dersler ve katılım verileri veritabanından başarıyla temizlendi.",
      stats: {
        sessionsDeleted: sessionCount.count,
        participantsDeleted: participantCount.count,
        resourcesDeleted: resourceCount.count,
        feedbacksDeleted: feedbackCount.count,
      },
    });
  } catch (error: any) {
    console.error("Clean test data error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Hata oluştu" }, { status: 500 });
  }
}
