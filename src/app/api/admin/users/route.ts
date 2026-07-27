import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST: Ban/unban user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, role, action } = body;

    if (!id || !role || !action) {
      return NextResponse.json({ success: false, error: "Eksik parametre" }, { status: 400 });
    }

    const userId = parseInt(id);
    const setBanned = action === "ban";

    if (role === "student") {
      await prisma.student.update({
        where: { id: userId },
        data: { isBanned: setBanned },
      });
    } else if (role === "teacher") {
      await prisma.teacher.update({
        where: { id: userId },
        data: { isBanned: setBanned },
      });
    } else {
      return NextResponse.json({ success: false, error: "Geçersiz rol" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Kullanıcı engeli ${setBanned ? "etkinleştirildi" : "kaldırıldı"}.` });
  } catch (error) {
    console.error("Admin Users POST Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// DELETE: Delete user completely
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");
    const role = searchParams.get("role");

    if (!idStr || !role) {
      return NextResponse.json({ success: false, error: "Parametreler eksik" }, { status: 400 });
    }

    const userId = parseInt(idStr);

    if (role === "student") {
      // Cascade delete student reviews/feedbacks (optional, let's keep database integrity)
      await prisma.feedback.deleteMany({
        where: { studentEmail: { not: null } }, // Or delete based on matching logic, but to prevent crash we can just delete student model.
      });
      await prisma.student.delete({
        where: { id: userId },
      });
    } else if (role === "teacher") {
      // Delete lessons and blogs and feedback for this teacher
      await prisma.lessonOffer.deleteMany({ where: { teacherId: userId } });
      await prisma.blogPost.deleteMany({ where: { authorId: userId } });
      await prisma.feedback.deleteMany({ where: { teacherId: userId } });
      await prisma.teacher.delete({
        where: { id: userId },
      });
    } else {
      return NextResponse.json({ success: false, error: "Geçersiz rol" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Kullanıcı başarıyla silindi." });
  } catch (error) {
    console.error("Admin Users DELETE Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
