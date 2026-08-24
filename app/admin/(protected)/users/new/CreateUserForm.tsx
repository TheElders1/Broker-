"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import { createUser } from "@/lib/api/services/admin";
import { ApiError } from "@/lib/api/client";
import type { User } from "@/lib/api/types";

const ACCOUNT_TYPES: User["accountType"][] = ["Basic", "Professional", "Premium"];

export default function CreateUserForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [firstName, setFirstName] = useState(searchParams.get("firstName") ?? "");
  const [lastName, setLastName] = useState(searchParams.get("lastName") ?? "");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [accountType, setAccountType] = useState<User["accountType"]>(
    (searchParams.get("accountType") as User["accountType"]) || "Basic"
  );
  const [initialBalance, setInitialBalance] = useState("0");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fromRequest = searchParams.get("fromRequest");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    const balance = Number(initialBalance);
    if (Number.isNaN(balance) || balance < 0) {
      setError("Enter a valid, non-negative initial balance.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await createUser({ firstName, lastName, email, accountType, initialBalanceUsd: balance });
      if (result.temporaryPassword) {
        setCreatedPassword(result.temporaryPassword);
      } else {
        router.push("/admin/users");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create the user.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopyPassword() {
    if (!createdPassword) return;
    try {
      await navigator.clipboard.writeText(createdPassword);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  if (createdPassword) {
    return (
      <div className="glass-card max-w-2xl p-6 sm:p-8">
        <div className="flex items-start gap-2.5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-300">
          <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Account created for {firstName} {lastName} ({email}).
          </p>
        </div>

        <div className="mt-6">
          <p className="label-field">One-time temporary password</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white">
              {createdPassword}
            </code>
            <button type="button" onClick={handleCopyPassword} className="btn-outline shrink-0">
              <Icon name={copied ? "check" : "copy"} className="h-4 w-4" />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-2 text-xs text-white/40">
            Supabase never exposes this again after you leave this page. Send it to the client
            through a secure channel now and tell them to change it after their first login.
          </p>
        </div>

        <div className="mt-6 flex justify-end border-t border-white/10 pt-6">
          <button type="button" onClick={() => router.push("/admin/users")} className="btn-gold">
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card max-w-2xl p-6 sm:p-8">
      {fromRequest ? (
        <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-royal-400/30 bg-royal-500/10 p-3.5 text-sm text-royal-200">
          <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Pre-filled from an account request. Review the details before creating the account.</p>
        </div>
      ) : null}

      {error ? (
        <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3.5 text-sm text-rose-300">
          <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="label-field">
              First Name
            </label>
            <input
              id="firstName"
              className="input-field"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="label-field">
              Last Name
            </label>
            <input
              id="lastName"
              className="input-field"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="label-field">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="accountType" className="label-field">
              Account Type
            </label>
            <select
              id="accountType"
              className="input-field"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as User["accountType"])}
            >
              {ACCOUNT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="initialBalance" className="label-field">
              Initial Balance (USD)
            </label>
            <input
              id="initialBalance"
              type="number"
              min="0"
              step="0.01"
              className="input-field"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <Link href="/admin/users" className="btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn-gold" disabled={submitting}>
            {submitting ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
