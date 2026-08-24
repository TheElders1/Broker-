"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import BitcoinStatusBadge from "@/components/BitcoinStatusBadge";
import { Widget, EmptyState } from "@/components/dashboard/DashboardWidgets";
import { LoadingBlock, ErrorBlock } from "@/components/dashboard/ResourceState";
import { useApiResource } from "@/lib/useApiResource";
import { listWithdrawals, requestWithdrawal } from "@/lib/api/services/withdrawals";
import { ApiError } from "@/lib/api/client";
import type { BitcoinWithdrawal } from "@/lib/api/types";

type Step = "form" | "confirm" | "result";

export default function WithdrawalsView() {
  const withdrawals = useApiResource(listWithdrawals, []);
  const [step, setStep] = useState<Step>("form");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BitcoinWithdrawal | null>(null);

  function validateAndConfirm(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!address.trim()) {
      setError("Enter a destination Bitcoin address.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Enter a withdrawal amount greater than zero.");
      return;
    }
    setStep("confirm");
  }

  async function handleConfirm() {
    setSubmitting(true);
    setError(null);
    try {
      const withdrawal = await requestWithdrawal({
        destinationAddress: address,
        amountBtc: Number(amount),
      });
      setResult(withdrawal);
      setStep("result");
      withdrawals.reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The withdrawal request could not be submitted.");
      setStep("form");
    } finally {
      setSubmitting(false);
    }
  }

  function startOver() {
    setStep("form");
    setAddress("");
    setAmount("");
    setResult(null);
    setError(null);
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.4fr]">
      <Widget title="Withdraw Bitcoin">
        {error ? (
          <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3.5 text-sm text-rose-300">
            <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        {step === "form" ? (
          <form onSubmit={validateAndConfirm} className="flex flex-col gap-4">
            <div>
              <label htmlFor="destination" className="label-field">
                Destination Bitcoin Address
              </label>
              <input
                id="destination"
                className="input-field font-mono text-xs"
                placeholder="bc1q..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="wdAmount" className="label-field">
                Amount (BTC)
              </label>
              <input
                id="wdAmount"
                type="number"
                min="0"
                step="0.00000001"
                className="input-field"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3.5 text-xs text-white/45">
              Network fee will be calculated and confirmed by the backend before broadcast.
            </div>
            <button type="submit" className="btn-gold w-full">
              Review Withdrawal
            </button>
          </form>
        ) : step === "confirm" ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-white/60">Please confirm the details below before submitting.</p>
            <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-ink-900/60 p-4 text-sm">
              <Row label="Destination" value={address} mono />
              <Row label="Amount" value={`${amount} BTC`} />
              <Row label="Network Fee" value="Confirmed by backend" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep("form")} className="btn-outline flex-1">
                Back
              </button>
              <button type="button" onClick={handleConfirm} disabled={submitting} className="btn-gold flex-1">
                {submitting ? "Submitting..." : "Confirm Withdrawal"}
              </button>
            </div>
          </div>
        ) : result ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient text-ink-950">
              <Icon name="check" className="h-7 w-7" />
            </span>
            <h3 className="font-display text-lg font-semibold text-white">Withdrawal Requested</h3>
            <BitcoinStatusBadge status={result.status} />
            <div className="w-full rounded-lg border border-white/10 bg-ink-900/60 p-4 text-left text-xs">
              <Row label="Amount" value={`${result.amountBtc} BTC`} />
              <Row label="Destination" value={result.destinationAddress} mono />
              <Row label="Transaction ID" value={result.txId ?? "Pending assignment"} mono />
            </div>
            <button type="button" onClick={startOver} className="btn-outline">
              New Withdrawal
            </button>
          </div>
        ) : null}
      </Widget>

      <Widget title="Withdrawal History">
        {withdrawals.status === "loading" ? (
          <LoadingBlock />
        ) : withdrawals.status === "error" ? (
          <ErrorBlock message={withdrawals.error} onRetry={withdrawals.reload} />
        ) : withdrawals.data.length === 0 ? (
          <EmptyState
            icon="lock"
            title="No withdrawals yet"
            description="Withdrawal requests you submit will appear here with live status."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {withdrawals.data.map((w) => (
              <div key={w.id} className="rounded-xl border border-white/10 bg-ink-900/60 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-display text-base font-semibold text-white">{w.amountBtc} BTC</p>
                  <BitcoinStatusBadge status={w.status} />
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-white/50 sm:grid-cols-2">
                  <div>
                    <p className="text-white/35">Destination</p>
                    <p className="break-all font-mono text-white/75">{w.destinationAddress}</p>
                  </div>
                  <div>
                    <p className="text-white/35">Date</p>
                    <p className="text-white/75">{new Date(w.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-white/35">Transaction ID</p>
                    <p className="break-all font-mono text-white/75">{w.txId ?? "Pending assignment"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Widget>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 py-2 last:border-0">
      <span className="text-white/40">{label}</span>
      <span className={`text-right text-white/80 ${mono ? "break-all font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}
