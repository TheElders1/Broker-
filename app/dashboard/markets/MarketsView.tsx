"use client";

import { Widget, EmptyState } from "@/components/dashboard/DashboardWidgets";
import { LoadingBlock, ErrorBlock } from "@/components/dashboard/ResourceState";
import { useApiResource } from "@/lib/useApiResource";
import { listMarkets } from "@/lib/api/services/markets";

export default function MarketsView() {
  const markets = useApiResource(listMarkets, []);

  return (
    <Widget title="Market Overview">
      {markets.status === "loading" ? (
        <LoadingBlock />
      ) : markets.status === "error" ? (
        <ErrorBlock message={markets.error} onRetry={markets.reload} />
      ) : markets.data.length === 0 ? (
        <EmptyState icon="globe" title="No markets available" description="Instruments will appear here once connected to a live market-data provider." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-white/40">
                <th className="pb-3 font-medium">Symbol</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium text-right">24h Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {markets.data.map((row) => (
                <tr key={row.symbol} className="text-white/75">
                  <td className="py-3 font-medium text-white/90">{row.symbol}</td>
                  <td className="py-3 text-white/50">{row.category}</td>
                  <td className="py-3">{row.price.toLocaleString()}</td>
                  <td className={`py-3 text-right ${row.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {row.changePercent >= 0 ? "+" : ""}
                    {row.changePercent.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Widget>
  );
}
