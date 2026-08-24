export default function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-royal-400/40 bg-royal-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-royal-300 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-royal-300 animate-pulse-soft" />
      Demo Data
    </span>
  );
}
