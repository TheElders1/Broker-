import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/DashboardWidgets";
import WalletView from "./WalletView";

export const metadata: Metadata = { title: "Wallet" };

export default function WalletPage() {
  return (
    <div>
      <PageHeader title="Wallet" description="Your account balances and asset holdings." />
      <WalletView />
    </div>
  );
}
