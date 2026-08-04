import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Verifies if the request contains a valid admin secret key.
 * Returns null if authorized, or a 401 NextResponse if unauthorized.
 */
export function verifyAdminAuth(request: Request): NextResponse | null {
  const adminKeyHeader = request.headers.get("x-admin-key");
  const expectedSecret = process.env.ADMIN_SECRET;

  if (!expectedSecret) {
    console.error("CRITICAL: ADMIN_SECRET is not configured in environment.");
    return NextResponse.json(
      { success: false, error: "Sunucu yetkilendirme konfigürasyonu eksik. ADMIN_SECRET tanımlı değil." },
      { status: 500 }
    );
  }

  if (!adminKeyHeader) {
    return NextResponse.json(
      { success: false, error: "Yetkisiz erişim. Geçerli admin anahtarı gereklidir." },
      { status: 401 }
    );
  }

  const keyBuffer = Buffer.from(adminKeyHeader);
  const secretBuffer = Buffer.from(expectedSecret);

  if (keyBuffer.length !== secretBuffer.length || !crypto.timingSafeEqual(keyBuffer, secretBuffer)) {
    return NextResponse.json(
      { success: false, error: "Yetkisiz erişim. Geçerli admin anahtarı gereklidir." },
      { status: 401 }
    );
  }

  return null;
}
