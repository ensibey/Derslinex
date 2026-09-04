import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-jwt";
import { prisma } from "@/lib/db";

export interface AuthUser {
  id: number;
  email: string;
  role: "student" | "teacher" | "admin";
  isBanned?: boolean;
}

/**
 * Extracts and verifies JWT token from request cookies (derslinex_token), Authorization header,
 * or fallback x-user-id and x-user-role headers.
 */
export async function getAuthUser(request: Request): Promise<AuthUser | null> {
  try {
    let authUser: AuthUser | null = null;

    // 1. Try reading derslinex_token from Cookie header
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [k, ...v] = c.trim().split("=");
        return [k, v.join("=")];
      })
    );

    const token = cookies.derslinex_token;
    if (token) {
      const verified = await verifyToken(token);
      if (verified) authUser = verified;
    }

    // 2. Try Authorization Bearer token if not found via cookie
    if (!authUser) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const bearerToken = authHeader.substring(7);
        const verified = await verifyToken(bearerToken);
        if (verified) authUser = verified;
      }
    }

    // 3. Optional Development-Only Fallback (Disabled in production)
    if (!authUser && process.env.NODE_ENV === "development" && process.env.ENABLE_DEV_AUTH_BYPASS === "true") {
      const headerUserId = request.headers.get("x-user-id");
      const headerUserRole = request.headers.get("x-user-role") as "student" | "teacher" | null;
      if (headerUserId && headerUserRole && (headerUserRole === "student" || headerUserRole === "teacher")) {
        const idNum = parseInt(headerUserId, 10);
        if (!isNaN(idNum)) {
          if (headerUserRole === "student") {
            const st = await prisma.student.findUnique({ where: { id: idNum }, select: { email: true, isBanned: true } });
            if (st) authUser = { id: idNum, email: st.email, role: "student", isBanned: st.isBanned };
          } else {
            const tc = await prisma.teacher.findUnique({ where: { id: idNum }, select: { email: true, isBanned: true } });
            if (tc) authUser = { id: idNum, email: tc.email, role: "teacher", isBanned: tc.isBanned };
          }
        }
      }
    }

    if (!authUser) return null;

    // Verify isBanned status from DB if not already checked
    if (authUser.isBanned === undefined) {
      if (authUser.role === "student") {
        const st = await prisma.student.findUnique({ where: { id: authUser.id }, select: { isBanned: true } });
        authUser.isBanned = st?.isBanned ?? false;
      } else if (authUser.role === "teacher") {
        const tc = await prisma.teacher.findUnique({ where: { id: authUser.id }, select: { isBanned: true } });
        authUser.isBanned = tc?.isBanned ?? false;
      } else if (authUser.role === "admin") {
        authUser.isBanned = false;
      }
    }

    return authUser;
  } catch (err) {
    return null;
  }
}

/**
 * Validates request authentication and checks for banned user status.
 * Returns { user, errorResponse: null } if valid and active.
 * Returns { user: null, errorResponse: NextResponse } (401 or 403) if unauthorized or banned.
 */
export async function requireAuth(request: Request): Promise<{ user: AuthUser | null; errorResponse: NextResponse | null }> {
  const user = await getAuthUser(request);
  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { success: false, error: "Yetkisiz erişim. Oturum açmanız gerekmektedir." },
        { status: 401 }
      ),
    };
  }

  if (user.isBanned) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { success: false, error: "Hesabınız engellenmiştir. İşlem yapamazsınız." },
        { status: 403 }
      ),
    };
  }

  return { user, errorResponse: null };
}

