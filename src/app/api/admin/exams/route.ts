import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminAuth } from "@/lib/adminAuth";

// GET: List all exams and approved question pool stats
export async function GET(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const exams = await prisma.exam.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        examQuestions: {
          include: {
            question: true,
          },
          orderBy: { orderNo: "asc" },
        },
        _count: {
          select: { attempts: true },
        },
      },
    });

    const approvedQuestions = await prisma.question.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        subject: true,
        examType: true,
        topic: true,
        difficulty: true,
        questionText: true,
        imageUrl: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        optionE: true,
        correctOption: true,
        points: true,
        teacher: {
          select: { name: true, branch: true },
        },
      },
    });

    return NextResponse.json({ success: true, exams, approvedQuestions });
  } catch (error) {
    console.error("Admin Exams GET Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST: Create a new online exam
export async function POST(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      title,
      description,
      examType,
      targetTag,
      startTime,
      endTime,
      durationMinutes,
      isCameraRequired,
      questionItems, // [{ questionId: number, sectionName?: string, orderNo?: number }]
    } = body;

    if (!title || !startTime || !endTime || !durationMinutes) {
      return NextResponse.json({ success: false, error: "Lütfen sınav başlığı, başlama/bitiş tarihi ve süreyi giriniz." }, { status: 400 });
    }

    const exam = await prisma.exam.create({
      data: {
        title,
        description: description || "",
        examType: examType || "TYT",
        targetTag: targetTag || "TÜMÜ",
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        durationMinutes: parseInt(String(durationMinutes)) || 135,
        isCameraRequired: isCameraRequired !== undefined ? Boolean(isCameraRequired) : true,
        status: "PUBLISHED",
        examQuestions: {
          create: (questionItems || []).map((item: any, idx: number) => ({
            questionId: item.questionId,
            sectionName: item.sectionName || "Genel",
            orderNo: item.orderNo || idx + 1,
            customPoints: item.customPoints || null,
          })),
        },
      },
      include: {
        examQuestions: {
          include: { question: true },
        },
      },
    });

    return NextResponse.json({ success: true, exam });
  } catch (error) {
    console.error("Admin Exam Create Error:", error);
    return NextResponse.json({ success: false, error: "Sınav oluşturulamadı." }, { status: 500 });
  }
}
