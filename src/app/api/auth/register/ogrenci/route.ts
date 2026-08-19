import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendVerificationEmail } from "@/lib/email-verification";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`register-ogrenci-${ip}`, 5, 60_000);
    if (!rateLimit.success) {
      return NextResponse.json({ success: false, error: "Çok fazla kayıt denemesi yaptınız. Lütfen bekleyin." }, { status: 429 });
    }

    const body = await request.json();
    const { name, phone, email, password, targetTag } = body;

    if (!name || !phone || !email || !password) {
      return NextResponse.json({ success: false, error: "Tüm alanlar zorunludur" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await prisma.student.findFirst({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "Bu e-posta adresiyle kayıtlı bir hesap zaten var." }, { status: 400 });
    }

    // Create student (isEmailVerified: false)
    const student = await prisma.student.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: cleanEmail,
        password: hashPassword(password),
        targetTag: targetTag || "TYT",
        status: "Beklemede",
        isEmailVerified: false,
      },
    });

    // Send styled verification email with 6-digit PIN code and 1-click link
    const emailResult = await sendVerificationEmail({
      email: cleanEmail,
      name: student.name,
      role: "student",
    });

    if (!emailResult.success) {
      console.warn("Verification email warning:", emailResult.error);
    }

    // Remove password before returning
    const { password: _, ...studentWithoutPassword } = student;

    return NextResponse.json({
      success: true,
      requireVerification: true,
      email: cleanEmail,
      name: student.name,
      student: studentWithoutPassword,
      message: "Kayıt başarılı! Lütfen e-postanıza gönderilen 6 haneli onay kodunu giriniz.",
    });
  } catch (error) {
    console.error("Öğrenci Kayıt Hatası:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
