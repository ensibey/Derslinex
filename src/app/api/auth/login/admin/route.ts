import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { signToken } from "@/lib/auth-jwt";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`login-admin-${ip}`, 5, 60_000); // 5 attempts per minute max
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Çok fazla hatalı giriş denemesi. Güvenliğiniz için lütfen 1 dakika bekleyin." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "E-posta ve şifre zorunludur." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const adminSecret = (process.env.ADMIN_SECRET || "derslinex_admin_secret_key_prod_2026_top_secret_12345").trim();

    // 1. Check in database
    const adminUser = await prisma.admin.findUnique({
      where: { email: trimmedEmail },
    });

    let isValid = false;
    let adminRecord = adminUser;

    if (adminUser) {
      isValid = verifyPassword(password, adminUser.password);
    } else {
      // Fallback superadmin check if DB has no admin yet or matching primary admin email
      if (
        (trimmedEmail === "admin@derslinex.com" || trimmedEmail === "hakanenis58@gmail.com") &&
        (password === adminSecret || password === "DerslinexAdmin2026!")
      ) {
        isValid = true;
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Geçersiz yönetici e-posta adresi veya şifre." },
        { status: 401 }
      );
    }

    const adminId = adminRecord?.id || 1;
    const adminEmail = adminRecord?.email || trimmedEmail;
    const adminName = adminRecord?.name || "Yönetici";

    // Generate Admin JWT token with role "admin"
    const token = await signToken({
      id: adminId,
      email: adminEmail,
      role: "admin",
    });

    const response = NextResponse.json({
      success: true,
      message: "Yönetici girişi başarılı. Yönlendiriliyorsunuz...",
      redirect: "/admin",
      adminKey: adminSecret,
      user: {
        id: adminId,
        name: adminName,
        email: adminEmail,
        role: "admin",
      },
    });

    // Set secure HttpOnly cookie
    response.cookies.set("derslinex_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Also set derslinex_admin_token for admin sessions
    response.cookies.set("derslinex_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
