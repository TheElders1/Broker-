"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import { IS_SUPABASE_CONFIGURED } from "@/lib/supabaseMode";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  useEffect(() => {
    if (!IS_SUPABASE_CONFIGURED) return;
    const supabase = createClient();
    // The reset-link redirect exchanges its token for a session automatically
    // (detectSessionInUrl, on by default); confirm one exists before letting
    // the user submit a new password.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setStatus("submitting");
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setStatus("idle");

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setStatus("done");
    window.setTimeout(() => router.push("/login"), 2000);
  }

  if (!IS_SUPABASE_CONFIGURED || !ready) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-white/55">
          This reset link is invalid or has expired. Request a new one to continue.
        </p>
        <Link href="/login/forgot-password" className="btn-outline w-full sm:w-fit">
          Request a New Link
        </Link>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-300"
      >
        <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0" />
        <p>Password updated. Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {error ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-gold-500/30 bg-gold-500/10 p-3.5 text-sm text-gold-200"
        >
          <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      <div>
        <label htmlFor="password" className="label-field">
          New Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="label-field">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          className="input-field"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button type="submit" className="btn-gold w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
