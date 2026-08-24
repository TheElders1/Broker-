import Icon from "@/components/Icon";

export function LoadingBlock({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-gold-400" />
      <p className="text-sm text-white/40">{label}</p>
    </div>
  );
}

export function ErrorBlock({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl2 border border-rose-500/25 bg-rose-500/[0.06] px-6 py-10 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-500/15 text-rose-400">
        <Icon name="alert" className="h-5 w-5" />
      </span>
      <p className="max-w-sm text-sm text-white/70">{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="btn-outline mt-1">
          Try Again
        </button>
      ) : null}
    </div>
  );
}
