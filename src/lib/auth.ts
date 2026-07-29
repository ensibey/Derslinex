import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * Hash a password using bcrypt with a salt factor of 10.
 */
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * Verify if the input password matches the stored hash (supports bcrypt and legacy SHA-256).
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;

  // If stored hash is a bcrypt hash ($2a$, $2b$, or $2y$)
  if (storedHash.startsWith("$2a$") || storedHash.startsWith("$2b$") || storedHash.startsWith("$2y$")) {
    return bcrypt.compareSync(password, storedHash);
  }

  // Fallback for legacy SHA-256 HMAC hash
  const legacySalt = "derslinex_salt_key_12345";
  const legacyHash = crypto.createHmac("sha256", legacySalt).update(password).digest("hex");
  return legacyHash === storedHash;
}

