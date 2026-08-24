export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 h-8 w-56 rounded-lg bg-white/5" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl2 border border-white/10 bg-white/[0.03]" />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="h-80 rounded-xl2 border border-white/10 bg-white/[0.03]" />
        <div className="h-80 rounded-xl2 border border-white/10 bg-white/[0.03]" />
      </div>
    </div>
  );
}
