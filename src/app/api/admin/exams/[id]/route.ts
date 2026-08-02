import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function verifyAdminAuth(request: Request) {
  const adminKey = request.headers.get("x-admin-key");
  const expectedKey = process.env.NEXT_PUBLIC_ADMIN_SECRET || "derslinex_admin_secret_2026";
  if (adminKey !== expectedKey) {
    return NextResponse.json({ success: false, error: "Yetkisiz erişim. Geçersiz Admin Anahtarı." }, { status: 401 });
  }
  return null;
}

// GET: Single exam details
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const examId = parseInt(id);

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        examQuestions: {
          include: { question: true },
          orderBy: { orderNo: "asc" },
        },
        attempts: {
          include: {
            student: {
              select: { id: true, name: true, email: true, phone: true, avatar: true },
            },
          },
          orderBy: { startedAt: "desc" },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ success: false, error: "Deneme sınavı bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ success: true, exam });
  } catch (error) {
    console.error("Admin Exam GET Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// PUT: Update exam status or fields
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const examId = parseInt(id);
    const body = await request.json();

    const updatedExam = await prisma.exam.update({
      where: { id: examId },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.title && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.durationMinutes && { durationMinutes: parseInt(String(body.durationMinutes)) }),
        ...(body.isCameraRequired !== undefined && { isCameraRequired: Boolean(body.isCameraRequired) }),
      },
    });

    return NextResponse.json({ success: true, exam: updatedExam });
  } catch (error) {
    console.error("Admin Exam PUT Error:", error);
    return NextResponse.json({ success: false, error: "Sınav güncellenemedi." }, { status: 500 });
  }
}

// DELETE: Delete exam
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const examId = parseInt(id);

    await prisma.exam.delete({
      where: { id: examId },
    });

    return NextResponse.json({ success: true, message: "Sınav silindi." });
  } catch (error) {
    console.error("Admin Exam DELETE Error:", error);
    return NextResponse.json({ success: false, error: "Sınav silinemedi." }, { status: 500 });
  }
}
