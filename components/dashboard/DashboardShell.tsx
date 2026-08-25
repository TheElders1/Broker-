"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";
import { DASHBOARD_NAV } from "@/lib/dashboardNav";
import { SESSION_EXPIRED_EVENT } from "@/lib/api/client";
import { logout } from "@/lib/api/services/auth";

export default function DashboardShell({
  children,
  displayName,
}: {
  children: React.ReactNode;
  displayName?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    function handleSessionExpired() {
      router.push("/login?sessionExpired=1");
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  const navList = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4" aria-label="Dashboard">
      {DASHBOARD_NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-gold-500/10 text-gold-300"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon name={item.icon} className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="mt-4 flex items-center gap-3 rounded-lg border-t border-white/10 px-3.5 pt-5 text-sm font-medium text-white/50 transition-colors hover:text-rose-300 disabled:opacity-50"
      >
        <Icon name="close" className="h-[18px] w-[18px]" />
        {loggingOut ? "Signing out..." : "Logout"}
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-ink-900/60 lg:flex">
          <div className="border-b border-white/10 px-5 py-5">
            <Logo />
          </div>
          {navList}
        </aside>

        {/* Mobile sidebar */}
        {open ? (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <div
              className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-white/10 bg-ink-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
                <Logo />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-white/10 p-2 text-white"
                  aria-label="Close menu"
                >
                  <Icon name="close" className="h-5 w-5" />
                </button>
              </div>
              {navList}
            </aside>
          </div>
        ) : null}

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-white/10 bg-ink-950/85 px-5 py-4 backdrop-blur-md sm:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-lg border border-white/10 p-2 text-white lg:hidden"
                aria-label="Open menu"
              >
                <Icon name="menu" className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs text-white/40">Client Area</p>
                <p className="font-display text-base font-semibold text-white">
                  {displayName ? `Welcome back, ${displayName}` : "Welcome back"}
                </p>
              </div>
            </div>
          </header>

          <main className="flex-1 px-5 py-8 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
