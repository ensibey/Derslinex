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

    // 3. Fallback header ONLY in development environment to prevent header spoofing in production
    if (process.env.NODE_ENV === "development") {
      const userIdHeader = request.headers.get("x-user-id");
      const userRoleHeader = request.headers.get("x-user-role") as "student" | "teacher" | null;
      if (userIdHeader && userRoleHeader) {
        const userId = parseInt(userIdHeader);
        if (userId > 0) {
          return { id: userId, email: "", role: userRoleHeader };
        }
      }
    }

    return null;
  } catch (err) {
    return null;
  }
}
