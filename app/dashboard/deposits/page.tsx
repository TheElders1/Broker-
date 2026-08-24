import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/DashboardWidgets";
import DepositsView from "./DepositsView";

export const metadata: Metadata = { title: "Deposits" };

export default function DepositsPage() {
  return (
    <div>
      <PageHeader
        title="Deposits"
        description="Fund your account via Bitcoin or USDT. Address and status are provided by the backend once connected."
      />
      <DepositsView />
    </div>
  );
}
