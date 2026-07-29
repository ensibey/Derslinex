import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getAuthUser } from "@/lib/auth-middleware";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

// POST /api/upload
export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Yetkisiz erişim. Oturum açmanız gerekmektedir." }, { status: 401 });
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

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Dosya boyutu maksimum 10MB olabilir." }, { status: 400 });
    }

    const rawExt = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(rawExt)) {
      return NextResponse.json(
        { success: false, error: `Geçersiz dosya uzantısı. İzin verilenler: ${ALLOWED_EXTENSIONS.join(", ")}` },
        { status: 400 }
      );
    }

    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Geçersiz dosya türü. Yalnızca görsel veya PDF yüklenebilir." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${rawExt}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {
      // Ignore directory exists error
    }

    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Dosya yüklenirken sunucu hatası oluştu." }, { status: 500 });
  }
}
