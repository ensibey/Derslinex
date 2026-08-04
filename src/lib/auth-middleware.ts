import { verifyToken } from "@/lib/auth-jwt";

export interface AuthUser {
  id: number;
  email: string;
  role: "student" | "teacher";
}

/**
 * Extracts and verifies JWT token from request cookies (derslinex_token), Authorization header,
 * or fallback x-user-id header.
 */
export async function getAuthUser(request: Request): Promise<AuthUser | null> {
  try {
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
      if (verified) return verified;
    }

    // 2. Try Authorization Bearer token
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const bearerToken = authHeader.substring(7);
      const verified = await verifyToken(bearerToken);
      if (verified) return verified;
    }

    return null;
  } catch (err) {
    return null;
  }
}
