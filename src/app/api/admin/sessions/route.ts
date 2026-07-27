import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createDailyRoom } from "@/lib/daily";
import { sendSessionAssignedMail } from "@/lib/mail";

/**
 * POST /api/admin/sessions/create
 * Admin tarafından yeni bir canlı ders oluşturur.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      teacherId,
      studentIds,
      startTime,
      durationMinutes,
      capacity,
      recordSession,
    }: {
      title: string;
      description?: string;
      teacherId: number;
      studentIds: number[];
      startTime: string;
      durationMinutes: number;
      capacity: number;
      recordSession: boolean;
    } = body;

    if (!title || !teacherId || !studentIds?.length || !startTime || !durationMinutes) {
      return NextResponse.json(
        { success: false, error: "Eksik parametreler" },
        { status: 400 }
      );
    }

    const start = new Date(startTime);
    // Odanın geçerlilik süresi: ders başlangıcına kadar + ders süresi + 30 dk tampon
    const nowSec = Math.floor(Date.now() / 1000);
    const startSec = Math.floor(start.getTime() / 1000);
    const expirySeconds = Math.max(startSec - nowSec + durationMinutes * 60 + 1800, 3600);

    // 1. Daily.co'da oda oluştur
    const room = await createDailyRoom(expirySeconds, recordSession);

    // 2. Öğretmeni doğrula
    const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
    if (!teacher) {
      return NextResponse.json({ success: false, error: "Öğretmen bulunamadı" }, { status: 404 });
    }

    // 3. Öğrencileri doğrula
    const students = await prisma.student.findMany({
      where: { id: { in: studentIds } },
    });
    if (students.length === 0) {
      return NextResponse.json({ success: false, error: "Öğrenci bulunamadı" }, { status: 404 });
    }

    // 4. LiveSession kaydet
    const session = await prisma.liveSession.create({
      data: {
        title,
        description,
        capacity: capacity || studentIds.length,
        startTime: start,
        durationMinutes,
        roomName: room.name,
        roomUrl: room.url,
        recordSession,
        teacherId,
        participants: {
          create: students.map((s) => ({ studentId: s.id })),
        },
      },
      include: { participants: { include: { student: true } } },
    });

    // 5. Mail gönder (öğretmen + öğrenciler)
    const mailPayload = {
      id: session.id,
      title: session.title,
      startTime: session.startTime,
      durationMinutes: session.durationMinutes,
      description: session.description,
    };

    const mailPromises: Promise<void>[] = [
      sendSessionAssignedMail(teacher.email, teacher.name, "teacher", mailPayload),
      ...students.map((s) => sendSessionAssignedMail(s.email, s.name, "student", mailPayload)),
    ];

    // Mail hataları dersi engellemez, loglansın yeter
    await Promise.allSettled(mailPromises);

    return NextResponse.json({ success: true, session });
  } catch (error: any) {
    console.error("Admin Sessions Create Error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Sunucu hatası" }, { status: 500 });
  }
}

/**
 * GET /api/admin/sessions
 * Tüm oturumları listeler.
 */
export async function GET() {
  try {
    const sessions = await prisma.liveSession.findMany({
      orderBy: { startTime: "desc" },
      include: {
        teacher: { select: { id: true, name: true, branch: true } },
        participants: {
          include: { student: { select: { id: true, name: true, email: true } } },
        },
        resources: true,
        feedbacks: true,
      },
    });
    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    console.error("Admin Sessions GET Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
