"use client";

import Link from "next/link";
import { PageHeader, StatCard, Widget } from "@/components/dashboard/DashboardWidgets";
import { LoadingBlock, ErrorBlock } from "@/components/dashboard/ResourceState";
import { useApiResource } from "@/lib/useApiResource";
import { listUsers, listAccountRequests } from "@/lib/api/services/admin";

export default function AdminOverview() {
  const users = useApiResource(listUsers, []);
  const requests = useApiResource(listAccountRequests, []);

  const totalBalance =
    users.status === "success" ? users.data.reduce((sum, u) => sum + u.balanceUsd, 0) : null;
  const pendingCount =
    requests.status === "success" ? requests.data.filter((r) => r.status === "pending").length : null;

  return (
    <div>
      <PageHeader title="Overview" description="A snapshot of client accounts and pending applications." />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={users.status === "success" ? String(users.data.length) : "—"}
          icon="users"
        />
        <StatCard
          label="Total Balance"
          value={totalBalance !== null ? totalBalance.toLocaleString(undefined, { style: "currency", currency: "USD" }) : "—"}
          icon="chart"
        />
        <StatCard
          label="Pending Requests"
          value={pendingCount !== null ? String(pendingCount) : "—"}
          icon="mail"
        />
        <StatCard
          label="Suspended Accounts"
          value={users.status === "success" ? String(users.data.filter((u) => u.status === "suspended").length) : "—"}
          icon="shield"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Widget
          title="Recent Users"
          action={
            <Link href="/admin/users" className="text-sm font-semibold text-gold-400 hover:text-gold-300">
              View all
            </Link>
          }
        >
          {users.status === "loading" ? (
            <LoadingBlock />
          ) : users.status === "error" ? (
            <ErrorBlock message={users.error} onRetry={users.reload} />
          ) : (
            <div className="flex flex-col divide-y divide-white/5">
              {users.data.slice(0, 5).map((u) => (
                <div key={u.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm text-white/80">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-[11px] text-white/40">{u.email}</p>
                  </div>
                  <p className="text-sm font-medium text-white">
                    {u.balanceUsd.toLocaleString(undefined, { style: "currency", currency: "USD" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Widget>

        <Widget
          title="Pending Account Requests"
          action={
            <Link href="/admin/requests" className="text-sm font-semibold text-gold-400 hover:text-gold-300">
              View all
            </Link>
          }
        >
          {requests.status === "loading" ? (
            <LoadingBlock />
          ) : requests.status === "error" ? (
            <ErrorBlock message={requests.error} onRetry={requests.reload} />
          ) : (
            <div className="flex flex-col divide-y divide-white/5">
              {requests.data
                .filter((r) => r.status === "pending")
                .slice(0, 5)
                .map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm text-white/80">
                        {r.firstName} {r.lastName}
                      </p>
                      <p className="text-[11px] text-white/40">{r.email}</p>
                    </div>
                    <p className="text-[11px] text-white/40">{new Date(r.submittedAt).toLocaleDateString()}</p>
                  </div>
                ))}
              {requests.status === "success" && requests.data.filter((r) => r.status === "pending").length === 0 ? (
                <p className="py-6 text-center text-sm text-white/40">No pending requests.</p>
              ) : null}
            </div>
          )}
        </Widget>
      </div>
    </div>
  );
}
