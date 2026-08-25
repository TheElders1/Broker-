import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

/**
 * Public self-registration (the Open Account form). Runs server-side with
 * the service-role client so the new account is created with
 * email_confirm: true — the same mechanism the admin Create User route
 * uses — regardless of whether this Supabase project has "Confirm email"
 * turned on in Authentication > Sign In / Providers > Email. That
 * dashboard toggle only affects supabase.auth.signUp() called from the
 * browser with the publishable key; it has no effect on accounts created
 * through the admin API, which is why this route exists instead of
 * calling signUp() directly from OpenAccountFlow.
 *
 * This route only creates the account — it does not set a session cookie
 * (bridging that from a Node route to the browser's Supabase client is
 * unnecessary complexity). The caller signs in immediately afterward with
 * supabase.auth.signInWithPassword() using the password just submitted,
 * which succeeds instantly since the account is already confirmed.
 */
export async function POST(request: Request) {
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { message: "Account creation is not configured on this deployment. Set SUPABASE_SERVICE_ROLE_KEY." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const {
    firstName,
    lastName,
    email,
    password,
    dateOfBirth,
    country,
    phone,
    address,
    city,
    postalCode,
    accountType,
    currency,
    experience,
  } = body ?? {};

  if (
    !firstName ||
    !lastName ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ?? "") ||
    typeof password !== "string" ||
    password.length < 8 ||
    !dateOfBirth ||
    !country ||
    !phone ||
    !address ||
    !city ||
    !postalCode ||
    !accountType ||
    !currency ||
    !experience
  ) {
    return NextResponse.json({ message: "Missing or invalid fields." }, { status: 400 });
  }

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      country,
      phone,
      address,
      city,
      postal_code: postalCode,
      account_type: accountType,
      currency,
      experience,
    },
  });

  if (createError || !created.user) {
    return NextResponse.json(
      { message: createError?.message ?? "Could not create your account." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
