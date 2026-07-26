import crypto from "crypto";

/**
 * Hash a password using SHA-256 with a salt.
 */
export function hashPassword(password: string): string {
  const salt = "derslinex_salt_key_12345"; // constant salt for simplicity in this project context
  const hash = crypto.createHmac("sha256", salt).update(password).digest("hex");
  return hash;
}

/**
 * Verify if the input password matches the stored hash.
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
