import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * ERKI DASHBOARD - MIDDLEWARE (THE GATEKEEPER)
 *
 * This middleware enforces the security model:
 * 1. Unauthenticated → Redirect to /login
 * 2. Authenticated but not approved → Redirect to /pending
 * 3. Approved user → Allow access to dashboard
 * 4. Admin routes → Check for admin role
 */

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);

  const path = request.nextUrl.pathname;

  // Skip middleware for API routes
  if (path.startsWith("/api/")) {
    return supabaseResponse;
  }

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/auth/callback"];
  const isPublicRoute = publicRoutes.some((route) =>
    route === "/" ? path === "/" : path.startsWith(route)
  );

  // If user is not authenticated
  if (!user) {
    // Allow access to public routes
    if (isPublicRoute) {
      return supabaseResponse;
    }

    // Redirect to login for all other routes
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(redirectUrl);
  }

  // User is authenticated - fetch profile to check approval status
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_approved, role")
    .eq("id", user.id)
    .single();

  // If profile doesn't exist (edge case), redirect to pending
  // This can happen if the trigger hasn't fired or there's a race condition
  if (!profile || profileError) {
    console.error("Profile not found for user:", user.id, profileError);

    // Allow access to pending page to avoid redirect loop
    if (path === "/pending") {
      return supabaseResponse;
    }

    // Redirect to pending page (they can logout from there)
    return NextResponse.redirect(new URL("/pending", request.url));
  }

  // If user is not approved and trying to access protected routes
  if (!profile.is_approved) {
    // Allow access to pending page and logout
    if (path === "/pending" || isPublicRoute) {
      return supabaseResponse;
    }

    // Redirect unapproved users to pending page
    return NextResponse.redirect(new URL("/pending", request.url));
  }

  // User is approved - check for admin routes
  if (path.startsWith("/admin")) {
    if (profile.role !== "admin") {
      // Non-admin trying to access admin routes
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // If approved user is on login, pending, or landing page, redirect to dashboard
  if (path === "/login" || path === "/pending" || path === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
