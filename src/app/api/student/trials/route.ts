import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

// GET /api/student/trials?studentId=123
export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Deneme netlerini görmek için oturum açmanız gerekmektedir." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentIdStr = searchParams.get("studentId");
    const requestedStudentId = studentIdStr ? parseInt(studentIdStr) : authUser.id;

    if (isNaN(requestedStudentId)) {
      return NextResponse.json({ success: false, error: "Geçersiz öğrenci ID" }, { status: 400 });
    }

    if (authUser.role === "student" && authUser.id !== requestedStudentId) {
      return NextResponse.json({ success: false, error: "Başka bir öğrencinin denemelerine erişim yetkiniz yok." }, { status: 403 });
    }

    const studentId = requestedStudentId;

    const trials = await prisma.studentTrialResult.findMany({
      where: { studentId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ success: true, trials });
  } catch (error) {
    console.error("Trials GET error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST /api/student/trials - Add new trial result
export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== "student") {
      return NextResponse.json({ success: false, error: "Deneme neti kaydetmek için öğrenci olarak oturum açmanız gerekmektedir." }, { status: 401 });
    }

    const body = await request.json();

    const {
      title,
      examType,
      turkceNet,
      sosyalNet,
      matematikNet,
      fenNet,
    } = body;

    const studentId = authUser.id;

    if (!title) {
      return NextResponse.json({ success: false, error: "Deneme adı zorunludur." }, { status: 400 });
    }

    const turkce = parseFloat(turkceNet || 0);
    const sosyal = parseFloat(sosyalNet || 0);
    const mat = parseFloat(matematikNet || 0);
    const fen = parseFloat(fenNet || 0);
    const toplamNet = turkce + sosyal + mat + fen;

    const trial = await prisma.studentTrialResult.create({
      data: {
        studentId,
        title,
        examType: examType || "TYT",
        turkceNet: turkce,
        sosyalNet: sosyal,
        matematikNet: mat,
        fenNet: fen,
        toplamNet,
      },
    });

    return NextResponse.json({ success: true, trial });
  } catch (error) {
    console.error("Trials POST error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
