"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { IS_SUPABASE_CONFIGURED } from "@/lib/supabaseMode";
import { createClient } from "@/utils/supabase/client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Enter your account email address.");
      return;
    }
    setError(null);

    if (!IS_SUPABASE_CONFIGURED) {
      setError("Password recovery is not yet connected to a live authentication backend.");
      return;
    }

    setStatus("submitting");
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login/reset-password`,
    });
    setStatus("idle");

    if (resetError) {
      setError(resetError.message);
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-300"
      >
        <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0" />
        <p>
          If an account exists for that email, a reset link has been sent. Check your inbox and
          follow the link to choose a new password.
        </p>
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
        <label htmlFor="email" className="label-field">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button type="submit" className="btn-gold w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send Reset Link"}
      </button>

      <p className="text-center text-sm text-white/50">
        <Link href="/login" className="font-semibold text-gold-400 hover:text-gold-300">
          Back to login
        </Link>
      </p>
    </form>
  );
}
