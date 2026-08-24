import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/DashboardWidgets";
import WatchlistView from "./WatchlistView";

export const metadata: Metadata = { title: "Watchlist" };

export default function WatchlistPage() {
  return (
    <div>
      <PageHeader title="Watchlist" description="Track the instruments you care about." />
      <WatchlistView />
    </div>
  );
}
