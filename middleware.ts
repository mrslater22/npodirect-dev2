import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();
  
  // Check if user is authenticated but accessing onboarding pages
  if (session && request.nextUrl.pathname.startsWith("/onboarding")) {
    // Get supporter profile status
    const { data: supporterProfile } = await supabase
      .from("supporter_profiles")
      .select("id")
      .eq("user_id", session.user.id)
      .single();

    // If no supporter profile exists, only allow access to supporter onboarding
    if (!supporterProfile && request.nextUrl.pathname !== "/onboarding/supporter") {
      return NextResponse.redirect(new URL("/onboarding/supporter", request.url));
    }

    // If supporter profile exists and user is on supporter onboarding, redirect to dashboard
    if (supporterProfile && request.nextUrl.pathname === "/onboarding/supporter") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Protect dashboard and require supporter profile
  if (session && request.nextUrl.pathname.startsWith("/dashboard")) {
    const { data: supporterProfile } = await supabase
      .from("supporter_profiles")
      .select("id")
      .eq("user_id", session.user.id)
      .single();

    if (!supporterProfile) {
      return NextResponse.redirect(new URL("/onboarding/supporter", request.url));
    }
  }

  // Require authentication for protected routes
  if (!session && (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/onboarding")
  )) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
  ],
};