import crypto from "crypto";

const DEV_FALLBACK_SECRET = "derslinex_default_dev_secret_key_2026_stable";

function getJwtSecret(): string {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }
  if (process.env.NODE_ENV === "production") {
    console.error("CRITICAL: JWT_SECRET environment variable is missing in production!");
  } else {
    console.warn("WARNING: JWT_SECRET environment variable is missing. Using stable development fallback key.");
  }
  return DEV_FALLBACK_SECRET;
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

    const expSigBuf = Buffer.from(expectedSignature);
    const sigBuf = Buffer.from(signatureB64);
    if (expSigBuf.length !== sigBuf.length || !crypto.timingSafeEqual(expSigBuf, sigBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload as { id: number; email: string; role: "student" | "teacher" };
  } catch (err) {
    return null;
  }
}
