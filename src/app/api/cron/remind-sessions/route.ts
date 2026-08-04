import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendSessionReminderMail } from "@/lib/mail";

/**
 * GET /api/cron/remind-sessions
 * Vercel Cron tarafından her 30 dakikada çalıştırılır.
 * 45-75 dakika sonra başlayacak dersleri bulur ve hatırlatma maili atar.
 * Authorization: Bearer ${CRON_SECRET}
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRITICAL: CRON_SECRET is not configured in environment.");
    return NextResponse.json({ error: "Sunucu cron yapılandırma hatası. CRON_SECRET tanımlı değil." }, { status: 500 });
  }

  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const now      = new Date();
    const from     = new Date(now.getTime() + 45 * 60_000);   // 45 dk sonra
    const to       = new Date(now.getTime() + 75 * 60_000);   // 75 dk sonra

    const sessions = await prisma.liveSession.findMany({
      where: {
        status:      "SCHEDULED",
        reminderSent: false,
        startTime: { gte: from, lte: to },
      },
      include: {
        teacher: { select: { email: true, name: true } },
        participants: {
          include: { student: { select: { email: true, name: true } } },
        },
      },
    });

    let mailsSent = 0;

    for (const session of sessions) {
      const mailPayload = {
        id:              session.id,
        title:           session.title,
        startTime:       session.startTime,
        durationMinutes: session.durationMinutes,
        description:     session.description,
      };

      const promises: Promise<void>[] = [
        sendSessionReminderMail(session.teacher.email, session.teacher.name, mailPayload),
        ...session.participants.map((p) =>
          sendSessionReminderMail(p.student.email, p.student.name, mailPayload)
        ),
      ];

      const results = await Promise.allSettled(promises);
      mailsSent += results.filter((r) => r.status === "fulfilled").length;

      // Bu dersi bir daha hatırlatma
      await prisma.liveSession.update({
        where: { id: session.id },
        data: { reminderSent: true },
      });
    }

    return NextResponse.json({
      success: true,
      sessionsProcessed: sessions.length,
      mailsSent,
    });
  } catch (error) {
    console.error("Cron remind-sessions Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
