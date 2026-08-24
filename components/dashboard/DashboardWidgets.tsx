import Icon from "@/components/Icon";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">{title}</h1>
        {description ? <p className="text-sm text-white/50">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  trend,
  trendUp,
  icon,
}: {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: string;
}) {
  return (
    <div className="glass-card flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-white/40">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-gold-400">
          <Icon name={icon} className="h-4 w-4" />
        </span>
      </div>
      <p className="font-display text-2xl font-semibold text-white">{value}</p>
      {trend ? (
        <span className={`text-xs font-medium ${trendUp ? "text-emerald-400" : "text-rose-400"}`}>
          {trend}
        </span>
      ) : null}
    </div>
  );
}

export function Widget({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass-card p-5 sm:p-6 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-white">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export function EmptyState({
  icon = "book",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl2 border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/40">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="font-display text-base font-semibold text-white">{title}</h3>
      <p className="max-w-sm text-sm text-white/50">{description}</p>
      {action}
    </div>
  );
}
