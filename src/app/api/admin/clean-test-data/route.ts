import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/admin/clean-test-data
 * Purges all dummy/test sessions, participants, resources, and feedbacks from DB.
 */
export async function GET() {
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
