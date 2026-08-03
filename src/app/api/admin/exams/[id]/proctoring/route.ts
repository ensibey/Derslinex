import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminAuth } from "@/lib/adminAuth";

// GET: Live proctoring streams and warnings for active exam
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const examId = parseInt(id);

    const attempts = await prisma.studentExamAttempt.findMany({
      where: { examId },
      include: {
        student: {
          select: { id: true, name: true, email: true, phone: true, avatar: true, targetTag: true },
        },
        _count: {
          select: { answers: true },
        },
      },
      orderBy: { startedAt: "desc" },
    });

    return NextResponse.json({ success: true, attempts });
  } catch (error) {
    console.error("Admin Exam Proctoring GET Error:", error);
    return NextResponse.json({ success: false, error: "Gözetmenlik verileri alınamadı." }, { status: 500 });
  }
}
