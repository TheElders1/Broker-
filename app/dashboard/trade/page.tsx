import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/DashboardWidgets";
import TradeView from "./TradeView";

export const metadata: Metadata = { title: "Trade" };

export default function TradePage() {
  return (
    <div>
      <PageHeader title="Trade" description="Demo order ticket — not connected to a live execution backend." />
      <TradeView />
    </div>
  );
}
