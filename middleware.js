import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev_secret_change_me");

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/forms")) {
    if (
      pathname.includes("/responses") &&
      request.method === "POST" &&
      pathname.startsWith("/api/forms/")
    ) {
      return NextResponse.next();
    }

    if (pathname === "/api/forms" && request.method === "GET") {
      const published = request.nextUrl.searchParams.get("published");
      if (published === "true") return NextResponse.next();
    }

    if (pathname.startsWith("/api/auth/login") || pathname.startsWith("/api/auth/logout")) {
      return NextResponse.next();
    }

    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload?.role !== "admin") throw new Error("Invalid token");
      return NextResponse.next();
    } catch {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/forms/:path*", "/api/forms", "/api/auth/:path*"],
};
