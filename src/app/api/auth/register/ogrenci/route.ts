import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, password } = body;

    if (!name || !phone || !email || !password) {
      return NextResponse.json({ success: false, error: "Tüm alanlar zorunludur" }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.student.findFirst({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "Bu e-posta adresiyle kayıtlı bir hesap zaten var." }, { status: 400 });
    }

    // Create student
    const student = await prisma.student.create({
      data: {
        name,
        phone,
        email,
        password: hashPassword(password),
        status: "Beklemede",
      },
    });

    // Remove password before returning
    const { password: _, ...studentWithoutPassword } = student;

    return NextResponse.json({ success: true, student: studentWithoutPassword });
  } catch (error) {
    console.error("Öğrenci Kayıt Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
