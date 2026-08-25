"use client";

import CandlestickChart from "@/components/CandlestickChart";
import LineSpark from "@/components/LineSpark";
import { PageHeader, StatCard, Widget, EmptyState } from "@/components/dashboard/DashboardWidgets";
import { LoadingBlock, ErrorBlock } from "@/components/dashboard/ResourceState";
import { useApiResource } from "@/lib/useApiResource";
import { listMarkets } from "@/lib/api/services/markets";
import { getPortfolioSummary, listPositions } from "@/lib/api/services/portfolio";
import { listTransactions } from "@/lib/api/services/transactions";

export default function DashboardPage() {
  const markets = useApiResource(listMarkets, []);
  const portfolio = useApiResource(getPortfolioSummary, []);
  const positions = useApiResource(listPositions, []);
  const transactions = useApiResource(listTransactions, []);

  const watchlist = markets.status === "success" ? markets.data.slice(0, 4) : [];
  const marketOverview = markets.status === "success" ? markets.data.slice(4, 8) : [];

  return (
    <div>
      <PageHeader
        title="Dashboard Overview"
        description="Live data appears here once your account is connected to the trading backend."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Portfolio Balance"
          value={portfolio.status === "success" ? formatUsd(portfolio.data.balance) : "—"}
          icon="chart"
        />
        <StatCard
          label="Available Funds"
          value={portfolio.status === "success" ? formatUsd(portfolio.data.availableFunds) : "—"}
          icon="lock"
        />
        <StatCard
          label="Open Positions"
          value={positions.status === "success" ? String(positions.data.length) : "—"}
          icon="layout"
        />
        <StatCard
          label="Today's P/L"
          value={portfolio.status === "success" ? formatUsd(portfolio.data.todayPl) : "—"}
          trend={portfolio.status === "success" ? `${portfolio.data.todayPlPercent.toFixed(2)}%` : undefined}
          trendUp={portfolio.status === "success" ? portfolio.data.todayPl >= 0 : undefined}
          icon="trending"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Widget title="Trading Chart">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/40">XAU/USD</p>
              <p className="font-display text-xl font-semibold text-white">2,342.10</p>
            </div>
            <div className="flex gap-2">
              {["1H", "4H", "1D", "1W"].map((t, i) => (
                <span
                  key={t}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                    i === 2 ? "bg-gold-500/20 text-gold-300" : "text-white/40"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="h-52 w-full sm:h-64">
            <CandlestickChart className="h-full w-full" live />
          </div>
        </Widget>

        <Widget title="Watchlist">
          {markets.status === "loading" ? (
            <LoadingBlock />
          ) : markets.status === "error" ? (
            <ErrorBlock message={markets.error} onRetry={markets.reload} />
          ) : watchlist.length === 0 ? (
            <EmptyState icon="trending" title="No watchlist items" description="Add instruments to your watchlist to track them here." />
          ) : (
            <div className="flex flex-col divide-y divide-white/5">
              {watchlist.map((row) => (
                <div key={row.symbol} className="flex items-center justify-between py-3">
                  <span className="text-sm text-white/75">{row.symbol}</span>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{row.price.toLocaleString()}</p>
                    <p className={`text-[11px] ${row.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {row.changePercent >= 0 ? "+" : ""}
                      {row.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Widget>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Widget title="Market Overview" className="xl:col-span-1">
          {markets.status === "loading" ? (
            <LoadingBlock />
          ) : markets.status === "error" ? (
            <ErrorBlock message={markets.error} onRetry={markets.reload} />
          ) : (
            <div className="flex flex-col divide-y divide-white/5">
              {marketOverview.map((row) => (
                <div key={row.symbol} className="flex items-center justify-between py-3">
                  <span className="text-sm text-white/75">{row.symbol}</span>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{row.price.toLocaleString()}</p>
                    <p className={`text-[11px] ${row.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {row.changePercent >= 0 ? "+" : ""}
                      {row.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Widget>

        <Widget title="Open Positions" className="xl:col-span-2">
          {positions.status === "loading" ? (
            <LoadingBlock />
          ) : positions.status === "error" ? (
            <ErrorBlock message={positions.error} onRetry={positions.reload} />
          ) : positions.data.length === 0 ? (
            <EmptyState icon="layout" title="No open positions" description="Positions you open will appear here." />
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
                      <td className="py-3">{p.entryPrice || "—"}</td>
                      <td className="py-3 text-right">{formatUsd(p.pl)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Widget>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Widget title="Portfolio Growth" className="xl:col-span-2">
          {portfolio.status === "loading" ? (
            <LoadingBlock />
          ) : portfolio.status === "error" ? (
            <ErrorBlock message={portfolio.error} onRetry={portfolio.reload} />
          ) : (
            <div className="h-40 w-full">
              <LineSpark points={portfolio.data.equityCurve} color="#E6C264" />
            </div>
          )}
        </Widget>

        <Widget title="Recent Transactions">
          {transactions.status === "loading" ? (
            <LoadingBlock />
          ) : transactions.status === "error" ? (
            <ErrorBlock message={transactions.error} onRetry={transactions.reload} />
          ) : transactions.data.length === 0 ? (
            <EmptyState icon="currency" title="No transactions yet" description="Deposits, withdrawals, and settlements will appear here." />
          ) : (
            <div className="flex flex-col divide-y divide-white/5">
              {transactions.data.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm text-white/75">{t.type}</p>
                    <p className="text-[11px] text-white/35">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      {t.amount} {t.asset}
                    </p>
                    <p className="text-[11px] text-white/35 capitalize">{t.status}</p>
                  </div>
                </div>
              ))}
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
