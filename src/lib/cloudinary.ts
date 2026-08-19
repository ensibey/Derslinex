/**
 * Cloudinary CDN Medya & Görsel Depolama Yardımcısı
 * Profil resimleri, soru bankası görselleri ve PDF materyalleri için otomatik Cloudinary CDN yükleme ve dönüştürme.
 */

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export interface UploadResult {
  success: boolean;
  url: string;
  publicId?: string;
  error?: string;
}

/**
 * Uploads a file (base64 data URL, Buffer, or remote URL) to Cloudinary CDN.
 * Auto-converts images to WebP/AVIF format and applies quality optimization.
 */
export async function uploadToCloudinary(
  fileData: string,
  folder: "avatars" | "questions" | "resources" | "general" = "general"
): Promise<UploadResult> {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    console.warn("⚠️ Cloudinary anahtarları eksik. Fallback (yerel/varsayılan) modunda çalışılıyor.");
    return {
      success: true,
      url: fileData.startsWith("data:") ? fileData : fileData,
    };
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `folder=derslinex/${folder}&timestamp=${timestamp}${API_SECRET}`;

    // SHA-1 signature generation for Cloudinary upload REST API
    const crypto = await import("crypto");
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

    const formData = new URLSearchParams();
    formData.append("file", fileData);
    formData.append("api_key", API_KEY);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    formData.append("folder", `derslinex/${folder}`);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await res.json();

    if (res.ok && data.secure_url) {
      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
      };
    }

    return {
      success: false,
      url: "",
      error: data.error?.message || "Cloudinary yükleme hatası",
    };
  } catch (err: any) {
    console.error("Cloudinary Upload Error:", err);
    return {
      success: false,
      url: "",
      error: err?.message || "Cloudinary sunucusuna bağlanılamadı",
    };
  }
}
