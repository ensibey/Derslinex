import crypto from "crypto";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return "derslinex_default_jwt_secret_key_2026_safe";
  }
  return secret;
}


function base64url(str: string) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export async function signToken(payload: { id: number; email: string; role: "student" | "teacher" }) {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days
  const fullPayload = { ...payload, exp, iat: Math.floor(Date.now() / 1000) };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(fullPayload));

  const signature = crypto
    .createHmac("sha256", getJwtSecret())
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export async function verifyToken(token: string) {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split(".");
    if (!headerB64 || !payloadB64 || !signatureB64) return null;

    const expectedSignature = crypto
      .createHmac("sha256", getJwtSecret())
      .update(`${headerB64}.${payloadB64}`)
      .digest("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    if (expectedSignature !== signatureB64) return null;

    const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload as { id: number; email: string; role: "student" | "teacher" };
  } catch (err) {
    return null;
  }
}
