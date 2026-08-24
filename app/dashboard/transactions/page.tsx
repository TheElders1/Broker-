import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/DashboardWidgets";
import TransactionsView from "./TransactionsView";

export const metadata: Metadata = { title: "Transactions" };

export default function TransactionsPage() {
  return (
    <div>
      <PageHeader title="Transactions" description="A record of your account activity." />
      <TransactionsView />
    </div>
  );
}
