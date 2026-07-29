import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

// GET /api/student/topics?studentId=123
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentIdStr = searchParams.get("studentId");
    let studentId = parseInt(studentIdStr || "0");

    if (!studentId) {
      const authUser = await getAuthUser(request);
      if (authUser && authUser.role === "student") {
        studentId = authUser.id;
      }
    }

    if (!studentId) {
      return NextResponse.json({ success: false, error: "Öğrenci ID zorunludur." }, { status: 400 });
    }

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
    const body = await request.json();

    const {
      studentId: bodyStudentId,
      subject,
      topic,
      isCompleted,
    } = body;

    const studentId = authUser && authUser.role === "student" ? authUser.id : (bodyStudentId ? parseInt(bodyStudentId) : null);

    if (!studentId) {
      return NextResponse.json({ success: false, error: "Oturum açmanız gerekmektedir." }, { status: 401 });
    }

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
