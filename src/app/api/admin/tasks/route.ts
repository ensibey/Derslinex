import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminAuth } from "@/lib/adminAuth";

// GET /api/admin/tasks
export async function GET(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get("teacherId");

    let tasks;
    if (teacherId) {
      tasks = await prisma.teacherTask.findMany({
        where: { teacherId: parseInt(teacherId) },
        orderBy: { createdAt: "desc" },
        include: { teacher: { select: { id: true, name: true, branch: true, points: true } } },
      });
    } else {
      tasks = await prisma.teacherTask.findMany({
        orderBy: { createdAt: "desc" },
        include: { teacher: { select: { id: true, name: true, branch: true, points: true } } },
      });
    }

    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error("Admin Tasks GET Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST /api/admin/tasks - Assign new task to teacher
export async function POST(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { teacherId, title, description, points } = body;

    if (!teacherId || !title) {
      return NextResponse.json({ success: false, error: "Öğretmen ve Görev Başlığı zorunludur" }, { status: 400 });
    }

    const task = await prisma.teacherTask.create({
      data: {
        teacherId: parseInt(teacherId),
        title,
        description: description || null,
        points: points ? parseInt(points) : 50,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error("Admin Tasks POST Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// PUT /api/admin/tasks - Approve/Reject task and award points
export async function PUT(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { taskId, status } = body; // status: "COMPLETED" | "REJECTED" | "PENDING"

    if (!taskId || !status) {
      return NextResponse.json({ success: false, error: "Görev ID ve Durum zorunludur" }, { status: 400 });
    }

    const existingTask = await prisma.teacherTask.findUnique({
      where: { id: parseInt(taskId) },
    });

    if (!existingTask) {
      return NextResponse.json({ success: false, error: "Görev bulunamadı" }, { status: 404 });
    }

    // If changing to COMPLETED and was not completed before, award points to teacher
    if (status === "COMPLETED" && existingTask.status !== "COMPLETED") {
      await prisma.$transaction([
        prisma.teacherTask.update({
          where: { id: parseInt(taskId) },
          data: { status: "COMPLETED" },
        }),
        prisma.teacher.update({
          where: { id: existingTask.teacherId },
          data: { points: { increment: existingTask.points } },
        }),
      ]);
    } else {
      await prisma.teacherTask.update({
        where: { id: parseInt(taskId) },
        data: { status },
      });
    }

    return NextResponse.json({ success: true, message: "Görev durumu güncellendi" });
  } catch (error) {
    console.error("Admin Tasks PUT Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// DELETE /api/admin/tasks
export async function DELETE(request: Request) {
  const authError = verifyAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");

    if (!idStr) {
      return NextResponse.json({ success: false, error: "Görev ID zorunludur" }, { status: 400 });
    }

    await prisma.teacherTask.delete({
      where: { id: parseInt(idStr) },
    });

    return NextResponse.json({ success: true, message: "Görev silindi" });
  } catch (error) {
    console.error("Admin Tasks DELETE Error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
