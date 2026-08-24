import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/adminAuth";
import { createAdminClient } from "@/utils/supabase/admin";

type ProfileRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  account_type: "Basic" | "Professional" | "Premium";
  status: "active" | "suspended";
  balance_usd: number;
  created_at: string;
};

function rowToAdminUser(row: ProfileRow) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    accountType: row.account_type,
    balanceUsd: row.balance_usd,
    status: row.status,
    createdAt: row.created_at,
  };
}

function generateTempPassword(): string {
  return randomBytes(12).toString("base64url");
}

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ message: "Admin data access is not configured on this deployment. Set SUPABASE_SERVICE_ROLE_KEY." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, account_type, status, balance_usd, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json((data as ProfileRow[]).map(rowToAdminUser));
}

export async function POST(request: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ message: "Admin data access is not configured on this deployment. Set SUPABASE_SERVICE_ROLE_KEY." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const { firstName, lastName, email, accountType, initialBalanceUsd } = body ?? {};
  if (!firstName || !lastName || !email || !accountType || typeof initialBalanceUsd !== "number") {
    return NextResponse.json({ message: "Missing or invalid fields." }, { status: 400 });
  }

  const temporaryPassword = generateTempPassword();

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: { first_name: firstName, last_name: lastName },
  });

  if (createError || !created.user) {
    return NextResponse.json(
      { message: createError?.message ?? "Could not create the account." },
      { status: 400 }
    );
  }

  // The on_auth_user_created trigger already inserted a profiles row with
  // defaults (account_type 'Basic', balance_usd 0) — update it to match
  // what the admin actually chose.
  const { data: profile, error: updateError } = await supabase
    .from("profiles")
    .update({ account_type: accountType, balance_usd: initialBalanceUsd })
    .eq("id", created.user.id)
    .select("id, first_name, last_name, email, account_type, status, balance_usd, created_at")
    .single();

  if (updateError || !profile) {
    return NextResponse.json(
      { message: updateError?.message ?? "Account created, but the profile could not be finalized." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    user: rowToAdminUser(profile as ProfileRow),
    temporaryPassword,
  });
}
