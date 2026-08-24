"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "@/components/Icon";
import BitcoinStatusBadge from "@/components/BitcoinStatusBadge";
import { StatCard, Widget, EmptyState } from "@/components/dashboard/DashboardWidgets";
import { LoadingBlock, ErrorBlock } from "@/components/dashboard/ResourceState";
import { useApiResource } from "@/lib/useApiResource";
import { getWalletSummary, transferFunds } from "@/lib/api/services/wallet";
import { listTransactions } from "@/lib/api/services/transactions";
import { ApiError } from "@/lib/api/client";
import type { BitcoinTxStatus } from "@/lib/api/types";

export default function WalletView() {
  const wallet = useApiResource(getWalletSummary, []);
  const transactions = useApiResource(listTransactions, []);
  const [transferOpen, setTransferOpen] = useState(false);

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard
          label="Total Balance"
          value={wallet.status === "success" ? formatUsd(wallet.data.totalBalanceUsd) : "—"}
          icon="chart"
        />
        <StatCard
          label="Available Balance"
          value={wallet.status === "success" ? formatUsd(wallet.data.availableBalanceUsd) : "—"}
          icon="lock"
        />
        <StatCard
          label="Pending Balance"
          value={wallet.status === "success" ? formatUsd(wallet.data.pendingBalanceUsd) : "—"}
          icon="clock"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/dashboard/deposits" className="btn-gold">
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          Deposit
        </Link>
        <Link href="/dashboard/withdrawals" className="btn-outline">
          <Icon name="arrow" className="h-4 w-4" />
          Withdraw
        </Link>
        <button type="button" onClick={() => setTransferOpen((v) => !v)} className="btn-outline">
          <Icon name="network" className="h-4 w-4" />
          Transfer
        </button>
      </div>

      {transferOpen ? <TransferForm onDone={() => setTransferOpen(false)} /> : null}

      <div className="mt-6">
        <Widget title="Assets">
          {wallet.status === "loading" ? (
            <LoadingBlock />
          ) : wallet.status === "error" ? (
            <ErrorBlock message={wallet.error} onRetry={wallet.reload} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {wallet.data.assets.map((asset) => (
                <div key={asset.asset} className="rounded-xl border border-white/10 bg-ink-900/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-semibold text-white">{asset.asset}</span>
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/45">
                      {asset.asset === "BTC" ? "Bitcoin" : "Fiat"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-white/50">Total</p>
                  <p className="text-lg font-semibold text-white">{asset.total}</p>
                  <div className="mt-2 flex justify-between text-xs text-white/40">
                    <span>Available: {asset.available}</span>
                    <span>Pending: {asset.pending}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Widget>
      </div>

      <div className="mt-6">
        <Widget title="Transaction History">
          {transactions.status === "loading" ? (
            <LoadingBlock />
          ) : transactions.status === "error" ? (
            <ErrorBlock message={transactions.error} onRetry={transactions.reload} />
          ) : transactions.data.length === 0 ? (
            <EmptyState icon="currency" title="No transactions yet" description="Wallet activity will appear here." />
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
      </div>
    </div>
  );
}

function TransferForm({ onDone }: { onDone: () => void }) {
  const [fromAsset, setFromAsset] = useState("BTC");
  const [toAsset, setToAsset] = useState("USD");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "success">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      await transferFunds({ fromAsset, toAsset, amount: Number(amount) || 0 });
      setStatus("success");
      setMessage("Transfer request submitted to the demo API layer — no real funds moved.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof ApiError ? err.message : "The transfer could not be completed.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card mt-4 flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-white">Transfer Between Assets</h3>
        <button type="button" onClick={onDone} className="text-white/40 hover:text-white">
          <Icon name="close" className="h-4 w-4" />
        </button>
      </div>

      {message ? (
        <div
          className={`rounded-lg border p-3 text-sm ${
            status === "success"
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              : "border-rose-500/30 bg-rose-500/10 text-rose-300"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="fromAsset" className="label-field">
            From
          </label>
          <select id="fromAsset" className="input-field" value={fromAsset} onChange={(e) => setFromAsset(e.target.value)}>
            <option>BTC</option>
            <option>USD</option>
          </select>
        </div>
        <div>
          <label htmlFor="toAsset" className="label-field">
            To
          </label>
          <select id="toAsset" className="input-field" value={toAsset} onChange={(e) => setToAsset(e.target.value)}>
            <option>USD</option>
            <option>BTC</option>
          </select>
        </div>
        <div>
          <label htmlFor="amount" className="label-field">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.00000001"
            className="input-field"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>

      <button type="submit" className="btn-gold w-fit" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting..." : "Submit Transfer"}
      </button>
    </form>
  );
}

function formatUsd(value: number) {
  return value.toLocaleString(undefined, { style: "currency", currency: "USD" });
}
