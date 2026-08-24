"use client";

import Icon from "@/components/Icon";
import { Widget, EmptyState } from "@/components/dashboard/DashboardWidgets";
import { LoadingBlock, ErrorBlock } from "@/components/dashboard/ResourceState";
import { useApiResource } from "@/lib/useApiResource";
import { listMarkets } from "@/lib/api/services/markets";

export default function WatchlistView() {
  const markets = useApiResource(listMarkets, []);

  return (
    <Widget
      title="Your Watchlist"
      action={
        <button type="button" disabled className="btn-outline cursor-not-allowed opacity-50">
          <Icon name="arrow" className="h-4 w-4 rotate-90" />
          Add Symbol
        </button>
      }
    >
      {markets.status === "loading" ? (
        <LoadingBlock />
      ) : markets.status === "error" ? (
        <ErrorBlock message={markets.error} onRetry={markets.reload} />
      ) : markets.data.length === 0 ? (
        <EmptyState icon="trending" title="No watchlist items" description="Add instruments to track their price here." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-white/40">
                <th className="pb-3 font-medium">Symbol</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium text-right">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {markets.data.map((row) => (
                <tr key={row.symbol} className="text-white/75">
                  <td className="py-3 font-medium text-white/90">{row.symbol}</td>
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
