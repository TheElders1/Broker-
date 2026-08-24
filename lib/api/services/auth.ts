import { apiFetch, ApiError } from "../client";
import { IS_DEMO_MODE } from "../config";
import { MOCK_USER, mockDelay } from "../mock";
import type { AuthSession, User } from "../types";
import { IS_SUPABASE_CONFIGURED } from "@/lib/supabaseMode";
import { createClient } from "@/utils/supabase/client";

/**
 * Backend contract (VPS):
 *   POST /auth/login        { email, password } -> { user }  (sets httpOnly session cookie)
 *   POST /auth/logout       -> 204
 *   POST /auth/register     { ...registrationFields } -> { user }
 *   GET  /auth/session      -> { user }  (401 if not authenticated)
 *   POST /auth/forgot-password { email } -> 204
 *
 * When Supabase is configured (NEXT_PUBLIC_SUPABASE_URL set), auth runs
 * against Supabase instead — see supabase/schema.sql. Accounts are
 * created by an admin (lib/api/services/admin.ts), not self-registered,
 * so `register` below still only queues an account_request either way.
 */

type ProfileRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  account_type: User["accountType"];
  kyc_status: User["kycStatus"];
  created_at: string;
};

function profileToUser(profile: ProfileRow): User {
  return {
    id: profile.id,
    firstName: profile.first_name,
    lastName: profile.last_name,
    email: profile.email,
    accountType: profile.account_type,
    kycStatus: profile.kyc_status,
    createdAt: profile.created_at,
  };
}

export async function login(email: string, password: string): Promise<AuthSession> {
  if (IS_SUPABASE_CONFIGURED) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      throw new ApiError(error?.message ?? "Invalid email or password.", 401);
    }
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, account_type, kyc_status, created_at")
      .eq("id", data.user.id)
      .single();
    if (profileError || !profile) {
      throw new ApiError("Signed in, but your account profile could not be loaded.", 500);
    }
    return { user: profileToUser(profile as ProfileRow) };
  }
  if (IS_DEMO_MODE) {
    return mockDelay({ user: MOCK_USER });
  }
  return apiFetch<AuthSession>("/auth/login", { method: "POST", body: { email, password } });
}

export async function logout(): Promise<void> {
  if (IS_SUPABASE_CONFIGURED) {
    const supabase = createClient();
    await supabase.auth.signOut();
    return;
  }
  if (IS_DEMO_MODE) {
    return mockDelay(undefined, 200);
  }
  await apiFetch<void>("/auth/logout", { method: "POST" });
}

export async function getSession(): Promise<AuthSession | null> {
  if (IS_SUPABASE_CONFIGURED) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, account_type, kyc_status, created_at")
      .eq("id", user.id)
      .single();
    if (!profile) return null;
    return { user: profileToUser(profile as ProfileRow) };
  }
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
  password: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  accountType: string;
  currency: string;
  experience: string;
};

/**
 * `signedIn: true` means signUp returned an active session — the account
 * is immediately usable, no separate login step needed. `false` means the
 * Supabase project still has "Confirm email" turned on (Authentication >
 * Sign In / Providers > Email in the dashboard) and is withholding a
 * session until the emailed link is clicked; that toggle can't be
 * controlled from application code.
 */
export async function register(payload: RegistrationPayload): Promise<AuthSession & { signedIn: boolean }> {
  if (IS_SUPABASE_CONFIGURED) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          first_name: payload.firstName,
          last_name: payload.lastName,
          date_of_birth: payload.dateOfBirth,
          phone: payload.phone,
          address: payload.address,
          city: payload.city,
          postal_code: payload.postalCode,
          country: payload.country,
          account_type: payload.accountType,
          currency: payload.currency,
          experience: payload.experience,
        },
      },
    });
    if (error || !data.user) {
      throw new ApiError(error?.message ?? "Could not create your account.", 400);
    }
    return {
      user: {
        id: data.user.id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        accountType: payload.accountType as User["accountType"],
        kycStatus: "not_started",
        createdAt: data.user.created_at,
      },
      signedIn: Boolean(data.session),
    };
  }
  if (IS_DEMO_MODE) {
    return mockDelay(
      {
        user: { ...MOCK_USER, firstName: payload.firstName, lastName: payload.lastName, email: payload.email },
        signedIn: true,
      },
      900
    );
  }
  const session = await apiFetch<AuthSession>("/auth/register", { method: "POST", body: payload });
  return { ...session, signedIn: true };
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (IS_DEMO_MODE) {
    return mockDelay(undefined, 500);
  }
  await apiFetch<void>("/auth/forgot-password", { method: "POST", body: { email } });
}

export type { User };
