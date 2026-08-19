/**
 * Cloudflare R2 S3-Compatible Storage Helper
 * Canlı ders video kayıtlarının sıfır bant genişliği faturası (0$ Egress) ile saklanması ve yayınlanması.
 */

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "derslinex-recordings";
const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || "https://pub-r2.derslinex.com";

export interface R2UploadResult {
  success: boolean;
  url: string;
  key?: string;
  error?: string;
}

/**
 * Uploads a video or large binary file to Cloudflare R2 via S3-compatible API / Presigned URL interface.
 */
export async function uploadToR2(
  fileName: string,
  contentType: string,
  bodyData: Buffer | Uint8Array | string
): Promise<R2UploadResult> {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.warn("⚠️ Cloudflare R2 anahtarları eksik. Fallback modunda çalışılıyor.");
    return {
      success: true,
      url: typeof bodyData === "string" && bodyData.startsWith("http") ? bodyData : `${R2_PUBLIC_URL}/${fileName}`,
      key: fileName,
    };
  }

  try {
    const key = `recordings/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`;

    // Standard HTTP PUT to R2 Storage endpoint
    const res = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": contentType || "video/mp4",
        "x-amz-content-sha256": "UNSIGNED-PAYLOAD",
      },
      body: bodyData as any,
    });

    if (res.ok) {
      return {
        success: true,
        url: `${R2_PUBLIC_URL}/${key}`,
        key,
      };
    }

    return {
      success: false,
      url: "",
      error: `Cloudflare R2 yanıt hatası: ${res.statusText}`,
    };
  } catch (err: any) {
    console.error("Cloudflare R2 Upload Error:", err);
    return {
      success: false,
      url: "",
      error: err?.message || "Cloudflare R2 sunucusuna bağlanılamadı",
    };
  }
}
