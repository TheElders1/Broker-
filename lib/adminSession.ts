/**
 * Minimal signed-session helper for gating /admin/*.
 *
 * This is an interim, single-shared-password gate — not a substitute for
 * real per-admin authentication. It exists so the admin area isn't wide
 * open on a public URL while the real backend (with real admin accounts
 * and roles) is being built. See BACKEND_INTEGRATION.md.
 *
 * Uses Web Crypto (available in both the Node runtime and the Edge
 * runtime middleware runs in) rather than Node's `crypto` module, so the
 * same code works in both places without a runtime-specific build.
 *
 * The session token itself never contains the password — only a signed,
 * expiring claim ("this browser passed the login check at time X"). The
 * signing secret (ADMIN_SESSION_SECRET) and the credentials
 * (ADMIN_USERNAME / ADMIN_PASSWORD) are server-only environment
 * variables — never prefixed with NEXT_PUBLIC_, so they are never
 * bundled into client-side JavaScript.
 */

const encoder = new TextEncoder();

function bufferToBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToString(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  return atob(b64);
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

export async function createSessionToken(secret: string, ttlMs: number): Promise<string> {
  const key = await getHmacKey(secret);
  const payload = JSON.stringify({ exp: Date.now() + ttlMs });
  const payloadB64 = bufferToBase64Url(encoder.encode(payload).buffer as ArrayBuffer);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  return `${payloadB64}.${bufferToBase64Url(signature)}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
  secret: string
): Promise<boolean> {
  if (!token) return false;
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return false;

  try {
    const key = await getHmacKey(secret);
    const expectedSig = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
    if (bufferToBase64Url(expectedSig) !== sigB64) return false;

    const payload = JSON.parse(base64UrlToString(payloadB64));
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export const ADMIN_SESSION_COOKIE = "genesis_admin_session";
export const ADMIN_SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
