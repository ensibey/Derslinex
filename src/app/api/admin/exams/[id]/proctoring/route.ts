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
