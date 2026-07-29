import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

// GET /api/student/topics - fetch student topic checklist progress
export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== "student") {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim" }, { status: 401 });
    }

    const progress = await prisma.studentTopicProgress.findMany({
      where: { studentId: authUser.id },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Student Topics GET Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST /api/student/topics - toggle topic completion status
export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== "student") {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const { subject, topic, isCompleted } = body;

    if (!subject || !topic) {
      return NextResponse.json({ success: false, error: "Ders ve konu adı zorunludur" }, { status: 400 });
    }

    const progress = await prisma.studentTopicProgress.upsert({
      where: {
        studentId_subject_topic: {
          studentId: authUser.id,
          subject,
          topic,
        },
      },
      update: {
        isCompleted: Boolean(isCompleted),
      },
      create: {
        studentId: authUser.id,
        subject,
        topic,
        isCompleted: Boolean(isCompleted),
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Student Topics POST Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
