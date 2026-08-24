import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/adminAuth";
import { createAdminClient } from "@/utils/supabase/admin";

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
  status: "pending" | "processed" | "dismissed";
  submitted_at: string;
};

function rowToAccountRequest(row: AccountRequestRow) {
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
  const status = body?.status;
  if (status !== "processed" && status !== "dismissed") {
    return NextResponse.json({ message: "Invalid status." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("account_requests")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ message: error?.message ?? "Request not found." }, { status: 404 });
  }
  return NextResponse.json(rowToAccountRequest(data as AccountRequestRow));
}
