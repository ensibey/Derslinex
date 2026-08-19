import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-middleware";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { uploadToR2 } from "@/lib/cloudflare-r2";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".mp4", ".webm"];
const ALLOWED_MIME_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "application/pdf",
  "video/mp4", "video/webm"
];

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
    const folderType = (formData.get("folder") as any) || "general";

    if (!file) {
      return NextResponse.json({ success: false, error: "Dosya seçilmedi." }, { status: 400 });
    }

    // Limit size to 10MB for images/PDFs, 100MB for videos
    const isVideo = file.type.startsWith("video/");
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `Dosya boyutu maksimum ${isVideo ? "100MB" : "10MB"} olabilir.` },
        { status: 400 }
      );
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
        { success: false, error: "Geçersiz dosya türü. Yalnızca görsel (JPG, PNG, WEBP), PDF veya MP4 yüklenebilir." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileId = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

    let finalUrl = "";

    // Route videos to Cloudflare R2, images/PDFs to Cloudinary (or fallback)
    if (isVideo) {
      const r2Res = await uploadToR2(file.name, file.type, buffer);
      if (r2Res.success) {
        finalUrl = r2Res.url;
      } else {
        return NextResponse.json({ success: false, error: r2Res.error || "R2 video yükleme hatası" }, { status: 500 });
      }
    } else {
      const base64 = buffer.toString("base64");
      const mimeType = file.type || "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64}`;

      const cldRes = await uploadToCloudinary(dataUrl, folderType);
      if (cldRes.success) {
        finalUrl = cldRes.url;
      } else {
        return NextResponse.json({ success: false, error: cldRes.error || "Cloudinary görsel yükleme hatası" }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      fileId,
      fileName: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Dosya yüklenirken sunucu hatası oluştu." }, { status: 500 });
  }
}

