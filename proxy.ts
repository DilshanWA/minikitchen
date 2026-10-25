import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get("auth_token")?.value);
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin/");
  const isAuthPage = request.nextUrl.pathname === "/admin/login" || request.nextUrl.pathname === "/admin/signup";

  if (isAdminRoute && !isAuthPage && !hasSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
