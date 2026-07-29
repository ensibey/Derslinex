import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/admin/questions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let whereClause = {};
    if (status) {
      whereClause = { status };
    }

    const questions = await prisma.question.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: { teacher: { select: { id: true, name: true, branch: true, points: true } } },
    });

    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error("Admin Questions GET Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// PUT /api/admin/questions - Approve or Reject question
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { questionId, status, rejectionReason } = body; // status: "APPROVED" | "REJECTED" | "PENDING_APPROVAL"

    if (!questionId || !status) {
      return NextResponse.json({ success: false, error: "Soru ID ve Durum zorunludur" }, { status: 400 });
    }

    const existingQuestion = await prisma.question.findUnique({
      where: { id: parseInt(questionId) },
    });

    if (!existingQuestion) {
      return NextResponse.json({ success: false, error: "Soru bulunamadı" }, { status: 404 });
    }

    // If approving for the first time, award points to teacher
    if (status === "APPROVED" && existingQuestion.status !== "APPROVED") {
      await prisma.$transaction([
        prisma.question.update({
          where: { id: parseInt(questionId) },
          data: { status: "APPROVED", rejectionReason: null },
        }),
        prisma.teacher.update({
          where: { id: existingQuestion.teacherId },
          data: { points: { increment: existingQuestion.points } },
        }),
      ]);
    } else {
      await prisma.question.update({
        where: { id: parseInt(questionId) },
        data: {
          status,
          rejectionReason: rejectionReason || null,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Soru durumu güncellendi" });
  } catch (error) {
    console.error("Admin Questions PUT Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// DELETE /api/admin/questions
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");

    if (!idStr) {
      return NextResponse.json({ success: false, error: "Soru ID zorunludur" }, { status: 400 });
    }

    await prisma.question.delete({
      where: { id: parseInt(idStr) },
    });

    return NextResponse.json({ success: true, message: "Soru silindi" });
  } catch (error) {
    console.error("Admin Questions DELETE Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
