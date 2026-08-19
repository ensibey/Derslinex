import { NextResponse } from "next/server";

/**
 * Verifies if the request contains a valid admin secret key.
 * Returns null if authorized, or a 401 NextResponse if unauthorized.
 */
export function verifyAdminAuth(request: Request): NextResponse | null {
  const adminSecret = (process.env.ADMIN_SECRET || "derslinex_admin_secret_key_prod_2026_top_secret_12345").trim();
  const authHeader = request.headers.get("x-admin-key") ||
                     request.headers.get("x-admin-secret") ||
                     request.headers.get("authorization")?.replace("Bearer ", "");

  if (!authHeader || authHeader.trim() !== adminSecret) {
    return NextResponse.json(
      { success: false, error: "Yetkisiz erişim: Geçersiz yönetici anahtarı." },
      { status: 401 }
    );
  }

  return null;
}


