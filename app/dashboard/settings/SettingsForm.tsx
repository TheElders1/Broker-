"use client";

import { useState, type FormEvent } from "react";
import { Widget } from "@/components/dashboard/DashboardWidgets";
import Icon from "@/components/Icon";
import { CURRENCIES } from "@/lib/currencies";
import { createClient } from "@/utils/supabase/client";

type Initial = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  currency: string;
};

export default function SettingsForm({
  initial,
  supabaseConfigured,
}: {
  initial: Initial;
  supabaseConfigured: boolean;
}) {
  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [currency, setCurrency] = useState(initial.currency);
  const [profileStatus, setProfileStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [profileError, setProfileError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabaseConfigured || !initial.userId) return;
    setProfileStatus("saving");
    setProfileError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ first_name: firstName, last_name: lastName, currency })
        .eq("id", initial.userId);
      if (error) throw error;
      setProfileStatus("saved");
      window.setTimeout(() => setProfileStatus("idle"), 2000);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Could not save your changes.");
      setProfileStatus("idle");
    }
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabaseConfigured) return;
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    setPasswordStatus("saving");
    setPasswordError(null);
    try {
      const supabase = createClient();
      // Re-verify the current password before applying a change, rather
      // than trusting the existing session alone.
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: initial.email,
        password: currentPassword,
      });
      if (verifyError) throw new Error("Current password is incorrect.");

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;

      setPasswordStatus("saved");
      setCurrentPassword("");
      setNewPassword("");
      window.setTimeout(() => setPasswordStatus("idle"), 2000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Could not update your password.");
      setPasswordStatus("idle");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Widget title="Profile Information">
        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
          {!supabaseConfigured ? (
            <p className="text-xs text-white/40">
              Account settings are not yet connected to a live authentication backend.
            </p>
          ) : null}

          {profileError ? (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300"
            >
              <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{profileError}</p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="label-field">
                First Name
              </label>
              <input
                id="firstName"
                className="input-field"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!supabaseConfigured}
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
                disabled={!supabaseConfigured}
              />
            </div>
          </div>

          <div>
            <label htmlFor="settingsEmail" className="label-field">
              Email Address
            </label>
            <input
              id="settingsEmail"
              type="email"
              className="input-field opacity-60"
              value={initial.email}
              disabled
            />
            <p className="mt-1.5 text-xs text-white/35">
              Contact support to change the email address on your account.
            </p>
          </div>

          <div>
            <label htmlFor="currency" className="label-field">
              Primary Currency
            </label>
            <select
              id="currency"
              className="input-field"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={!supabaseConfigured}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol}) — {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn-outline w-fit"
            disabled={!supabaseConfigured || profileStatus === "saving"}
          >
            {profileStatus === "saving" ? "Saving..." : profileStatus === "saved" ? "Saved" : "Save Changes"}
          </button>
        </form>
      </Widget>

      <Widget title="Security">
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          {passwordError ? (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300"
            >
              <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{passwordError}</p>
            </div>
          ) : null}

          <div>
            <label htmlFor="currentPassword" className="label-field">
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              className="input-field"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={!supabaseConfigured}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="label-field">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              className="input-field"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={!supabaseConfigured}
            />
          </div>
          <button
            type="submit"
            className="btn-outline w-fit"
            disabled={!supabaseConfigured || passwordStatus === "saving"}
          >
            {passwordStatus === "saving"
              ? "Updating..."
              : passwordStatus === "saved"
              ? "Updated"
              : "Update Password"}
          </button>
        </form>
      </Widget>
    </div>
  );
}
