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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ message: "Admin data access is not configured on this deployment. Set SUPABASE_SERVICE_ROLE_KEY." }, { status: 503 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const newBalanceUsd = body?.newBalanceUsd;
  if (typeof newBalanceUsd !== "number" || newBalanceUsd < 0) {
    return NextResponse.json({ message: "Invalid balance." }, { status: 400 });
  }

  // `reason` (body?.reason) isn't persisted yet — there's no balance-change
  // audit table in the schema. Worth adding before this gates real money.
  const { data, error } = await supabase
    .from("profiles")
    .update({ balance_usd: newBalanceUsd })
    .eq("id", id)
    .select("id, first_name, last_name, email, account_type, status, balance_usd, created_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ message: error?.message ?? "User not found." }, { status: 404 });
  }
  return NextResponse.json(rowToAdminUser(data as ProfileRow));
}
