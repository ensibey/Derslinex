import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    const studentIdHeader = request.headers.get("x-student-id");
    const studentId = authUser?.id || (studentIdHeader ? parseInt(studentIdHeader) : null);

    if (!studentId || isNaN(studentId)) {
      return NextResponse.json({ success: false, error: "Öğrenci girişi gereklidir." }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ success: false, error: "Öğrenci bulunamadı." }, { status: 404 });
    }

    const studentTag = student.targetTag || "TYT";

    const exams = await prisma.exam.findMany({
      where: {
        status: { in: ["PUBLISHED", "ACTIVE", "ENDED"] },
        OR: [
          { targetTag: "TÜMÜ" },
          { targetTag: studentTag },
        ],
      },
      orderBy: { startTime: "desc" },
      include: {
        _count: {
          select: { examQuestions: true },
        },
        attempts: {
          where: { studentId },
          select: {
            id: true,
            status: true,
            startedAt: true,
            completedAt: true,
            totalNet: true,
            totalScore: true,
          },
        },
      },
    });

    const formattedExams = exams.map((exam: any) => {
      const attempt = exam.attempts[0] || null;
      return {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        examType: exam.examType,
        targetTag: exam.targetTag,
        startTime: exam.startTime,
        endTime: exam.endTime,
        durationMinutes: exam.durationMinutes,
        status: exam.status,
        isCameraRequired: exam.isCameraRequired,
        questionCount: exam._count.examQuestions,
        myAttempt: attempt,
      };
    });

    return NextResponse.json({ success: true, exams: formattedExams });
  } catch (error) {
    console.error("Student Exams GET Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
