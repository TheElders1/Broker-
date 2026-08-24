import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/DashboardWidgets";
import WithdrawalsView from "./WithdrawalsView";

export const metadata: Metadata = { title: "Withdrawals" };

export default function WithdrawalsPage() {
  return (
    <div>
      <PageHeader
        title="Withdrawals"
        description="Request a Bitcoin withdrawal. Requests are validated and processed by the backend."
      />
      <WithdrawalsView />
    </div>
  );
}
