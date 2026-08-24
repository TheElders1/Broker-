import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/DashboardWidgets";
import { MARKETS } from "@/lib/data";
import MarketsView from "./MarketsView";

export const metadata: Metadata = { title: "Markets" };

export default function MarketsPage() {
  return (
    <div>
      <PageHeader
        title="Markets"
        description="Pricing is served from the API service layer. Instrument availability depends on account type and region."
      />

      <MarketsView />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MARKETS.map((m) => (
          <div key={m.title} className="glass-card p-5">
            <h3 className="font-display text-base font-semibold text-white">{m.title}</h3>
            <p className="mt-1 text-sm text-white/50">{m.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
