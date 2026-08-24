import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/DashboardWidgets";
import SettingsForm from "./SettingsForm";
import { IS_SUPABASE_CONFIGURED } from "@/lib/supabaseMode";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  let initial = { userId: "", firstName: "", lastName: "", email: "", currency: "USD" };

  if (IS_SUPABASE_CONFIGURED) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name, email, currency")
        .eq("id", user.id)
        .single();
      if (profile) {
        initial = {
          userId: user.id,
          firstName: profile.first_name ?? "",
          lastName: profile.last_name ?? "",
          email: profile.email ?? user.email ?? "",
          currency: profile.currency || "USD",
        };
      }
    }
  }

  return (
    <div>
      <PageHeader title="Settings" description="Manage your profile and account preferences." />
      <SettingsForm initial={initial} supabaseConfigured={IS_SUPABASE_CONFIGURED} />
    </div>
  );
}
