import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, password, branch } = body;

    if (!name || !phone || !email || !password || !branch) {
      return NextResponse.json({ success: false, error: "Tüm alanlar zorunludur" }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.teacher.findFirst({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "Bu e-posta adresiyle kayıtlı bir hesap zaten var." }, { status: 400 });
    }

    // Create teacher
    const teacher = await prisma.teacher.create({
      data: {
        name,
        phone,
        email,
        password: hashPassword(password),
        branch,
        status: "Beklemede",
      },
    });

    // Remove password before returning
    const { password: _, ...teacherWithoutPassword } = teacher;

    return NextResponse.json({ success: true, teacher: teacherWithoutPassword });
  } catch (error) {
    console.error("Öğretmen Kayıt Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
