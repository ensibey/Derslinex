import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

// POST /api/auth/reset-password
export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ success: false, error: "Token ve yeni şifre zorunludur." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: "Şifre en az 6 karakter olmalıdır." }, { status: 400 });
    }

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: "Şifre sıfırlama bağlantısının süresi dolmuş veya geçersiz." }, { status: 400 });
    }

    const hashedPassword = hashPassword(newPassword);

    if (resetRecord.role === "teacher") {
      await prisma.teacher.updateMany({
        where: { email: resetRecord.email },
        data: { password: hashedPassword },
      });
    } else {
      await prisma.student.updateMany({
        where: { email: resetRecord.email },
        data: { password: hashedPassword },
      });
    }

    // Delete token
    await prisma.passwordResetToken.delete({
      where: { id: resetRecord.id },
    });

    return NextResponse.json({
      success: true,
      message: "Şifreniz başarıyla güncellendi! Giriş yapabilirsiniz.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
