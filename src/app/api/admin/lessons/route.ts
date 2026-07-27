import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Fetch all lesson offers across all teachers
export async function GET() {
  try {
    const lessons = await prisma.lessonOffer.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Fetch teachers details to merge names
    const teachers = await prisma.teacher.findMany();
    const merged = lessons.map((l) => {
      const teacher = teachers.find((t) => t.id === l.teacherId);
      return {
        ...l,
        teacherName: teacher ? teacher.name : "Bilinmeyen Öğretmen",
      };
    });

    return NextResponse.json({ success: true, lessons: merged });
  } catch (error) {
    console.error("Admin Lessons GET Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// DELETE: Delete a lesson offer
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");

    if (!idStr) {
      return NextResponse.json({ success: false, error: "İlan ID gereklidir" }, { status: 400 });
    }

    await prisma.lessonOffer.delete({
      where: { id: parseInt(idStr) },
    });

    return NextResponse.json({ success: true, message: "Ders ilanı başarıyla kaldırıldı." });
  } catch (error) {
    console.error("Admin Lessons DELETE Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
