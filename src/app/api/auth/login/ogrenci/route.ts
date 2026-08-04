import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { signToken } from "@/lib/auth-jwt";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`login-ogrenci-${ip}`, 8, 60_000); // 8 requests per minute max
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Çok fazla hatalı giriş denemesi yaptınız. Lütfen 1 dakika sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "E-posta ve şifre zorunludur" }, { status: 400 });
    }

    const student = await prisma.student.findFirst({
      where: { email },
    });

    if (!student || !verifyPassword(password, student.password)) {
      return NextResponse.json({ success: false, error: "Geçersiz e-posta adresi veya şifre." }, { status: 400 });
    }

    if (student.isBanned) {
      return NextResponse.json({ success: false, error: "Hesabınız yasaklanmıştır. Lütfen yönetici ile iletişime geçin." }, { status: 403 });
    }

    // Remove password before returning
    const { password: _, ...studentWithoutPassword } = student;

    // Generate JWT token
    const token = await signToken({ id: student.id, email: student.email, role: "student" });

    const response = NextResponse.json({ success: true, student: studentWithoutPassword });

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
    console.error("Öğrenci Giriş Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
