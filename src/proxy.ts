import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Combines two independent concerns in a single proxy file (Next.js only
// supports one):
//
// 1. Admin auth guard — optimistic check for the private /admin area.
//    This runs before every request to /admin/* and redirects
//    unauthenticated visitors to the login page. The real, authoritative
//    check still happens in each Server Component / Route Handler via
//    `getSession()` — this is just a fast first line of defense.
//
// 2. next-intl locale routing — negotiates and applies the locale prefix
//    (/pt, /en, /ar) for every request to the public site.
//
// The /admin area is intentionally excluded from locale routing: it's
// only used by the site owner and always renders in Portuguese.

const SESSION_COOKIE = "braga_admin_session";

const intlMiddleware = createIntlMiddleware(routing);

async function isValidSession(token: string | undefined) {
  if (!token) return false;
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    // Allow the login page itself and its form submission through.
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const valid = await isValidSession(token);

    if (!valid) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Everything else is the public, localized site.
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    // Match all public routes except API routes, static files, and
    // metadata files, so locale negotiation applies everywhere else.
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
