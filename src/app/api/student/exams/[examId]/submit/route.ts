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

    for (const eq of exam.examQuestions) {
      const q = eq.question;
      const userAns = (answers || []).find((a: any) => a.questionId === q.id);
      const selectedOption = userAns?.selectedOption || null;
      const isFlagged = Boolean(userAns?.isFlagged);

      let isCorrect: boolean | null = null;

      if (selectedOption) {
        if (selectedOption.trim().toUpperCase() === q.correctOption.trim().toUpperCase()) {
          isCorrect = true;
          totalScoreCalculated += (eq.customPoints || q.points);
          if (eq.sectionName.includes("Türkçe")) turkceCorrect++;
          else if (eq.sectionName.includes("Sosyal")) sosyalCorrect++;
          else if (eq.sectionName.includes("Matematik")) matCorrect++;
          else if (eq.sectionName.includes("Fen")) fenCorrect++;
          else matCorrect++;
        } else {
          isCorrect = false;
          if (eq.sectionName.includes("Türkçe")) turkceWrong++;
          else if (eq.sectionName.includes("Sosyal")) sosyalWrong++;
          else if (eq.sectionName.includes("Matematik")) matWrong++;
          else if (eq.sectionName.includes("Fen")) fenWrong++;
          else matWrong++;
        }
      }

      answerRecords.push({
        questionId: q.id,
        selectedOption,
        isFlagged,
        isCorrect,
      });
    }

    // ÖSYM standard net calculation: 4 wrong removes 1 correct (net = correct - wrong / 4)
    const turkceNet = Math.max(0, parseFloat((turkceCorrect - turkceWrong / 4).toFixed(2)));
    const sosyalNet = Math.max(0, parseFloat((sosyalCorrect - sosyalWrong / 4).toFixed(2)));
    const matematikNet = Math.max(0, parseFloat((matCorrect - matWrong / 4).toFixed(2)));
    const fenNet = Math.max(0, parseFloat((fenCorrect - fenWrong / 4).toFixed(2)));
    const totalNet = parseFloat((turkceNet + sosyalNet + matematikNet + fenNet).toFixed(2));

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
        completedAt: updatedAttempt.completedAt,
      },
    });
  } catch (error) {
    console.error("Student Exam Submit Error:", error);
    return NextResponse.json({ success: false, error: "Sınav kaydı tamamlanamadı." }, { status: 500 });
  }
}
