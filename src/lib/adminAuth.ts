import { NextResponse } from "next/server";

/**
 * Verifies if the request contains a valid admin secret key.
 * Returns null if authorized, or a 401 NextResponse if unauthorized.
 * (Bypassed for now as requested by user).
 */
export function verifyAdminAuth(_request: Request): NextResponse | null {
  // Key check bypassed for now
  return null;
}

