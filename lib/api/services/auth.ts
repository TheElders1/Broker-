import { apiFetch } from "../client";
import { IS_DEMO_MODE } from "../config";
import { MOCK_USER, mockDelay } from "../mock";
import type { AuthSession, User } from "../types";

/**
 * Backend contract (VPS):
 *   POST /auth/login        { email, password } -> { user }  (sets httpOnly session cookie)
 *   POST /auth/logout       -> 204
 *   POST /auth/register     { ...registrationFields } -> { user }
 *   GET  /auth/session      -> { user }  (401 if not authenticated)
 *   POST /auth/forgot-password { email } -> 204
 */

export async function login(email: string, password: string): Promise<AuthSession> {
  if (IS_DEMO_MODE) {
    return mockDelay({ user: MOCK_USER });
  }
  return apiFetch<AuthSession>("/auth/login", { method: "POST", body: { email, password } });
}

export async function logout(): Promise<void> {
  if (IS_DEMO_MODE) {
    return mockDelay(undefined, 200);
  }
  await apiFetch<void>("/auth/logout", { method: "POST" });
}

export async function getSession(): Promise<AuthSession | null> {
  if (IS_DEMO_MODE) {
    return mockDelay(null, 200);
  }
  try {
    return await apiFetch<AuthSession>("/auth/session");
  } catch {
    return null;
  }
}

export type RegistrationPayload = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  accountType: string;
  currency: string;
  experience: string;
};

export async function register(payload: RegistrationPayload): Promise<AuthSession> {
  if (IS_DEMO_MODE) {
    return mockDelay({ user: { ...MOCK_USER, firstName: payload.firstName, lastName: payload.lastName, email: payload.email } }, 900);
  }
  return apiFetch<AuthSession>("/auth/register", { method: "POST", body: payload });
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (IS_DEMO_MODE) {
    return mockDelay(undefined, 500);
  }
  await apiFetch<void>("/auth/forgot-password", { method: "POST", body: { email } });
}

export type { User };
