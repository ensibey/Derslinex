import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

// GET: Get all chat rooms for a user
export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Sohbet odalarını görmek için oturum açmalısınız." }, { status: 401 });
    }

    let rooms;
    if (authUser.role === "student") {
      rooms = await prisma.chatRoom.findMany({
        where: { studentId: authUser.id },
        orderBy: { createdAt: "desc" },
      });
    } else {
      rooms = await prisma.chatRoom.findMany({
        where: { teacherId: authUser.id },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ success: true, rooms });
  } catch (error) {
    console.error("Rooms GET Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST: Create or find a chat room
export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Sohbet odası oluşturmak için oturum açmalısınız." }, { status: 401 });
    }

    const body = await request.json();
    const { studentId, studentName, teacherId, teacherName } = body;

    if (!studentId || !studentName || !teacherId || !teacherName) {
      return NextResponse.json({ success: false, error: "Eksik parametre" }, { status: 400 });
    }

    const targetStudentId = parseInt(studentId);
    const targetTeacherId = parseInt(teacherId);

    // Verify creator is part of the created room
    if (authUser.role === "student" && authUser.id !== targetStudentId) {
      return NextResponse.json({ success: false, error: "Kendi hesabınız haricinde sohbet odası başlatamazsınız." }, { status: 403 });
    }
    if (authUser.role === "teacher" && authUser.id !== targetTeacherId) {
      return NextResponse.json({ success: false, error: "Kendi hesabınız haricinde sohbet odası başlatamazsınız." }, { status: 403 });
    }

    // Check if room already exists
    let room = await prisma.chatRoom.findFirst({
      where: {
        studentId: targetStudentId,
        teacherId: targetTeacherId,
      },
    });

    if (!room) {
      room = await prisma.chatRoom.create({
        data: {
          studentId: targetStudentId,
          studentName,
          teacherId: targetTeacherId,
          teacherName,
        },
      });
    }

    return NextResponse.json({ success: true, room });
  } catch (error) {
    console.error("Rooms POST Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
