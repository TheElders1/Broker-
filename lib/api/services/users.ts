import { apiFetch } from "../client";
import { IS_DEMO_MODE } from "../config";
import { MOCK_USER, mockDelay } from "../mock";
import type { User } from "../types";

/**
 * Backend contract:
 *   GET   /users/me            -> User
 *   PATCH /users/me            { firstName?, lastName?, email? } -> User
 *   POST  /users/me/password   { currentPassword, newPassword } -> 204
 */

export async function getProfile(): Promise<User> {
  if (IS_DEMO_MODE) return mockDelay(MOCK_USER);
  return apiFetch<User>("/users/me");
}

export async function updateProfile(patch: Partial<Pick<User, "firstName" | "lastName" | "email">>): Promise<User> {
  if (IS_DEMO_MODE) return mockDelay({ ...MOCK_USER, ...patch });
  return apiFetch<User>("/users/me", { method: "PATCH", body: patch });
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  if (IS_DEMO_MODE) return mockDelay(undefined, 500);
  await apiFetch<void>("/users/me/password", { method: "POST", body: { currentPassword, newPassword } });
}
