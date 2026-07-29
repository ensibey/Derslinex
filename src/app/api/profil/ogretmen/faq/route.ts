import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";

// GET: Fetch all FAQs for a specific teacher
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherIdStr = searchParams.get("teacherId");

    if (!teacherIdStr) {
      return NextResponse.json({ success: false, error: "Öğretmen ID gereklidir" }, { status: 400 });
    }

    const faqs = await prisma.teacherFAQ.findMany({
      where: { teacherId: parseInt(teacherIdStr) },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, faqs });
  } catch (error) {
    console.error("FAQ GET Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST: Create a FAQ item
export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();
    const { teacherId, question, answer } = body;

    if (!teacherId || !question || !answer) {
      return NextResponse.json({ success: false, error: "Eksik parametreler" }, { status: 400 });
    }

    const targetTeacherId = parseInt(teacherId);
    if (user && user.role === "teacher" && user.id !== targetTeacherId && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Başkası adına SSS ekleyemezsiniz." }, { status: 403 });
    }

    const faq = await prisma.teacherFAQ.create({
      data: {
        teacherId: targetTeacherId,
        question,
        answer,
      },
    });

    return NextResponse.json({ success: true, faq });
  } catch (error) {
    console.error("FAQ POST Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// DELETE: Delete a FAQ item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");

    if (!idStr) {
      return NextResponse.json({ success: false, error: "FAQ ID gereklidir" }, { status: 400 });
    }

    const id = parseInt(idStr);
    const faqItem = await prisma.teacherFAQ.findUnique({ where: { id } });
    if (!faqItem) {
      return NextResponse.json({ success: false, error: "SSS bulunamadı." }, { status: 404 });
    }

    const user = await getAuthUser(request);
    if (user && user.role === "teacher" && user.id !== faqItem.teacherId && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Bu SSS'yi silme yetkiniz yok." }, { status: 403 });
    }

    await prisma.teacherFAQ.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Soru başarıyla silindi." });
  } catch (error) {
    console.error("FAQ DELETE Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

