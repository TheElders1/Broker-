/**
 * Shared in-memory demo state for admin.ts and accountRequests.ts, so a
 * request submitted through the public "Open Account" form shows up in
 * the admin panel's request queue within the same browser session, and
 * admin edits (balance changes, deletions, new users) are reflected back
 * across the admin pages. This is purely a demo convenience — it resets
 * on reload and is never a substitute for a real database.
 */
import { MOCK_ACCOUNT_REQUESTS, MOCK_ADMIN_USERS } from "./mock";
import type { AccountRequest, AdminUser } from "./types";

export const adminUsersStore: AdminUser[] = [...MOCK_ADMIN_USERS];
export const accountRequestsStore: AccountRequest[] = [...MOCK_ACCOUNT_REQUESTS];
