import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

export async function POST(
  request: Request,
  context: { params: Promise<{ examId: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    const studentIdHeader = request.headers.get("x-student-id");
    const studentId = authUser && authUser.role === "student" ? authUser.id : (process.env.NODE_ENV === "development" && studentIdHeader ? parseInt(studentIdHeader) : null);

    if (!studentId) {
      return NextResponse.json({ success: false, error: "Öğrenci girişi gereklidir." }, { status: 401 });
    }
    const { examId } = await context.params;
    const numericExamId = parseInt(examId);

    const body = await request.json();
    const { answers, focusWarnings } = body; // answers: Array<{ questionId: number, selectedOption: string | null, isFlagged?: boolean }>

    const exam = await prisma.exam.findUnique({
      where: { id: numericExamId },
      include: {
        examQuestions: {
          include: { question: true },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ success: false, error: "Sınav bulunamadı." }, { status: 404 });
    }

    const attempt = await prisma.studentExamAttempt.findUnique({
      where: {
        examId_studentId: {
          examId: numericExamId,
          studentId,
        },
      },
    });

    if (!attempt) {
      return NextResponse.json({ success: false, error: "Aktif sınav oturumu bulunamadı." }, { status: 404 });
    }

    let turkceCorrect = 0, turkceWrong = 0;
    let sosyalCorrect = 0, sosyalWrong = 0;
    let matCorrect = 0, matWrong = 0;
    let fenCorrect = 0, fenWrong = 0;
    let totalScoreCalculated = 0;

    const answerRecords: any[] = [];
    const topicMap: Record<string, { correct: number; wrong: number; empty: number; total: number }> = {};

    const resolveCategory = (sec: string, subj: string): "turkce" | "sosyal" | "mat" | "fen" => {
      const text = `${sec || ""} ${subj || ""}`.toLowerCase();
      if (/türkçe|turkce|edebiyat/.test(text)) return "turkce";
      if (/sosyal|tarih|coğrafya|cografya|felsefe|din/.test(text)) return "sosyal";
      if (/matematik|geometri/.test(text)) return "mat";
      if (/fen|fizik|kimya|biyoloji/.test(text)) return "fen";
      return "mat";
    };

    for (const eq of exam.examQuestions) {
      const q = eq.question;
      const userAns = (answers || []).find((a: any) => a.questionId === q.id);
      const selectedOption = userAns?.selectedOption || null;
      const isFlagged = Boolean(userAns?.isFlagged);

      let isCorrect: boolean | null = null;
      const topicName = q.topic && q.topic.trim() ? q.topic.trim() : (q.subject || "Genel Konular");

      if (!topicMap[topicName]) {
        topicMap[topicName] = { correct: 0, wrong: 0, empty: 0, total: 0 };
      }
      topicMap[topicName].total++;

      const cat = resolveCategory(eq.sectionName, q.subject);

      if (selectedOption) {
        if (selectedOption.trim().toUpperCase() === q.correctOption.trim().toUpperCase()) {
          isCorrect = true;
          totalScoreCalculated += (eq.customPoints || q.points);
          topicMap[topicName].correct++;
          if (cat === "turkce") turkceCorrect++;
          else if (cat === "sosyal") sosyalCorrect++;
          else if (cat === "mat") matCorrect++;
          else if (cat === "fen") fenCorrect++;
        } else {
          isCorrect = false;
          topicMap[topicName].wrong++;
          if (cat === "turkce") turkceWrong++;
          else if (cat === "sosyal") sosyalWrong++;
          else if (cat === "mat") matWrong++;
          else if (cat === "fen") fenWrong++;
        }
      } else {
        topicMap[topicName].empty++;
      }

      answerRecords.push({
        questionId: q.id,
        selectedOption,
        isFlagged,
        isCorrect,
      });
    }

    // ÖSYM standard net calculation: 4 wrong removes 1 correct (net = correct - wrong / 4)
    const rawTurkceNet = parseFloat((turkceCorrect - turkceWrong / 4).toFixed(2));
    const rawSosyalNet = parseFloat((sosyalCorrect - sosyalWrong / 4).toFixed(2));
    const rawMatematikNet = parseFloat((matCorrect - matWrong / 4).toFixed(2));
    const rawFenNet = parseFloat((fenCorrect - fenWrong / 4).toFixed(2));

    const turkceNet = Math.max(0, rawTurkceNet);
    const sosyalNet = Math.max(0, rawSosyalNet);
    const matematikNet = Math.max(0, rawMatematikNet);
    const fenNet = Math.max(0, rawFenNet);
    const totalNet = Math.max(0, parseFloat((rawTurkceNet + rawSosyalNet + rawMatematikNet + rawFenNet).toFixed(2)));

    // Transaction: Delete existing attempt answers, re-create, update attempt & create StudentTrialResult
    const updatedAttempt = await prisma.$transaction(async (tx: any) => {
      await tx.studentExamAnswer.deleteMany({
        where: { attemptId: attempt.id },
      });

      await tx.studentExamAnswer.createMany({
        data: answerRecords.map((ar) => ({
          attemptId: attempt.id,
          questionId: ar.questionId,
          selectedOption: ar.selectedOption,
          isFlagged: ar.isFlagged,
          isCorrect: ar.isCorrect,
        })),
      });

      const updated = await tx.studentExamAttempt.update({
        where: { id: attempt.id },
        data: {
          completedAt: new Date(),
          status: "SUBMITTED",
          focusWarnings: focusWarnings || 0,
          turkceNet,
          sosyalNet,
          matematikNet,
          fenNet,
          totalNet,
          totalScore: totalScoreCalculated,
        },
        include: {
          answers: true,
        },
      });

      // Also store in StudentTrialResult so it appears in student's Trial tracking statistics tab!
      await tx.studentTrialResult.create({
        data: {
          studentId,
          title: exam.title,
          examType: exam.examType,
          turkceNet,
          sosyalNet,
          matematikNet,
          fenNet,
          toplamNet: totalNet,
        },
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      result: {
        attemptId: updatedAttempt.id,
        turkceNet,
        sosyalNet,
        matematikNet,
        fenNet,
        totalNet,
        totalScore: totalScoreCalculated,
        turkceCorrect, turkceWrong,
        sosyalCorrect, sosyalWrong,
        matCorrect, matWrong,
        fenCorrect, fenWrong,
        topicBreakdown: topicMap,
        completedAt: updatedAttempt.completedAt,
      },
    });
  } catch (error) {
    console.error("Student Exam Submit Error:", error);
    return NextResponse.json({ success: false, error: "Sınav kaydı tamamlanamadı." }, { status: 500 });
  }
}
