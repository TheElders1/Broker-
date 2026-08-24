import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/adminAuth";
import { createAdminClient } from "@/utils/supabase/admin";

const PROFILE_COLUMNS =
  "id, first_name, last_name, email, account_type, status, balance_usd, created_at, date_of_birth, phone, address, city, postal_code, country, currency, experience";

type ProfileRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  account_type: "Basic" | "Professional" | "Premium";
  status: "active" | "suspended";
  balance_usd: number;
  created_at: string;
  date_of_birth: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  currency: string | null;
  experience: string | null;
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
    dateOfBirth: row.date_of_birth ?? undefined,
    phone: row.phone ?? undefined,
    address: row.address ?? undefined,
    city: row.city ?? undefined,
    postalCode: row.postal_code ?? undefined,
    country: row.country ?? undefined,
    currency: row.currency ?? undefined,
    experience: row.experience ?? undefined,
  };
}

const VALID_TIERS = ["Basic", "Professional", "Premium"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { message: "Admin data access is not configured on this deployment. Set SUPABASE_SERVICE_ROLE_KEY." },
      { status: 503 }
    );
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const accountType = body?.accountType;
  if (!VALID_TIERS.includes(accountType)) {
    return NextResponse.json({ message: "Invalid account tier." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ account_type: accountType })
    .eq("id", id)
    .select(PROFILE_COLUMNS)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: error?.message ?? "User not found." }, { status: 404 });
  }
  return NextResponse.json(rowToAdminUser(data as ProfileRow));
}
