import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: get student profile by email
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      // If no email, return all students (useful for admin)
      const students = await prisma.student.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, students });
    }

    const student = await prisma.student.findFirst({
      where: { email },
    });

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error("Öğrenci GET Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

// POST: create or update student profile
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email } = body;

    if (!name || !phone || !email) {
      return NextResponse.json({ success: false, error: "Tüm alanlar zorunludur" }, { status: 400 });
    }

    // Check if exists
    const existing = await prisma.student.findFirst({
      where: { email },
    });

    let student;
    if (existing) {
      student = await prisma.student.update({
        where: { id: existing.id },
        data: { name, phone },
      });
    } else {
      return NextResponse.json({ success: false, error: "Öğrenci bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error("Öğrenci POST Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
