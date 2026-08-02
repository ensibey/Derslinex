import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  context: { params: Promise<{ examId: string }> }
) {
  try {
    const studentIdHeader = request.headers.get("x-student-id");
    if (!studentIdHeader) {
      return NextResponse.json({ success: false, error: "Öğrenci girişi gereklidir." }, { status: 401 });
    }
    const studentId = parseInt(studentIdHeader);
    const { examId } = await context.params;
    const numericExamId = parseInt(examId);

    const body = await request.json().catch(() => ({}));
    const hasCamera = Boolean(body.hasCamera);

    const exam = await prisma.exam.findUnique({
      where: { id: numericExamId },
      include: {
        examQuestions: {
          include: {
            question: true,
          },
          orderBy: { orderNo: "asc" },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ success: false, error: "Deneme sınavı bulunamadı." }, { status: 404 });
    }

    const now = new Date();
    if (now < new Date(exam.startTime)) {
      return NextResponse.json({ success: false, error: "Deneme sınavı henüz başlamadı." }, { status: 400 });
    }

    if (now > new Date(exam.endTime)) {
      return NextResponse.json({ success: false, error: "Deneme sınavı süresi sona ermiştir." }, { status: 400 });
    }

    // Create or find student attempt
    let attempt = await prisma.studentExamAttempt.findUnique({
      where: {
        examId_studentId: {
          examId: numericExamId,
          studentId,
        },
      },
      include: {
        answers: true,
      },
    });

    if (!attempt) {
      attempt = await prisma.studentExamAttempt.create({
        data: {
          examId: numericExamId,
          studentId,
          hasCamera,
          status: "IN_PROGRESS",
        },
        include: {
          answers: true,
        },
      });
    } else if (attempt.status === "SUBMITTED" || attempt.status === "TIMED_OUT") {
      return NextResponse.json({
        success: false,
        error: "Bu sınavı daha önce tamamladınız.",
        attempt,
      }, { status: 400 });
    }

    // Strip correct options and solutions so student cannot inspect payload
    const safeQuestions = exam.examQuestions.map((eq: any) => {
      const q = eq.question;
      const studentAns = attempt?.answers.find((a: any) => a.questionId === q.id);
      return {
        id: q.id,
        examQuestionId: eq.id,
        orderNo: eq.orderNo,
        sectionName: eq.sectionName,
        subject: q.subject,
        examType: q.examType,
        topic: q.topic,
        difficulty: q.difficulty,
        questionText: q.questionText,
        imageUrl: q.imageUrl,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        optionE: q.optionE,
        points: eq.customPoints || q.points,
        selectedOption: studentAns?.selectedOption || null,
        isFlagged: studentAns?.isFlagged || false,
      };
    });

    return NextResponse.json({
      success: true,
      exam: {
        id: exam.id,
        title: exam.title,
        examType: exam.examType,
        durationMinutes: exam.durationMinutes,
        isCameraRequired: exam.isCameraRequired,
        startTime: exam.startTime,
        endTime: exam.endTime,
      },
      attempt: {
        id: attempt.id,
        startedAt: attempt.startedAt,
        focusWarnings: attempt.focusWarnings,
      },
      questions: safeQuestions,
    });
  } catch (error) {
    console.error("Student Exam Start Error:", error);
    return NextResponse.json({ success: false, error: "Sınav başlatılamadı." }, { status: 500 });
  }
}
