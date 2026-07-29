import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

// POST /api/upload
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "Dosya seçilmedi." }, { status: 400 });
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Dosya boyutu maksimum 10MB olabilir." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const ext = path.extname(file.name) || ".png";
    const filename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;

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
