import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

interface SubmittedAnswer {
  questionId: number;
  selectedOption: string; // "A", "B", "C", "D", "E" or "" (empty)
}

// GET /api/student/questions/submit?studentId=123 - Fetch student's past quiz results
export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const studentIdStr = searchParams.get("studentId");

    if (!authUser) {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim. Oturum açmanız gerekmektedir." }, { status: 401 });
    }

    const requestedStudentId = studentIdStr ? parseInt(studentIdStr) : authUser.id;

    if (authUser.role === "student" && authUser.id !== requestedStudentId) {
      return NextResponse.json({ success: false, error: "Başka bir öğrencinin sınav sonuçlarına erişim yetkiniz yok." }, { status: 403 });
    }

    const studentId = requestedStudentId;

    const quizResults = await prisma.studentQuizResult.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
      include: {
        attempts: {
          include: {
            question: {
              select: {
                id: true,
                subject: true,
                topic: true,
                questionText: true,
                correctOption: true,
                solutionText: true,
                solutionVideoUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, quizResults });
  } catch (error) {
    console.error("Student Quiz Results GET Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST /api/student/questions/submit - Grade answers server-side & save result
export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== "student") {
      return NextResponse.json({ success: false, error: "Soru çözümü göndermek için öğrenci olarak oturum açmanız gerekmektedir." }, { status: 401 });
    }

    const body = await request.json();
    const { examType = "TYT", subject = "Genel", answers } = body as {
      examType?: string;
      subject?: string;
      answers: SubmittedAnswer[];
    };

    const studentId = authUser.id;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ success: false, error: "Geçersiz istek. Cevaplar zorunludur." }, { status: 400 });
    }

    // Verify student exists
    const student = await prisma.student.findUnique({
      where: { id: parseInt(String(studentId)) },
    });

    if (!student) {
      return NextResponse.json({ success: false, error: "Öğrenci bulunamadı." }, { status: 404 });
    }

    if (student.isBanned) {
      return NextResponse.json({ success: false, error: "Hesabınız engellenmiştir. İşlem yapamazsınız." }, { status: 403 });
    }

    // Fetch all question IDs from database
    const questionIds = answers.map((a) => a.questionId);
    const dbQuestions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
    });

    const questionMap = new Map(dbQuestions.map((q) => [q.id, q]));

    let correctCount = 0;
    let wrongCount = 0;
    let emptyCount = 0;
    let totalPoints = 0;

    const processedAttempts: Array<{
      questionId: number;
      selectedOption: string;
      isCorrect: boolean;
      correctOption: string;
      solutionText: string | null;
      questionText: string;
    }> = [];

    for (const ans of answers) {
      const q = questionMap.get(ans.questionId);
      if (!q) continue;

      const selected = (ans.selectedOption || "").trim().toUpperCase();
      let isCorrect = false;

      if (!selected) {
        emptyCount++;
      } else if (selected === q.correctOption.trim().toUpperCase()) {
        correctCount++;
        isCorrect = true;
        totalPoints += q.points || 20;
      } else {
        wrongCount++;
      }

      processedAttempts.push({
        questionId: q.id,
        selectedOption: selected,
        isCorrect,
        correctOption: q.correctOption,
        solutionText: q.solutionText,
        questionText: q.questionText,
      });
    }

    // Standard OSYM Net calculation: Correct - (Wrong / 4)
    const netScore = Math.max(0, parseFloat((correctCount - wrongCount / 4).toFixed(2)));

    // Save StudentQuizResult & attempts in transaction
    const quizResult = await prisma.studentQuizResult.create({
      data: {
        studentId: student.id,
        examType,
        subject,
        totalQuestions: answers.length,
        correctCount,
        wrongCount,
        emptyCount,
        netScore,
        totalPoints,
        attempts: {
          create: processedAttempts.map((pa) => ({
            studentId: student.id,
            questionId: pa.questionId,
            selectedOption: pa.selectedOption,
            isCorrect: pa.isCorrect,
          })),
        },
      },
      include: {
        attempts: true,
      },
    });

    return NextResponse.json({
      success: true,
      result: {
        id: quizResult.id,
        netScore,
        correctCount,
        wrongCount,
        emptyCount,
        totalQuestions: answers.length,
        totalPoints,
        createdAt: quizResult.createdAt,
        details: processedAttempts,
      },
    });
  } catch (error) {
    console.error("Student Question Submit Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası oluştu." }, { status: 500 });
  }
}
