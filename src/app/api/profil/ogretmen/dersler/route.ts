import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

// GET: Get all lessons for a specific teacher
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherIdStr = searchParams.get("teacherId");

    if (!teacherIdStr) {
      return NextResponse.json({ success: false, error: "teacherId parametresi gereklidir" }, { status: 400 });
    }

    const teacherId = parseInt(teacherIdStr);
    const lessons = await prisma.lessonOffer.findMany({
      where: { teacherId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, lessons });
  } catch (error) {
    console.error("Ders GET Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST: Create a new lesson offer
export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();
    const { teacherId, title, price, format, description } = body;

    if (!teacherId || !title || price === undefined || !format) {
      return NextResponse.json({ success: false, error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    const targetTeacherId = parseInt(teacherId);

    // Verify requesting user is teacher and matches teacherId (or in dev mode)
    if (user && user.role === "teacher" && user.id !== targetTeacherId && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Başkası adına ders açamazsınız." }, { status: 403 });
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: targetTeacherId },
    });

    if (!teacher) {
      return NextResponse.json({ success: false, error: "Öğretmen bulunamadı" }, { status: 404 });
    }

    if (teacher.status !== "İletişime Geçildi") {
      return NextResponse.json({ success: false, error: "Profiliniz henüz onaylanmadığı için ders açamazsınız." }, { status: 403 });
    }

    const newOffer = await prisma.lessonOffer.create({
      data: {
        teacherId: targetTeacherId,
        title,
        price: parseFloat(price),
        format,
        description,
      },
    });

    return NextResponse.json({ success: true, lesson: newOffer });
  } catch (error) {
    console.error("Ders POST Hatası:", error);
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

    const id = parseInt(idStr);

    const lesson = await prisma.lessonOffer.findUnique({ where: { id } });
    if (!lesson) {
      return NextResponse.json({ success: false, error: "Ders bulunamadı." }, { status: 404 });
    }

    const user = await getAuthUser(request);
    if (user && user.role === "teacher" && user.id !== lesson.teacherId && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Bu dersi silme yetkiniz yok." }, { status: 403 });
    }

    await prisma.lessonOffer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Ders başarıyla silindi" });
  } catch (error) {
    console.error("Ders DELETE Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

