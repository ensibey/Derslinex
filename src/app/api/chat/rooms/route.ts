import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Get all chat rooms for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentIdStr = searchParams.get("studentId");
    const teacherIdStr = searchParams.get("teacherId");

    if (!studentIdStr && !teacherIdStr) {
      return NextResponse.json({ success: false, error: "Giriş yapılmış olmalıdır" }, { status: 400 });
    }

    let rooms;
    if (studentIdStr) {
      rooms = await prisma.chatRoom.findMany({
        where: { studentId: parseInt(studentIdStr) },
        orderBy: { createdAt: "desc" },
      });
    } else {
      rooms = await prisma.chatRoom.findMany({
        where: { teacherId: parseInt(teacherIdStr!) },
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
    const body = await request.json();
    const { studentId, studentName, teacherId, teacherName } = body;

    if (!studentId || !studentName || !teacherId || !teacherName) {
      return NextResponse.json({ success: false, error: "Eksik parametre" }, { status: 400 });
    }

    // Check if room already exists
    let room = await prisma.chatRoom.findFirst({
      where: {
        studentId: parseInt(studentId),
        teacherId: parseInt(teacherId),
      },
    });

    if (!room) {
      room = await prisma.chatRoom.create({
        data: {
          studentId: parseInt(studentId),
          studentName,
          teacherId: parseInt(teacherId),
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
