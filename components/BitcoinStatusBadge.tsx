import type { BitcoinTxStatus } from "@/lib/api/types";

const STATUS_STYLES: Record<BitcoinTxStatus, string> = {
  pending: "border-white/20 bg-white/5 text-white/60",
  confirming: "border-royal-400/40 bg-royal-500/10 text-royal-300",
  confirmed: "border-gold-500/40 bg-gold-500/10 text-gold-300",
  completed: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  failed: "border-rose-500/40 bg-rose-500/10 text-rose-300",
  cancelled: "border-white/15 bg-white/[0.03] text-white/40",
};

const STATUS_LABELS: Record<BitcoinTxStatus, string> = {
  pending: "Pending",
  confirming: "Confirming",
  confirmed: "Confirmed",
  completed: "Completed",
  failed: "Failed",
  cancelled: "Cancelled",
};

export default function BitcoinStatusBadge({ status }: { status: BitcoinTxStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}
