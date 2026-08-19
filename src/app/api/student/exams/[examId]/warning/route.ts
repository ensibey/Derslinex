import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== "student") {
      return NextResponse.json(
        { success: false, error: "Oturum açmanız gerekmektedir." },
        { status: 401 }
      );
    }

    const { examId: examIdStr } = await params;
    const examId = parseInt(examIdStr, 10);
    if (isNaN(examId)) {
      return NextResponse.json({ success: false, error: "Geçersiz sınav ID" }, { status: 400 });
    }

    const attempt = await prisma.studentExamAttempt.findUnique({
      where: {
        examId_studentId: {
          examId,
          studentId: authUser.id,
        },
      },
    });

    if (!attempt || attempt.status !== "IN_PROGRESS") {
      return NextResponse.json(
        { success: false, error: "Devam eden bir sınav bulunamadı." },
        { status: 404 }
      );
    }

    const updated = await prisma.studentExamAttempt.update({
      where: { id: attempt.id },
      data: {
        focusWarnings: { increment: 1 },
      },
      select: { focusWarnings: true },
    });

    return NextResponse.json({ success: true, focusWarnings: updated.focusWarnings });
  } catch (error) {
    console.error("Focus warning sync error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
