import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("next-auth.session-token")?.value;

  const url = request.nextUrl;

  if (url.pathname.startsWith("/dashboard")) {
    if (!token)
      return NextResponse.redirect(new URL("/sign-in", request.url));
    else {
      return NextResponse.next();
    }
  }

  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") )) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard", "/verify/:path"],
};
