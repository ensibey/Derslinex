import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signToken } from "@/lib/auth-jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code, token } = body;

    if (!token && (!email || !code)) {
      return NextResponse.json(
        { success: false, error: "Lütfen onay kodunu veya doğrulama bağlantısını giriniz." },
        { status: 400 }
      );
    }

    // Find verification record
    let record = null;

    if (token) {
      record = await prisma.emailVerificationToken.findUnique({
        where: { token },
      });
    } else if (email && code) {
      const cleanCode = code.toString().replace(/\s+/g, "").trim();
      record = await prisma.emailVerificationToken.findFirst({
        where: {
          email: email.trim().toLowerCase(),
          code: cleanCode,
        },
      });
    }

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Geçersiz veya süresi dolmuş onay kodu. Lütfen yeni bir kod isteyiniz." },
        { status: 400 }
      );
    }

    // Check expiration
    if (new Date() > new Date(record.expiresAt)) {
      await prisma.emailVerificationToken.delete({ where: { id: record.id } });
      return NextResponse.json(
        { success: false, error: "Onay kodunun 15 dakikalık süresi dolmuş. Lütfen yeni kod isteyiniz." },
        { status: 400 }
      );
    }

    const targetEmail = record.email;
    const role = record.role;

    let userObj: any = null;

    if (role === "teacher") {
      const teacher = await prisma.teacher.findFirst({ where: { email: targetEmail } });
      if (teacher) {
        userObj = await prisma.teacher.update({
          where: { id: teacher.id },
          data: { isEmailVerified: true },
        });
      }
    } else {
      const student = await prisma.student.findFirst({ where: { email: targetEmail } });
      if (student) {
        userObj = await prisma.student.update({
          where: { id: student.id },
          data: { isEmailVerified: true },
        });
      }
    }

    if (!userObj) {
      return NextResponse.json(
        { success: false, error: "Kayıtlı kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    // Delete used token
    await prisma.emailVerificationToken.deleteMany({
      where: { email: targetEmail },
    });

    // Generate JWT token to immediately log in user
    const jwtToken = await signToken({
      id: userObj.id,
      email: userObj.email,
      role: role === "teacher" ? "teacher" : "student",
    });

    const { password: _, ...userWithoutPassword } = userObj;

    const response = NextResponse.json({
      success: true,
      message: "E-posta adresiniz başarıyla doğrulandı! Hoş geldiniz.",
      role,
      user: userWithoutPassword,
    });

    // Set secure HttpOnly cookie
    response.cookies.set("derslinex_token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Email verify error:", error);
    return NextResponse.json(
      { success: false, error: "Doğrulama işlemi sırasında sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
