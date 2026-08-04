import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

// GET /api/student/topics?studentId=123
export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Konu takibini görmek için oturum açmanız gerekmektedir." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentIdStr = searchParams.get("studentId");
    const requestedStudentId = studentIdStr ? parseInt(studentIdStr) : authUser.id;

    if (isNaN(requestedStudentId)) {
      return NextResponse.json({ success: false, error: "Geçersiz öğrenci ID" }, { status: 400 });
    }

    if (authUser.role === "student" && authUser.id !== requestedStudentId) {
      return NextResponse.json({ success: false, error: "Başka bir öğrencinin konu takibine erişim yetkiniz yok." }, { status: 403 });
    }

    const studentId = requestedStudentId;

    const progress = await prisma.studentTopicProgress.findMany({
      where: { studentId },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Topics GET error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST /api/student/topics - Toggle topic completed status
export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== "student") {
      return NextResponse.json({ success: false, error: "Konu takibini güncellemek için öğrenci olarak oturum açmanız gerekmektedir." }, { status: 401 });
    }

    const body = await request.json();

    const {
      subject,
      topic,
      isCompleted,
    } = body;

    const studentId = authUser.id;

    if (!subject || !topic) {
      return NextResponse.json({ success: false, error: "Ders ve konu zorunludur." }, { status: 400 });
    }

    const entry = await prisma.studentTopicProgress.upsert({
      where: {
        studentId_subject_topic: {
          studentId,
          subject,
          topic,
        },
      },
      update: {
        isCompleted: !!isCompleted,
      },
      create: {
        studentId,
        subject,
        topic,
        isCompleted: !!isCompleted,
      },
    });

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error("Topics POST error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
