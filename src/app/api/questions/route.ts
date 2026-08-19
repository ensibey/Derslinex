import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

// GET /api/questions?teacherId=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get("teacherId");

    if (!teacherId) {
      return NextResponse.json({ success: false, error: "Öğretmen ID zorunludur" }, { status: 400 });
    }

    const parsedTeacherId = parseInt(teacherId);
    if (isNaN(parsedTeacherId)) {
      return NextResponse.json({ success: false, error: "Geçersiz öğretmen ID" }, { status: 400 });
    }

    const questions = await prisma.question.findMany({
      where: { teacherId: parsedTeacherId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error("Teacher Questions GET Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST /api/questions - Submit new question
export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== "teacher") {
      return NextResponse.json({ success: false, error: "Soru yüklemek için öğretmen oturumu gereklidir." }, { status: 401 });
    }
    if (authUser.isBanned) {
      return NextResponse.json({ success: false, error: "Hesabınız engellenmiştir. Soru yükleyemezsiniz." }, { status: 403 });
    }

    const teacherId = authUser.id;
    const body = await request.json();
    const {
      subject,
      examType,
      topic,
      difficulty,
      questionText,
      imageUrl,
      optionA,
      optionB,
      optionC,
      optionD,
      optionE,
      correctOption,
      solutionText,
      points,
    } = body;

    if (!teacherId || !subject || !questionText || !optionA || !optionB || !correctOption) {
      return NextResponse.json({ success: false, error: "Ders, soru metni, A/B şıkları ve doğru cevap zorunludur" }, { status: 400 });
    }

    const question = await prisma.question.create({
      data: {
        teacherId,
        subject,
        examType: examType || "TYT",
        topic: topic || null,
        difficulty: difficulty || "Orta",
        questionText,
        imageUrl: imageUrl || null,
        optionA,
        optionB,
        optionC: optionC || "",
        optionD: optionD || "",
        optionE: optionE || "",
        correctOption,
        solutionText: solutionText || null,
        points: points ? parseInt(points) : 20,
        status: "PENDING_APPROVAL",
      },
    });

    return NextResponse.json({ success: true, question });
  } catch (error) {
    console.error("Teacher Questions POST Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
