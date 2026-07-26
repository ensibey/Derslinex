import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "E-posta ve şifre zorunludur" }, { status: 400 });
    }

    const teacher = await prisma.teacher.findFirst({
      where: { email },
    });

    if (!teacher || !verifyPassword(password, teacher.password)) {
      return NextResponse.json({ success: false, error: "Geçersiz e-posta adresi veya şifre." }, { status: 400 });
    }

    // Remove password before returning
    const { password: _, ...teacherWithoutPassword } = teacher;

    return NextResponse.json({ success: true, teacher: teacherWithoutPassword });
  } catch (error) {
    console.error("Öğretmen Giriş Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
