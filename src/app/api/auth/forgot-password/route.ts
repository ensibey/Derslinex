import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { sendPasswordResetMail } from "@/lib/mail";

// POST /api/auth/forgot-password
export async function POST(request: Request) {
  try {
    const { email, role } = await request.json(); // role: "student" | "teacher"

    if (!email) {
      return NextResponse.json({ success: false, error: "E-posta adresi zorunludur." }, { status: 400 });
    }

    const targetRole = role === "teacher" ? "teacher" : "student";
    let userExists = false;

    if (targetRole === "teacher") {
      const teacher = await prisma.teacher.findFirst({ where: { email } });
      if (teacher) userExists = true;
    } else {
      const student = await prisma.student.findFirst({ where: { email } });
      if (student) userExists = true;
    }

    if (!userExists) {
      // Return success to avoid email enumeration
      return NextResponse.json({
        success: true,
        message: "Eğer e-posta adresi sistemimizde kayıtlı ise sıfırlama bağlantısı gönderilmiştir.",
      });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60_000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        role: targetRole,
        expiresAt,
      },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://derslinex.com";
    const resetUrl = `${siteUrl}/sifremi-sifirla?token=${token}`;

    await sendPasswordResetMail(email, resetUrl);

    return NextResponse.json({
      success: true,
      message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
