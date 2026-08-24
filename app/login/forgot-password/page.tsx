import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Genesis Pro LTD account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset Your Password"
      subtitle="Enter the email address associated with your account and we'll send you a reset link once account recovery is connected."
    >
      <form className="flex flex-col gap-5">
        <div>
          <label htmlFor="email" className="label-field">
            Email
          </label>
          <input id="email" type="email" required autoComplete="email" className="input-field" />
        </div>
        <button type="submit" className="btn-gold w-full" disabled>
          Send Reset Link
        </button>
        <p className="text-center text-xs text-white/40">
          Password recovery is not yet connected to a live authentication backend.
        </p>
        <p className="text-center text-sm text-white/50">
          <Link href="/login" className="font-semibold text-gold-400 hover:text-gold-300">
            Back to login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
