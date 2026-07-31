import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { signToken } from "@/lib/auth-jwt";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`register-ogretmen-${ip}`, 5, 60_000);
    if (!rateLimit.success) {
      return NextResponse.json({ success: false, error: "Çok fazla kayıt denemesi yaptınız. Lütfen bekleyin." }, { status: 429 });
    }

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

    // Generate JWT token
    const token = await signToken({ id: teacher.id, email: teacher.email, role: "teacher" });

    const response = NextResponse.json({ success: true, teacher: teacherWithoutPassword });

    // Set secure HttpOnly cookie
    response.cookies.set("derslinex_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Öğretmen Kayıt Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

