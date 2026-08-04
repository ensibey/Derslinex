import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

// GET /api/student/wrong-questions?studentId=123
export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Yanlış sorularınızı görmek için oturum açmanız gerekmektedir." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentIdStr = searchParams.get("studentId");
    const requestedStudentId = studentIdStr ? parseInt(studentIdStr) : authUser.id;

    if (isNaN(requestedStudentId)) {
      return NextResponse.json({ success: false, error: "Geçersiz öğrenci ID" }, { status: 400 });
    }

    if (authUser.role === "student" && authUser.id !== requestedStudentId) {
      return NextResponse.json({ success: false, error: "Başka bir öğrencinin yanlış sorularına erişim yetkiniz yok." }, { status: 403 });
    }

    const studentId = requestedStudentId;

    // Fetch attempts where isCorrect === false
    const wrongAttempts = await prisma.studentQuestionAttempt.findMany({
      where: {
        studentId,
        isCorrect: false,
      },
      select: {
        id: true,
        questionId: true,
        selectedOption: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (wrongAttempts.length === 0) {
      return NextResponse.json({ success: true, wrongQuestions: [] });
    }

    const questionIds = Array.from(new Set(wrongAttempts.map((a) => a.questionId)));

    // Fetch question details from Question model
    const questions = await prisma.question.findMany({
      where: {
        id: { in: questionIds },
      },
    });

    const questionMap = new Map(questions.map((q) => [q.id, q]));

    const result = wrongAttempts
      .map((attempt) => {
        const q = questionMap.get(attempt.questionId);
        if (!q) return null;
        return {
          attemptId: attempt.id,
          selectedOption: attempt.selectedOption,
          attemptDate: attempt.createdAt,
          question: q,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return NextResponse.json({ success: true, wrongQuestions: result });
  } catch (error) {
    console.error("Wrong questions GET error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
