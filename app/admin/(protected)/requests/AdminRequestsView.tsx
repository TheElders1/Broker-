"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { Widget, EmptyState } from "@/components/dashboard/DashboardWidgets";
import { LoadingBlock, ErrorBlock } from "@/components/dashboard/ResourceState";
import { useApiResource } from "@/lib/useApiResource";
import { listAccountRequests, updateAccountRequestStatus } from "@/lib/api/services/admin";
import type { AccountRequest } from "@/lib/api/types";

function formatDetails(r: AccountRequest): string {
  return [
    `Name: ${r.firstName} ${r.lastName}`,
    `Email: ${r.email}`,
    `Phone: ${r.phone}`,
    `Date of birth: ${r.dateOfBirth}`,
    `Address: ${r.address}, ${r.city}, ${r.postalCode}, ${r.country}`,
    `Requested account type: ${r.accountType}`,
    `Base currency: ${r.currency}`,
    `Trading experience: ${r.experience}`,
    `Submitted: ${new Date(r.submittedAt).toLocaleString()}`,
  ].join("\n");
}

export default function AdminRequestsView() {
  const requests = useApiResource(listAccountRequests, []);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleCopy(r: AccountRequest) {
    try {
      await navigator.clipboard.writeText(formatDetails(r));
      setCopiedId(r.id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      setCopiedId(null);
    }
  }

  async function handleDismiss(r: AccountRequest) {
    setBusyId(r.id);
    try {
      await updateAccountRequestStatus(r.id, "dismissed");
      requests.reload();
    } finally {
      setBusyId(null);
    }
  }

  function handleStartCreateAccount(r: AccountRequest) {
    // Fire-and-forget: mark as processed so it drops out of the pending
    // queue while the admin fills out the create-user form. Not awaited
    // since navigation happens immediately via the Link.
    void updateAccountRequestStatus(r.id, "processed");
  }

  const pending =
    requests.status === "success" ? requests.data.filter((r) => r.status === "pending") : [];
  const resolved =
    requests.status === "success" ? requests.data.filter((r) => r.status !== "pending") : [];

  return (
    <div className="flex flex-col gap-6">
      <Widget title="Pending Requests">
        {requests.status === "loading" ? (
          <LoadingBlock />
        ) : requests.status === "error" ? (
          <ErrorBlock message={requests.error} onRetry={requests.reload} />
        ) : pending.length === 0 ? (
          <EmptyState
            icon="mail"
            title="No pending requests"
            description="New submissions from the Open Account form will appear here."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {pending.map((r) => (
              <div key={r.id} className="rounded-xl border border-white/10 bg-ink-900/60 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base font-semibold text-white">
                      {r.firstName} {r.lastName}
                    </p>
                    <p className="text-sm text-white/50">{r.email}</p>
                  </div>
                  <span className="rounded-full bg-royal-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-royal-300">
                    {r.accountType}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-white/50 sm:grid-cols-4">
                  <div>
                    <p className="text-white/35">Phone</p>
                    <p className="text-white/75">{r.phone}</p>
                  </div>
                  <div>
                    <p className="text-white/35">Country</p>
                    <p className="text-white/75">{r.country}</p>
                  </div>
                  <div>
                    <p className="text-white/35">Experience</p>
                    <p className="text-white/75">{r.experience}</p>
                  </div>
                  <div>
                    <p className="text-white/35">Submitted</p>
                    <p className="text-white/75">{new Date(r.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2.5 border-t border-white/5 pt-4">
                  <button type="button" onClick={() => handleCopy(r)} className="btn-outline">
                    <Icon name={copiedId === r.id ? "check" : "copy"} className="h-4 w-4" />
                    {copiedId === r.id ? "Copied" : "Copy Details"}
                  </button>
                  <Link
                    href={`/admin/users/new?${new URLSearchParams({
                      fromRequest: r.id,
                      firstName: r.firstName,
                      lastName: r.lastName,
                      email: r.email,
                      accountType: r.accountType,
                      dob: r.dateOfBirth,
                      country: r.country,
                      phone: r.phone,
                      address: r.address,
                      city: r.city,
                      postalCode: r.postalCode,
                      currency: r.currency,
                      experience: r.experience,
                    }).toString()}`}
                    className="btn-gold"
                    onClick={() => handleStartCreateAccount(r)}
                  >
                    Create Account
                    <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDismiss(r)}
                    disabled={busyId === r.id}
                    className="rounded-full px-5 py-2.5 text-sm font-medium text-white/40 transition-colors hover:text-rose-300"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Widget>

      {resolved.length > 0 ? (
        <Widget title="Resolved Requests">
          <div className="flex flex-col divide-y divide-white/5">
            {resolved.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-white/70">
                    {r.firstName} {r.lastName}
                  </p>
                  <p className="text-[11px] text-white/35">{r.email}</p>
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/40">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </Widget>
      ) : null}
    </div>
  );
}
