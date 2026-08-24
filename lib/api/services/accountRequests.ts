import { apiFetch } from "../client";
import { IS_DEMO_MODE } from "../config";
import { mockDelay } from "../mock";
import { accountRequestsStore } from "../demoStore";
import type { AccountRequest, SubmitAccountRequestPayload } from "../types";

/**
 * Backend contract:
 *   POST /account-requests   { firstName, lastName, email, phone, country, accountType, currency, experience } -> AccountRequest
 *
 * This is the public "Open Account" form submission — it does not create
 * a live, tradable account by itself. It queues a request for an admin to
 * review and manually create the account (see lib/api/services/admin.ts),
 * matching a manually-approved onboarding flow rather than instant
 * self-service registration.
 */

export async function submitAccountRequest(payload: SubmitAccountRequestPayload): Promise<AccountRequest> {
  if (IS_DEMO_MODE) {
    const request: AccountRequest = {
      id: `req-demo-${Date.now()}`,
      ...payload,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    accountRequestsStore.unshift(request);
    return mockDelay(request, 900);
  }
  return apiFetch<AccountRequest>("/account-requests", { method: "POST", body: payload });
}
