import "server-only";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/adminSession";

/**
 * Verifies the admin session cookie inside a Route Handler. proxy.ts
 * already redirects page navigations under /admin away from unauthenticated
 * requests, but it does not (and should not) cover /api/admin/* — those are
 * fetched by client code already running on an authenticated /admin page,
 * not navigated to directly. Every /api/admin/* route must still call this
 * itself: proxy.ts is a UX redirect, not the security boundary.
 */
export async function requireAdminSession(): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifySessionToken(token, secret);
}
