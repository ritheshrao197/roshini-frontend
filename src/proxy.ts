import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes requiring any login (cookie OR localStorage — checked client-side)
  // NOTE: /admin is intentionally NOT checked here because:
  //   1. We use localStorage-based auth (not HTTP-only cookies) for the token
  //   2. The cookie is cross-domain (Vercel → Render) and won't be set reliably
  // Routes requiring login are handled client-side because token is stored in localStorage.
  const protectedRoutes: string[] = [];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected) {
    // Check for the JWT token in cookies (set by backend on same-domain setups)
    const token = request.cookies.get("token")?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // A/B Testing Variant Assignment
  const response = NextResponse.next();

  if (!request.cookies.has("ab_variant")) {
    const variant = Math.random() < 0.5 ? "A" : "B";
    response.cookies.set("ab_variant", variant, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
