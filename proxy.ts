import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/adminSession";

/**
 * Single proxy (Next.js 16's "middleware") covering two unrelated concerns
 * that both need to run before a request reaches a page:
 *
 * 1. Supabase session refresh — keeps a signed-in client's auth cookie
 *    valid on every request. Unrelated to admin auth below; Supabase only
 *    ever governs client-facing accounts (login/dashboard), never /admin.
 * 2. The /admin gate — a separate, signed httpOnly cookie checked against
 *    ADMIN_USERNAME/ADMIN_PASSWORD, predating Supabase and deliberately
 *    kept independent of it (see app/api/admin/login).
 *
 * Next.js only allows one proxy/middleware file per app, so both live here
 * rather than as two competing files.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });

    // Touching getUser() is what actually refreshes an expiring session;
    // the result itself isn't needed here.
    await supabase.auth.getUser();
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const secret = process.env.ADMIN_SESSION_SECRET;
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const valid = secret ? await verifySessionToken(token, secret) : false;

    if (!valid) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  // Runs on every route except static assets/images, so the Supabase
  // session can refresh anywhere a signed-in user might navigate.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
