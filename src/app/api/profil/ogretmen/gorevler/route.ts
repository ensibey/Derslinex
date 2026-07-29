import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/profil/ogretmen/gorevler?teacherId=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get("teacherId");

    if (!teacherId) {
      return NextResponse.json({ success: false, error: "Öğretmen ID zorunludur" }, { status: 400 });
    }

    const tasks = await prisma.teacherTask.findMany({
      where: { teacherId: parseInt(teacherId) },
      orderBy: { createdAt: "desc" },
    });

    const teacher = await prisma.teacher.findUnique({
      where: { id: parseInt(teacherId) },
      select: { points: true },
    });

    return NextResponse.json({ success: true, tasks, points: teacher?.points || 0 });
  } catch (error) {
    console.error("Öğretmen Görevler GET Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST /api/profil/ogretmen/gorevler - Submit task completion proof
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { taskId, proof } = body;

    if (!taskId) {
      return NextResponse.json({ success: false, error: "Görev ID zorunludur" }, { status: 400 });
    }

    const task = await prisma.teacherTask.update({
      where: { id: parseInt(taskId) },
      data: {
        status: "SUBMITTED",
        proof: proof || "Görev tamamlandı olarak işaretlendi.",
      },
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error("Öğretmen Görevler POST Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
