import { apiFetch } from "../client";
import { IS_DEMO_MODE } from "../config";
import { mockDelay } from "../mock";
import { accountRequestsStore } from "../demoStore";
import type { AccountRequest, SubmitAccountRequestPayload } from "../types";
import { IS_SUPABASE_CONFIGURED } from "@/lib/supabaseMode";
import { createClient } from "@/utils/supabase/client";

/**
 * Backend contract:
 *   POST /account-requests   { firstName, lastName, email, phone, country, accountType, currency, experience } -> AccountRequest
 *
 * This is the public "Open Account" form submission — it does not create
 * a live, tradable account by itself. It queues a request for an admin to
 * review and manually create the account (see lib/api/services/admin.ts),
 * matching a manually-approved onboarding flow rather than instant
 * self-service registration.
 *
 * When Supabase is configured, this writes directly into the
 * account_requests table (see supabase/schema.sql) using the publishable
 * key — its RLS policy allows anyone to insert a row but not read or
 * modify one, so only the admin's service-role-backed routes can review
 * the queue.
 */

type AccountRequestRow = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  account_type: string;
  currency: string;
  experience: string;
  status: AccountRequest["status"];
  submitted_at: string;
};

function rowToAccountRequest(row: AccountRequestRow): AccountRequest {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    dateOfBirth: row.date_of_birth,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    postalCode: row.postal_code,
    country: row.country,
    accountType: row.account_type,
    currency: row.currency,
    experience: row.experience,
    status: row.status,
    submittedAt: row.submitted_at,
  };
}

export async function submitAccountRequest(payload: SubmitAccountRequestPayload): Promise<AccountRequest> {
  if (IS_SUPABASE_CONFIGURED) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("account_requests")
      .insert({
        first_name: payload.firstName,
        last_name: payload.lastName,
        date_of_birth: payload.dateOfBirth,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        city: payload.city,
        postal_code: payload.postalCode,
        country: payload.country,
        account_type: payload.accountType,
        currency: payload.currency,
        experience: payload.experience,
      })
      .select()
      .single();
    if (error || !data) {
      throw new Error(error?.message ?? "Could not submit your request. Please try again.");
    }
    return rowToAccountRequest(data as AccountRequestRow);
  }

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
