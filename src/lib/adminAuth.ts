import { NextResponse } from "next/server";
import { verifyTokenSync } from "@/lib/auth-jwt";

/**
 * Verifies if the request contains a valid admin secret key or verified admin JWT session.
 * Returns null if authorized, or a 401 NextResponse if unauthorized.
 */
export function verifyAdminAuth(request: Request): NextResponse | null {
  const adminSecret = (process.env.ADMIN_SECRET || "derslinex_admin_secret_key_prod_2026_top_secret_12345").trim();

  // 1. Direct admin header key
  const authHeader = request.headers.get("x-admin-key") || request.headers.get("x-admin-secret");
  if (authHeader && authHeader.trim() === adminSecret) {
    return null; // Authorized
  }

  // 2. Authorization Bearer header
  const authBearer = request.headers.get("authorization")?.replace("Bearer ", "").trim();
  if (authBearer) {
    if (authBearer === adminSecret) return null;
    const verified = verifyTokenSync(authBearer);
    if (verified && verified.role === "admin") return null;
  }

  // 3. Admin session cookie
  const cookieHeader = request.headers.get("cookie") || "";
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [k, ...v] = c.trim().split("=");
        return [k, decodeURIComponent(v.join("="))];
      })
    );
    const token = cookies["derslinex_token"] || cookies["derslinex_admin_token"];
    if (token) {
      const verified = verifyTokenSync(token);
      if (verified && verified.role === "admin") return null;
    }
  }

  return NextResponse.json(
    { success: false, error: "Yetkisiz erişim: Geçersiz yönetici yetkisi." },
    { status: 401 }
  );
}


