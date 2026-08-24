import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_TTL_MS, createSessionToken } from "@/lib/adminSession";

export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!expectedUsername || !expectedPassword || !secret) {
    return NextResponse.json(
      {
        message:
          "Admin login is not configured on this deployment. Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET.",
      },
      { status: 503 }
    );
  }

  const { username, password } = body;
  if (username !== expectedUsername || password !== expectedPassword) {
    return NextResponse.json({ message: "Invalid username or password." }, { status: 401 });
  }

  const token = await createSessionToken(secret, ADMIN_SESSION_TTL_MS);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_MS / 1000,
  });
  return res;
}
