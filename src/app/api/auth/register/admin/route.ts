import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { signToken } from "@/lib/auth-jwt";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`register-admin-${ip}`, 3, 60_000); // 3 attempts per minute max
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Çok fazla işlem denemesi yaptınız. Lütfen 1 dakika bekleyin." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, password, securityKey } = body;

    const adminSecret = (process.env.ADMIN_SECRET || "derslinex_admin_secret_key_prod_2026_top_secret_12345").trim();

    // ─── GÜVENLİK KONTROLÜ: Yönetici Anahtarı Doğrulaması ───
    if (!securityKey || securityKey.trim() !== adminSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Yetkisiz Erişim: Yönetici hesabı oluşturmak için geçerli bir Yönetici Güvenlik Anahtarı (Master Key) girmelisiniz.",
        },
        { status: 403 }
      );
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Lütfen geçerli bir yönetici adı giriniz (en az 2 karakter)." },
        { status: 400 }
      );
    }

    const trimmedEmail = (email || "").trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: "Lütfen geçerli bir e-posta adresi giriniz." },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Güvenliğiniz için şifre en az 8 karakter uzunluğunda olmalıdır." },
        { status: 400 }
      );
    }

    // Check if email is already registered as Admin
    const existing = await prisma.admin.findUnique({
      where: { email: trimmedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Bu e-posta adresiyle kayıtlı bir yönetici hesabı zaten mevcut." },
        { status: 409 }
      );
    }

    // Bcrypt hash password
    const hashedPassword = hashPassword(password);

    const newAdmin = await prisma.admin.create({
      data: {
        name: name.trim(),
        email: trimmedEmail,
        password: hashedPassword,
        role: "admin",
      },
    });

    // Generate Admin JWT token
    const token = await signToken({
      id: newAdmin.id,
      email: newAdmin.email,
      role: "admin",
    });

    const response = NextResponse.json({
      success: true,
      message: "Yönetici hesabı başarıyla oluşturuldu. Admin paneline yönlendiriliyorsunuz...",
      redirect: "/admin",
      adminKey: adminSecret,
      user: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: "admin",
      },
    });

    // Set secure HttpOnly cookies
    response.cookies.set("derslinex_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    response.cookies.set("derslinex_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin Register Error:", error);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
