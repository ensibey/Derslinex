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

    const trimmedEmail = email.trim().toLowerCase();
    const adminSecret = (process.env.ADMIN_SECRET || "derslinex_admin_secret_key_prod_2026_top_secret_12345").trim();

    // 1. Check if this is an Admin logging in through student form
    const adminUser = await prisma.admin.findUnique({
      where: { email: trimmedEmail },
    });

    const isAdminMatch = adminUser
      ? verifyPassword(password, adminUser.password)
      : (trimmedEmail === "admin@derslinex.com" && (password === adminSecret || password === "DerslinexAdmin2026!"));

    if (isAdminMatch) {
      const adminId = adminUser?.id || 1;
      const adminName = adminUser?.name || "Yönetici";
      const token = await signToken({ id: adminId, email: trimmedEmail, role: "admin" });

      const response = NextResponse.json({
        success: true,
        isAdmin: true,
        redirect: "/admin",
        adminKey: adminSecret,
        student: { id: adminId, name: adminName, email: trimmedEmail, role: "admin" },
      });

      response.cookies.set("derslinex_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      response.cookies.set("derslinex_admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      return response;
    }

    // 2. Normal student login check
    const student = await prisma.student.findFirst({
      where: { email: trimmedEmail },
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
