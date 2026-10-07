import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Static files & assets bypass
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/logo.png") ||
    pathname.startsWith("/manifest.json") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.match(/\.(png|jpg|jpeg|svg|webp|gif|ico|css|js|woff|woff2|ttf)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Direct access to /kapali
  if (pathname === "/kapali") {
    return NextResponse.next();
  }

  // 3. Admin token check: allow /admin if authorized admin
  const adminToken = request.cookies.get("derslinex_admin_token")?.value;
  if (adminToken && (pathname.startsWith("/admin") || pathname.startsWith("/api/admin"))) {
    return NextResponse.next();
  }

  // 4. Block API requests with 503
  if (pathname.startsWith("/api")) {
    return NextResponse.json(
      { success: false, error: "Site kapatılmıştır." },
      { status: 503 }
    );
  }

  // 5. Rewrite all incoming page requests to /kapali
  const url = request.nextUrl.clone();
  url.pathname = "/kapali";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo.png
     */
    "/((?!_next/static|_next/image|favicon.ico|logo.png).*)",
  ],
};
