import { apiFetch, ApiError } from "../client";
import { IS_DEMO_MODE } from "../config";
import { mockDelay } from "../mock";
import { accountRequestsStore, adminUsersStore } from "../demoStore";
import type { AccountRequest, AdminUser, CreateUserPayload } from "../types";
import { IS_SUPABASE_CONFIGURED } from "@/lib/supabaseMode";

/**
 * Backend contract (VPS):
 *   GET    /admin/users                    -> AdminUser[]
 *   POST   /admin/users                    { firstName, lastName, email, accountType, initialBalanceUsd } -> AdminUser
 *   PATCH  /admin/users/:id/balance        { newBalanceUsd, reason? } -> AdminUser
 *   PATCH  /admin/users/:id/tier           { accountType } -> AdminUser
 *   DELETE /admin/users/:id                -> 204
 *   GET    /admin/account-requests          -> AccountRequest[]
 *   PATCH  /admin/account-requests/:id      { status: "processed"|"dismissed" } -> AccountRequest
 *
 * SECURITY: every /admin/* endpoint must verify server-side that the
 * caller holds an admin role — this frontend performs no authorization
 * of its own and must never be treated as a security boundary. The
 * /admin pages in this app are not linked from public navigation and are
 * excluded from search indexing, but that is not access control; real
 * deployments must gate the route itself behind authenticated admin
 * login before any of this data is fetched.
 *
 * When Supabase is configured, this instead calls this app's own
 * app/api/admin/* Route Handlers (not Supabase directly — the browser
 * never holds the service-role key). Those routes re-verify the admin
 * session cookie themselves and use utils/supabase/admin.ts to bypass RLS.
 */

const demoUsers = adminUsersStore;
const demoRequests = accountRequestsStore;

async function adminApiFetch<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(`/api/admin${path}`, {
    method: options.method ?? "GET",
    headers: options.body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: `Request failed with status ${res.status}.` }));
    throw new ApiError(data.message ?? "Request failed.", res.status);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function listUsers(): Promise<AdminUser[]> {
  if (IS_SUPABASE_CONFIGURED) return adminApiFetch<AdminUser[]>("/users");
  if (IS_DEMO_MODE) return mockDelay([...demoUsers]);
  return apiFetch<AdminUser[]>("/admin/users");
}

export async function createUser(payload: CreateUserPayload): Promise<{ user: AdminUser }> {
  if (IS_SUPABASE_CONFIGURED) {
    return adminApiFetch<{ user: AdminUser }>("/users", {
      method: "POST",
      body: payload,
    });
  }
  if (IS_DEMO_MODE) {
    const user: AdminUser = {
      id: `admin-demo-user-${Date.now()}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      accountType: payload.accountType,
      balanceUsd: payload.initialBalanceUsd,
      status: "active",
      createdAt: new Date().toISOString(),
      dateOfBirth: payload.dateOfBirth,
      phone: payload.phone,
      address: payload.address,
      city: payload.city,
      postalCode: payload.postalCode,
      country: payload.country,
      currency: payload.currency,
      experience: payload.experience,
    };
    demoUsers.unshift(user);
    return mockDelay({ user }, 600);
  }
  const user = await apiFetch<AdminUser>("/admin/users", { method: "POST", body: payload });
  return { user };
}

export async function updateUserBalance(
  userId: string,
  newBalanceUsd: number,
  reason?: string
): Promise<AdminUser> {
  if (IS_SUPABASE_CONFIGURED) {
    return adminApiFetch<AdminUser>(`/users/${encodeURIComponent(userId)}/balance`, {
      method: "PATCH",
      body: { newBalanceUsd, reason },
    });
  }
  if (IS_DEMO_MODE) {
    const user = demoUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found.");
    user.balanceUsd = newBalanceUsd;
    return mockDelay({ ...user }, 500);
  }
  return apiFetch<AdminUser>(`/admin/users/${encodeURIComponent(userId)}/balance`, {
    method: "PATCH",
    body: { newBalanceUsd, reason },
  });
}

export async function updateUserTier(userId: string, accountType: AdminUser["accountType"]): Promise<AdminUser> {
  if (IS_SUPABASE_CONFIGURED) {
    return adminApiFetch<AdminUser>(`/users/${encodeURIComponent(userId)}/tier`, {
      method: "PATCH",
      body: { accountType },
    });
  }
  if (IS_DEMO_MODE) {
    const user = demoUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found.");
    user.accountType = accountType;
    return mockDelay({ ...user }, 400);
  }
  return apiFetch<AdminUser>(`/admin/users/${encodeURIComponent(userId)}/tier`, {
    method: "PATCH",
    body: { accountType },
  });
}

export async function deleteUser(userId: string): Promise<void> {
  if (IS_SUPABASE_CONFIGURED) {
    return adminApiFetch<void>(`/users/${encodeURIComponent(userId)}`, { method: "DELETE" });
  }
  if (IS_DEMO_MODE) {
    const idx = demoUsers.findIndex((u) => u.id === userId);
    if (idx !== -1) demoUsers.splice(idx, 1);
    return mockDelay(undefined, 400);
  }
  await apiFetch<void>(`/admin/users/${encodeURIComponent(userId)}`, { method: "DELETE" });
}

export async function listAccountRequests(): Promise<AccountRequest[]> {
  if (IS_SUPABASE_CONFIGURED) return adminApiFetch<AccountRequest[]>("/account-requests");
  if (IS_DEMO_MODE) return mockDelay([...demoRequests]);
  return apiFetch<AccountRequest[]>("/admin/account-requests");
}

export async function updateAccountRequestStatus(
  requestId: string,
  status: "processed" | "dismissed"
): Promise<AccountRequest> {
  if (IS_SUPABASE_CONFIGURED) {
    return adminApiFetch<AccountRequest>(`/account-requests/${encodeURIComponent(requestId)}`, {
      method: "PATCH",
      body: { status },
    });
  }
  if (IS_DEMO_MODE) {
    const req = demoRequests.find((r) => r.id === requestId);
    if (!req) throw new Error("Request not found.");
    req.status = status;
    return mockDelay({ ...req }, 300);
  }
  return apiFetch<AccountRequest>(`/admin/account-requests/${encodeURIComponent(requestId)}`, {
    method: "PATCH",
    body: { status },
  });
}
