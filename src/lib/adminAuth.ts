import { NextResponse } from "next/server";

/**
 * Verifies if the request contains a valid admin secret key.
 * Returns null if authorized, or a 401 NextResponse if unauthorized.
 */
export function verifyAdminAuth(request: Request): NextResponse | null {
  const adminKeyHeader = request.headers.get("x-admin-key");
  const expectedSecret = process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_SECRET || "derslinex_admin_secret_2026";

  if (!adminKeyHeader || adminKeyHeader !== expectedSecret) {
    return NextResponse.json(
      { success: false, error: "Yetkisiz erişim. Geçerli admin anahtarı gereklidir." },
      { status: 401 }
    );
  }

  return null;
}
