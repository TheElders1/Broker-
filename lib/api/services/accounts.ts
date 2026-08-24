import { apiFetch } from "../client";
import { IS_DEMO_MODE } from "../config";
import { MOCK_USER, mockDelay } from "../mock";
import type { User } from "../types";

/**
 * Backend contract:
 *   GET  /accounts/me           -> { accountType, ... }
 *   POST /accounts/me/upgrade   { accountType } -> User
 */

export async function getAccountType(): Promise<User["accountType"]> {
  if (IS_DEMO_MODE) return mockDelay(MOCK_USER.accountType);
  const res = await apiFetch<{ accountType: User["accountType"] }>("/accounts/me");
  return res.accountType;
}

export async function requestAccountUpgrade(accountType: User["accountType"]): Promise<void> {
  if (IS_DEMO_MODE) return mockDelay(undefined, 500);
  await apiFetch<void>("/accounts/me/upgrade", { method: "POST", body: { accountType } });
}
