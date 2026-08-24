import type { Metadata } from "next";
import CandlestickChart from "@/components/CandlestickChart";
import { PageHeader, Widget } from "@/components/dashboard/DashboardWidgets";
import TradeTicket from "./TradeTicket";

export const metadata: Metadata = { title: "Trade" };

export default function TradePage() {
  return (
    <div>
      <PageHeader title="Trade" description="Demo order ticket — not connected to a live execution backend." />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Widget title="XAU/USD">
          <div className="h-64 w-full sm:h-80">
            <CandlestickChart className="h-full w-full" />
          </div>
        </Widget>

        <TradeTicket />
      </div>
    </div>
  );
}
