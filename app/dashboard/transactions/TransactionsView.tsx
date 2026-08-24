"use client";

import BitcoinStatusBadge from "@/components/BitcoinStatusBadge";
import { Widget, EmptyState } from "@/components/dashboard/DashboardWidgets";
import { LoadingBlock, ErrorBlock } from "@/components/dashboard/ResourceState";
import { useApiResource } from "@/lib/useApiResource";
import { listTransactions } from "@/lib/api/services/transactions";
import type { BitcoinTxStatus } from "@/lib/api/types";

export default function TransactionsView() {
  const transactions = useApiResource(listTransactions, []);

  return (
    <Widget title="Transaction History">
      {transactions.status === "loading" ? (
        <LoadingBlock />
      ) : transactions.status === "error" ? (
        <ErrorBlock message={transactions.error} onRetry={transactions.reload} />
      ) : transactions.data.length === 0 ? (
        <EmptyState
          icon="currency"
          title="No transactions yet"
          description="Your deposits, withdrawals, and trade settlements will appear here once your account is active."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-white/40">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Asset</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.data.map((t) => (
                <tr key={t.id} className="text-white/75">
                  <td className="py-3">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="py-3">{t.type}</td>
                  <td className="py-3">{t.asset}</td>
                  <td className="py-3">{t.amount}</td>
                  <td className="py-3">
                    {t.status === "settled" ? (
                      <span className="text-white/50">Settled</span>
                    ) : (
                      <BitcoinStatusBadge status={t.status as BitcoinTxStatus} />
                    )}
                  </td>
                  <td className="py-3 font-mono text-xs text-white/45">{t.txId ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Widget>
  );
}
