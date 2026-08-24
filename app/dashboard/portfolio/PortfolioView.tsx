"use client";

import Link from "next/link";
import { StatCard, Widget, EmptyState } from "@/components/dashboard/DashboardWidgets";
import { LoadingBlock, ErrorBlock } from "@/components/dashboard/ResourceState";
import { useApiResource } from "@/lib/useApiResource";
import { getPortfolioSummary, listPositions } from "@/lib/api/services/portfolio";

export default function PortfolioView() {
  const portfolio = useApiResource(getPortfolioSummary, []);
  const positions = useApiResource(listPositions, []);

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard
          label="Total Balance"
          value={portfolio.status === "success" ? formatUsd(portfolio.data.balance) : "—"}
          icon="chart"
        />
        <StatCard
          label="Available Funds"
          value={portfolio.status === "success" ? formatUsd(portfolio.data.availableFunds) : "—"}
          icon="lock"
        />
        <StatCard
          label="Unrealized P/L"
          value={portfolio.status === "success" ? formatUsd(portfolio.data.unrealizedPl) : "—"}
          icon="trending"
        />
      </div>

      <div className="mt-6">
        <Widget title="Open Positions">
          {positions.status === "loading" ? (
            <LoadingBlock />
          ) : positions.status === "error" ? (
            <ErrorBlock message={positions.error} onRetry={positions.reload} />
          ) : positions.data.length === 0 ? (
            <EmptyState
              icon="layout"
              title="No open positions yet"
              description="Once you place a trade, your open positions will appear here."
              action={
                <Link href="/dashboard/trade" className="btn-gold mt-2">
                  Start Trading
                </Link>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-white/40">
                    <th className="pb-3 font-medium">Symbol</th>
                    <th className="pb-3 font-medium">Side</th>
                    <th className="pb-3 font-medium">Size</th>
                    <th className="pb-3 font-medium">Entry</th>
                    <th className="pb-3 font-medium text-right">P/L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {positions.data.map((p) => (
                    <tr key={p.id} className="text-white/75">
                      <td className="py-3">{p.symbol}</td>
                      <td className={`py-3 ${p.side === "Buy" ? "text-royal-300" : "text-gold-300"}`}>{p.side}</td>
                      <td className="py-3">{p.size}</td>
                      <td className="py-3">{p.entryPrice}</td>
                      <td className="py-3 text-right">{formatUsd(p.pl)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Widget>
      </div>
    </div>
  );
}

function formatUsd(value: number) {
  return value.toLocaleString(undefined, { style: "currency", currency: "USD" });
}
