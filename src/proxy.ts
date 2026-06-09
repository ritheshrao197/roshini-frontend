import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect these routes
  const protectedRoutes = ["/account", "/checkout", "/wishlist"];
  
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = pathname.startsWith("/admin");

  if (isProtected || isAdminRoute) {
    // Check for the JWT token in cookies
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      // Not authenticated, redirect to login page
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If it's an admin route, verify role
    if (isAdminRoute) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
        const decoded = JSON.parse(payloadJson);

        // Role 1 is Admin, or rbacRole is not customer
        const isAdmin = decoded.role === 1 || decoded.userRole === 1 || (decoded.rbacRole && decoded.rbacRole !== "customer");
        if (!isAdmin) {
          // Unauthorized, redirect to home
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch (e) {
        // Token invalid, clear it and redirect to login
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  // A/B Testing Variant Assignment
  let response = NextResponse.next();
  
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
