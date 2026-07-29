/**
 * Mail gönderimi yardımcısı — Resend API
 * Ders atama, hatırlatma ve Google/Apple takvim daveti içerir.
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM   = process.env.RESEND_FROM || "Derslinex <onboarding@resend.dev>";
const SITE   = process.env.NEXT_PUBLIC_SITE_URL || "https://derslinex.com";

// ─── Takvim Yardımcıları ──────────────────────────────────────────────────────

export function generateGoogleCalendarUrl(session: {
  title: string;
  startTime: Date;
  durationMinutes: number;
  description?: string | null;
}): string {
  const start = new Date(session.startTime);
  const end   = new Date(start.getTime() + session.durationMinutes * 60_000);

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    action:  "TEMPLATE",
    text:    session.title,
    dates:   `${fmt(start)}/${fmt(end)}`,
    details: session.description || `Derslinex canlı ders: ${session.title}`,
    location: SITE,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generateIcsContent(session: {
  id: number;
  title: string;
  startTime: Date;
  durationMinutes: number;
  description?: string | null;
}): string {
  const start = new Date(session.startTime);
  const end   = new Date(start.getTime() + session.durationMinutes * 60_000);

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Derslinex//TR",
    "BEGIN:VEVENT",
    `UID:derslinex-session-${session.id}@derslinex.com`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${session.title}`,
    `DESCRIPTION:${session.description || "Derslinex canlı ders"}`,
    `URL:${SITE}/ders/${session.id}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

// ─── HTML Mail Şablonu ────────────────────────────────────────────────────────

function baseTemplate(title: string, body: string): string {
  return `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title></head>
<body style="margin:0;padding:0;background:#F5F3EF;font-family:Inter,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="560" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.07);">
      <tr><td style="background:linear-gradient(135deg,#1E3A8A 0%,#3B5DD4 100%);padding:32px 40px 28px;">
        <span style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.5px;">📚 Derslinex</span>
      </td></tr>
      <tr><td style="padding:36px 40px 40px;">${body}</td></tr>
      <tr><td style="padding:24px 40px;background:#FAF8F5;border-top:1px solid #EFECE6;font-size:12px;color:#9CA3AF;">
        Bu mail Derslinex tarafından otomatik gönderilmiştir.
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

// ─── Mail Göndericileri ───────────────────────────────────────────────────────

interface SessionInfo {
  id: number;
  title: string;
  startTime: Date;
  durationMinutes: number;
  description?: string | null;
}

export async function sendSessionAssignedMail(
  toEmail: string,
  toName: string,
  role: "student" | "teacher",
  session: SessionInfo
): Promise<void> {
  const googleUrl = generateGoogleCalendarUrl(session);
  const icsBase64 = Buffer.from(generateIcsContent(session)).toString("base64");
  const icsDataUrl = `data:text/calendar;base64,${icsBase64}`;
  const joinUrl = `${SITE}/ders/${session.id}`;

  const startStr = new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(new Date(session.startTime));

  const roleLabel = role === "teacher" ? "Öğretmen" : "Öğrenci";

  const body = `
    <h2 style="color:#1E3A8A;font-size:20px;font-weight:900;margin:0 0 8px;">🎉 Yeni Dersiniz Tanımlandı!</h2>
    <p style="color:#374151;margin:0 0 24px;">Merhaba <strong>${toName}</strong>, aşağıdaki canlı derse <strong>${roleLabel}</strong> olarak atandınız.</p>
    <table width="100%" style="background:#F5F3EF;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
      <tr><td style="padding:6px 0;"><span style="color:#6B7280;font-size:12px;font-weight:700;text-transform:uppercase;">Ders Adı</span></td></tr>
      <tr><td style="padding-bottom:12px;font-size:17px;font-weight:900;color:#111827;">${session.title}</td></tr>
      <tr><td style="padding:6px 0;"><span style="color:#6B7280;font-size:12px;font-weight:700;text-transform:uppercase;">Tarih & Saat</span></td></tr>
      <tr><td style="padding-bottom:12px;font-size:15px;font-weight:700;color:#1E3A8A;">${startStr}</td></tr>
      <tr><td style="padding:6px 0;"><span style="color:#6B7280;font-size:12px;font-weight:700;text-transform:uppercase;">Süre</span></td></tr>
      <tr><td style="font-size:15px;font-weight:700;color:#374151;">${session.durationMinutes} dakika</td></tr>
    </table>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding-right:12px;">
          <a href="${joinUrl}" style="display:inline-block;background:#1E3A8A;color:#fff;font-weight:900;font-size:14px;text-decoration:none;padding:14px 28px;border-radius:12px;">🎥 Derse Git</a>
        </td>
        <td style="padding-right:12px;">
          <a href="${googleUrl}" target="_blank" style="display:inline-block;background:#10B981;color:#fff;font-weight:700;font-size:13px;text-decoration:none;padding:14px 20px;border-radius:12px;">📅 Google Takvime Ekle</a>
        </td>
        <td>
          <a href="${icsDataUrl}" download="ders.ics" style="display:inline-block;background:#6366F1;color:#fff;font-weight:700;font-size:13px;text-decoration:none;padding:14px 20px;border-radius:12px;">🍎 Apple Takvime Ekle</a>
        </td>
      </tr>
    </table>`;

  await resend.emails.send({
    from:    FROM,
    to:      toEmail,
    subject: `📚 Yeni Dersiniz: ${session.title}`,
    html:    baseTemplate("Yeni Ders Tanımlandı", body),
  });
}

export async function sendSessionReminderMail(
  toEmail: string,
  toName: string,
  session: SessionInfo
): Promise<void> {
  const joinUrl = `${SITE}/ders/${session.id}`;

  const body = `
    <h2 style="color:#B45309;font-size:20px;font-weight:900;margin:0 0 8px;">⏰ Dersiniz 1 Saat Sonra Başlıyor!</h2>
    <p style="color:#374151;margin:0 0 24px;">Merhaba <strong>${toName}</strong>, <strong>${session.title}</strong> dersine 1 saat kaldı. Hazır mısınız?</p>
    <table width="100%" style="background:#FEF3C7;border-radius:12px;padding:20px 24px;margin-bottom:28px;border:1px solid #FDE68A;">
      <tr><td style="font-size:17px;font-weight:900;color:#92400E;">${session.title}</td></tr>
      <tr><td style="padding-top:8px;font-size:14px;font-weight:600;color:#B45309;">Süre: ${session.durationMinutes} dakika</td></tr>
    </table>
    <a href="${joinUrl}" style="display:inline-block;background:#B45309;color:#fff;font-weight:900;font-size:15px;text-decoration:none;padding:16px 36px;border-radius:12px;">🚀 Derse Katıl</a>`;

  await resend.emails.send({
    from:    FROM,
    to:      toEmail,
    subject: `⏰ ${session.title} — 1 Saat Kaldı!`,
    html:    baseTemplate("Ders Hatırlatması", body),
  });
}

export async function sendSessionCancelledMail(
  toEmail: string,
  toName: string,
  sessionTitle: string
): Promise<void> {
  const body = `
    <h2 style="color:#DC2626;font-size:20px;font-weight:900;margin:0 0 8px;">🚫 Canlı Ders İptal Edildi</h2>
    <p style="color:#374151;margin:0 0 24px;">Merhaba <strong>${toName}</strong>, <strong>${sessionTitle}</strong> başlıklı canlı dersiniz yönetici tarafından iptal edilmiştir.</p>
    <div style="background:#FEE2E2;border:1px solid #FCA5A5;border-radius:12px;padding:16px 20px;color:#991B1B;font-weight:700;font-size:14px;">
      ℹ️ Detaylı bilgi için platformumuz üzerinden iletişime geçebilirsiniz.
    </div>`;

  await resend.emails.send({
    from:    FROM,
    to:      toEmail,
    subject: `🚫 İptal Bilgilendirmesi: ${sessionTitle}`,
    html:    baseTemplate("Ders İptal Edildi", body),
  });
}

export async function sendPasswordResetMail(
  toEmail: string,
  resetUrl: string
): Promise<void> {
  const body = `
    <h2 style="color:#1E3A8A;font-size:20px;font-weight:900;margin:0 0 8px;">🔑 Şifre Sıfırlama Talebi</h2>
    <p style="color:#374151;margin:0 0 24px;">Hesabınız için şifre sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz.</p>
    <div style="margin-bottom:28px;">
      <a href="${resetUrl}" style="display:inline-block;background:#1E3A8A;color:#fff;font-weight:900;font-size:14px;text-decoration:none;padding:14px 28px;border-radius:12px;">🔑 Şifremi Sıfırla</a>
    </div>
    <p style="color:#6B7280;font-size:12px;">Bu talebi siz yapmadıysanız bu e-postayı dikkate almayabilirsiniz. Bağlantı 1 saat boyunca geçerlidir.</p>`;

  try {
    await resend.emails.send({
      from:    FROM,
      to:      toEmail,
      subject: `🔑 Derslinex Şifre Sıfırlama Bağlantısı`,
      html:    baseTemplate("Şifre Sıfırlama", body),
    });
  } catch (err) {
    console.error("Mail send error:", err);
  }
}
