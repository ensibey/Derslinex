import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email-verification";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`resend-email-${ip}`, 3, 60_000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Lütfen yeni bir kod istemeden önce 1 dakika bekleyiniz." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "E-posta adresi gereklidir." }, { status: 400 });
    }

    const targetEmail = email.trim().toLowerCase();

    // Check if student or teacher exists
    const student = await prisma.student.findFirst({ where: { email: targetEmail } });
    const teacher = !student ? await prisma.teacher.findFirst({ where: { email: targetEmail } }) : null;

    if (!student && !teacher) {
      return NextResponse.json(
        { success: false, error: "Bu e-posta adresiyle kayıtlı bir hesap bulunamadı." },
        { status: 404 }
      );
    }

    const user = student || teacher;
    const role = student ? "student" : "teacher";

    if (user?.isEmailVerified) {
      return NextResponse.json(
        { success: false, error: "Bu hesap zaten doğrulanmış. Giriş yapabilirsiniz." },
        { status: 400 }
      );
    }

    const result = await sendVerificationEmail({
      email: targetEmail,
      name: user!.name,
      role: role as any,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || "E-posta gönderilemedi." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Yeni 6 haneli onay kodunuz e-posta adresinize gönderildi!",
    });
  } catch (error: any) {
    console.error("Resend verification code error:", error);
    return NextResponse.json({ success: false, error: "Sunucu hatası oluştu." }, { status: 500 });
  }
}
