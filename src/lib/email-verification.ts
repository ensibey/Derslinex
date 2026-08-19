import { prisma } from "@/lib/db";
import crypto from "crypto";

export interface SendVerificationEmailParams {
  email: string;
  name: string;
  role: "student" | "teacher";
}

/**
 * Generates a 6-digit numeric verification code and a unique URL token,
 * stores it in the database with a 15-minute expiration, and sends
 * a beautifully styled HTML email to the user.
 */
export async function sendVerificationEmail({ email, name, role }: SendVerificationEmailParams) {
  // Generate 6-digit PIN code (e.g. "749216")
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  // Generate secure URL token for 1-click verification
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Delete any existing tokens for this email
  await prisma.emailVerificationToken.deleteMany({
    where: { email },
  });

  // Save new verification token
  await prisma.emailVerificationToken.create({
    data: {
      email,
      code,
      token,
      role,
      expiresAt,
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://derslinex.com";
  const directVerifyUrl = `${siteUrl}/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;
  const formattedCode = `${code.slice(0, 3)} ${code.slice(3)}`;

  const html = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Derslinex E-Posta Doğrulama</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0B132B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0B132B; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background: linear-gradient(180deg, #1C2541 0%, #0F172A 100%); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 36px 36px 20px 36px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
              <div style="display: inline-block; padding: 8px 16px; border-radius: 12px; background: rgba(225, 29, 72, 0.15); border: 1px solid rgba(225, 29, 72, 0.3);">
                <span style="font-size: 20px; font-weight: 900; letter-spacing: 2px; color: #FB7185; text-transform: uppercase;">🎓 DERSLINEX</span>
              </div>
              <h1 style="margin: 20px 0 6px 0; font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">E-Posta Adresinizi Doğrulayın</h1>
              <p style="margin: 0; font-size: 13px; color: #94A3B8; font-weight: 500;">Derslinex ailesine hoş geldiniz! Hesabınızı güvenle etkinleştirin.</p>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px 36px;">
              <p style="margin: 0 0 18px 0; font-size: 14px; line-height: 1.6; color: #CBD5E1;">
                Merhaba <strong>${name}</strong>,<br><br>
                Derslinex platformunda ${role === "teacher" ? "öğretmen" : "öğrenci"} hesabınızı tamamlamak için aşağıdaki <strong>6 haneli onay kodunu</strong> kayıt ekranına giriniz:
              </p>

              <!-- 6-Digit Code Box -->
              <div style="margin: 28px 0; padding: 20px; background: rgba(255, 255, 255, 0.03); border: 2px dashed rgba(251, 113, 133, 0.4); border-radius: 18px; text-align: center;">
                <span style="display: block; font-size: 11px; font-weight: 800; color: #FB7185; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">ONAY KODUNUZ</span>
                <span style="font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #FFFFFF; font-family: monospace; text-shadow: 0 0 20px rgba(251, 113, 133, 0.4);">
                  ${formattedCode}
                </span>
                <span style="display: block; font-size: 11px; color: #64748B; margin-top: 8px;">Bu kod 15 dakika boyunca geçerlidir.</span>
              </div>

              <!-- OR Button -->
              <div style="text-align: center; margin: 30px 0 20px 0;">
                <span style="display: inline-block; font-size: 12px; color: #64748B; margin-bottom: 16px;">— VEYA TEK TIKLA DOĞRULAYIN —</span><br>
                <a href="${directVerifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #E11D48 0%, #EA580C 100%); color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 800; padding: 14px 32px; border-radius: 14px; box-shadow: 0 10px 25px -5px rgba(225, 29, 72, 0.5); letter-spacing: 0.5px;">
                  🚀 Hesabımı Hemen Doğrula
                </a>
              </div>

              <!-- Security Notice -->
              <div style="margin-top: 30px; padding: 14px; background: rgba(15, 23, 42, 0.6); border-left: 3px solid #38BDF8; border-radius: 8px;">
                <p style="margin: 0; font-size: 11px; color: #94A3B8; line-height: 1.5;">
                  🔒 <strong>Güvenlik Notu:</strong> Bu işlemi siz başlatmadıysanız bu e-postayı güvenle silebilirsiniz. Şifrenizi veya onay kodunuzu kimseyle paylaşmayınız.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: rgba(0, 0, 0, 0.2); border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748B; font-weight: 600;">
                © 2026 Derslinex Eğitim Teknolojileri A.Ş. Tüm hakları saklıdır.
              </p>
              <p style="margin: 0; font-size: 10px; color: #475569;">
                <a href="https://derslinex.com" style="color: #64748B; text-decoration: underline;">derslinex.com</a> • <a href="mailto:destek@derslinex.com" style="color: #64748B; text-decoration: underline;">destek@derslinex.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const apiKey = process.env.RESEND_API_KEY || "";
  const from = process.env.RESEND_FROM || "Derslinex <noreply@derslinex.com>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: from.includes("resend.dev") ? "Derslinex <noreply@derslinex.com>" : from,
        to: [email],
        subject: `🎓 Derslinex | E-Posta Doğrulama Kodunuz: ${formattedCode}`,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Resend Verification Email Error:", data);
      return { success: false, error: data.message || "E-posta gönderilemedi" };
    }

    return { success: true, code, token };
  } catch (err: any) {
    console.error("Email send network error:", err);
    return { success: false, error: err.message || "Bağlantı hatası" };
  }
}
