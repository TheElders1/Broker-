"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { Widget, EmptyState } from "@/components/dashboard/DashboardWidgets";
import { LoadingBlock, ErrorBlock } from "@/components/dashboard/ResourceState";
import { useApiResource } from "@/lib/useApiResource";
import { listUsers, updateUserBalance, deleteUser } from "@/lib/api/services/admin";
import { ApiError } from "@/lib/api/client";
import type { AdminUser } from "@/lib/api/types";

function formatUsd(value: number) {
  return value.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function AdminUsersView() {
  const users = useApiResource(listUsers, []);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState<AdminUser | null>(null);

  return (
    <div>
      <Widget
        title="All Users"
        action={
          <Link href="/admin/users/new" className="btn-gold">
            <Icon name="arrow" className="h-4 w-4 rotate-90" />
            Create User
          </Link>
        }
      >
        {users.status === "loading" ? (
          <LoadingBlock />
        ) : users.status === "error" ? (
          <ErrorBlock message={users.error} onRetry={users.reload} />
        ) : users.data.length === 0 ? (
          <EmptyState icon="users" title="No users yet" description="Create the first user account to get started." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-white/40">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Account</th>
                  <th className="pb-3 font-medium">Balance</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.data.map((u) => (
                  <tr key={u.id} className="text-white/75">
                    <td className="py-3 font-medium text-white/90">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="py-3 text-white/55">{u.email}</td>
                    <td className="py-3">{u.accountType}</td>
                    <td className="py-3 font-mono text-white/85">{formatUsd(u.balanceUsd)}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                          u.status === "active"
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-white/5 text-white/40"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditing(u)}
                          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:border-gold-400/40 hover:text-gold-300"
                        >
                          Edit Balance
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(u)}
                          className="rounded-lg border border-rose-500/25 px-3 py-1.5 text-xs font-semibold text-rose-300 transition-colors hover:border-rose-400/50 hover:bg-rose-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Widget>

      {editing ? (
        <EditBalanceDialog
          user={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            users.reload();
          }}
        />
      ) : null}

      {deleting ? (
        <ConfirmDeleteDialog
          user={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={() => {
            setDeleting(null);
            users.reload();
          }}
        />
      ) : null}
    </div>
  );
}

function EditBalanceDialog({
  user,
  onClose,
  onSaved,
}: {
  user: AdminUser;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [value, setValue] = useState(String(user.balanceUsd));
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const num = Number(value);
    if (Number.isNaN(num) || num < 0) {
      setError("Enter a valid, non-negative balance.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateUserBalance(user.id, num, reason || undefined);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update the balance.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-sm rounded-xl2 border border-white/10 bg-ink-900 p-6 shadow-2xl">
        <h3 className="font-display text-lg font-semibold text-white">Edit Balance</h3>
        <p className="mt-1 text-sm text-white/50">
          {user.firstName} {user.lastName} &middot; {user.email}
        </p>

        {error ? <p className="mt-3 text-sm text-rose-400">{error}</p> : null}

        <div className="mt-4">
          <label htmlFor="newBalance" className="label-field">
            New Balance (USD)
          </label>
          <input
            id="newBalance"
            type="number"
            min="0"
            step="0.01"
            className="input-field"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="reason" className="label-field">
            Reason (optional)
          </label>
          <input
            id="reason"
            className="input-field"
            placeholder="e.g. manual deposit reconciliation"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="btn-outline flex-1">
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={saving} className="btn-gold flex-1">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDeleteDialog({
  user,
  onClose,
  onDeleted,
}: {
  user: AdminUser;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await deleteUser(user.id);
      onDeleted();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete this user.");
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-sm rounded-xl2 border border-rose-500/25 bg-ink-900 p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/15 text-rose-400">
            <Icon name="alert" className="h-5 w-5" />
          </span>
          <h3 className="font-display text-lg font-semibold text-white">Delete User</h3>
        </div>
        <p className="mt-3 text-sm text-white/60">
          Delete <strong className="text-white/85">{user.firstName} {user.lastName}</strong> ({user.email})?
          This cannot be undone.
        </p>
        {error ? <p className="mt-3 text-sm text-rose-400">{error}</p> : null}
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="btn-outline flex-1">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 rounded-full bg-rose-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-400 disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
