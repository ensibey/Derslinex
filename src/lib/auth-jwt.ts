import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "derslinex_super_secret_jwt_key_2026_safe"
);

export async function signToken(payload: { id: number; email: string; role: "student" | "teacher" }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { id: number; email: string; role: "student" | "teacher" };
  } catch (err) {
    return null;
  }
}
