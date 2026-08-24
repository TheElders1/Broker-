export type DashboardNavItem = {
  label: string;
  href: string;
  icon: string;
};

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "layout" },
  { label: "Markets", href: "/dashboard/markets", icon: "globe" },
  { label: "Watchlist", href: "/dashboard/watchlist", icon: "trending" },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: "chart" },
  { label: "Trade", href: "/dashboard/trade", icon: "bolt" },
  { label: "Wallet", href: "/dashboard/wallet", icon: "lock" },
  { label: "Transactions", href: "/dashboard/transactions", icon: "currency" },
  { label: "Deposits", href: "/dashboard/deposits", icon: "arrow" },
  { label: "Withdrawals", href: "/dashboard/withdrawals", icon: "arrow" },
  { label: "Documents", href: "/dashboard/documents", icon: "book" },
  { label: "Support", href: "/dashboard/support", icon: "life-buoy" },
  { label: "Settings", href: "/dashboard/settings", icon: "cpu" },
];
