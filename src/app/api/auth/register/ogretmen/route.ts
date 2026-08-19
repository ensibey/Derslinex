import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendVerificationEmail } from "@/lib/email-verification";

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

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await prisma.teacher.findFirst({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "Bu e-posta adresiyle kayıtlı bir hesap zaten var." }, { status: 400 });
    }

    // Create teacher (isEmailVerified: false)
    const teacher = await prisma.teacher.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: cleanEmail,
        password: hashPassword(password),
        branch,
        status: "Beklemede",
        isEmailVerified: false,
      },
    });

    // Send styled verification email
    const emailResult = await sendVerificationEmail({
      email: cleanEmail,
      name: teacher.name,
      role: "teacher",
    });

    if (!emailResult.success) {
      console.warn("Teacher verification email warning:", emailResult.error);
    }

    // Remove password before returning
    const { password: _, ...teacherWithoutPassword } = teacher;

    return NextResponse.json({
      success: true,
      requireVerification: true,
      email: cleanEmail,
      name: teacher.name,
      teacher: teacherWithoutPassword,
      message: "Kayıt başarılı! Lütfen e-postanıza gönderilen 6 haneli onay kodunu giriniz.",
    });
  } catch (error) {
    console.error("Öğretmen Kayıt Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
