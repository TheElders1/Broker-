"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Icon";
import { login } from "@/lib/api/services/auth";
import { ApiError } from "@/lib/api/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(() =>
    searchParams.get("sessionExpired") ? "Your session has expired. Please log in again." : null
  );
  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Enter both your email address and password.");
      return;
    }
    setError(null);
    setStatus("submitting");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Authentication is not yet connected to a live backend. This is a demo login form."
      );
    } finally {
      setStatus("idle");
    }
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
          autoComplete="email"
          required
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password" className="label-field">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="input-field pr-11"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <Icon name="eye" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-white/60">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-400"
          />
          Remember me
        </label>
        <Link href="/login/forgot-password" className="font-medium text-gold-400 hover:text-gold-300">
          Forgot password?
        </Link>
      </div>

      <button type="submit" className="btn-gold w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Signing in..." : "Login"}
      </button>

      <p className="text-center text-sm text-white/50">
        Don&apos;t have an account?{" "}
        <Link href="/open-account" className="font-semibold text-gold-400 hover:text-gold-300">
          Create Account
        </Link>
      </p>
    </form>
  );
}
