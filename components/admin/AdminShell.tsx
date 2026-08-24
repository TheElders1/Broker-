"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";
import { ADMIN_NAV } from "@/lib/adminNav";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  const navList = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4" aria-label="Admin">
      {ADMIN_NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
              active ? "bg-rose-500/10 text-rose-300" : "text-white/60 hover:bg-white/5 hover:text-white"
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
        {loggingOut ? "Signing out..." : "Log Out"}
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-ink-900/60 lg:flex">
          <div className="border-b border-white/10 px-5 py-5">
            <Logo />
          </div>
          {navList}
        </aside>

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

        <div className="flex min-h-screen flex-1 flex-col">
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
                <p className="text-xs text-white/40">Genesis Pro LTD</p>
                <p className="font-display text-base font-semibold text-white">Admin Area</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/40 bg-rose-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-rose-300">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-300 animate-pulse-soft" />
              Demo — Shared Password Only
            </span>
          </header>

          <div className="flex items-start gap-2.5 border-b border-rose-500/20 bg-rose-500/[0.04] px-5 py-3 sm:px-8">
            <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-rose-200/80" />
            <p className="text-xs leading-relaxed text-rose-200/80">
              This route is gated by a single shared username/password (server-verified, httpOnly
              session cookie) — not real per-admin authentication with roles or an audit trail.
              Every action here also only edits in-memory demo data for this browser session, and
              resets on reload. Before going live, add real admin accounts on the backend and gate
              every <code className="text-rose-200">/admin/*</code> API call by an admin role, not
              just a valid session.
            </p>
          </div>

          <main className="flex-1 px-5 py-8 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
