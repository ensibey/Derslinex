import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: get teacher profile by email or all teachers
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      // Return all teachers ordered by points (highest first) then createdAt
      const teachers = await prisma.teacher.findMany({
        orderBy: [{ points: "desc" }, { createdAt: "desc" }],
      });
      return NextResponse.json({ success: true, teachers });
    }

    const teacher = await prisma.teacher.findFirst({
      where: { email },
    });

    return NextResponse.json({ success: true, teacher });
  } catch (error) {
    console.error("Öğretmen GET Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST: create or update teacher profile
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, branch, egitim, ozgecmis, linkedin, youtube, avatar } = body;

    if (!name || !phone || !email || !branch) {
      return NextResponse.json({ success: false, error: "Tüm alanlar zorunludur" }, { status: 400 });
    }

    // Check if exists
    const existing = await prisma.teacher.findFirst({
      where: { email },
    });

    let teacher;
    if (existing) {
      teacher = await prisma.teacher.update({
        where: { id: existing.id },
        data: { name, phone, branch, egitim, ozgecmis, linkedin, youtube, avatar },
      });
    } else {
      return NextResponse.json({ success: false, error: "Öğretmen bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, teacher });
  } catch (error) {
    console.error("Öğretmen POST Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
