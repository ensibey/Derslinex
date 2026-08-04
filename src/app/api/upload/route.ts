import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// POST /api/upload
// NOTE: On Vercel serverless, filesystem is read-only.
// We return a base64 data URL that the client can use directly.
// For production, swap this with Vercel Blob, Cloudflare R2, or S3.
export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim. Oturum açmanız gerekmektedir." }, { status: 401 });
    }

    if (user.role === "student") {
      const student = await prisma.student.findUnique({ where: { id: user.id } });
      if (student?.isBanned) {
        return NextResponse.json({ success: false, error: "Hesabınız engellenmiştir. Dosya yükleyemezsiniz." }, { status: 403 });
      }
    } else if (user.role === "teacher") {
      const teacher = await prisma.teacher.findUnique({ where: { id: user.id } });
      if (teacher?.isBanned) {
        return NextResponse.json({ success: false, error: "Hesabınız engellenmiştir. Dosya yükleyemezsiniz." }, { status: 403 });
      }
    }

    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`upload-${user.id}-${ip}`, 10, 60_000);
    if (!rateLimit.success) {
      return NextResponse.json({ success: false, error: "Çok fazla dosya yükleme isteği gönderdiniz. Lütfen bekleyin." }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "Dosya seçilmedi." }, { status: 400 });
    }

    // Limit size to 3MB (base64 data URLs get large)
    if (file.size > 3 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Dosya boyutu maksimum 3MB olabilir." }, { status: 400 });
    }

    const rawExt = file.name.includes(".") ? "." + file.name.split(".").pop()!.toLowerCase() : "";
    if (rawExt && !ALLOWED_EXTENSIONS.includes(rawExt)) {
      return NextResponse.json(
        { success: false, error: `Geçersiz dosya uzantısı. İzin verilenler: ${ALLOWED_EXTENSIONS.join(", ")}` },
        { status: 400 }
      );
    }

    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Geçersiz dosya türü. Yalnızca görsel (JPG, PNG, WEBP, GIF) yüklenebilir." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Generate a unique identifier for tracking
    const fileId = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      fileId,
      fileName: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Dosya yüklenirken sunucu hatası oluştu." }, { status: 500 });
  }
}
