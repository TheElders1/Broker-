"use client";

import { useEffect } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6">
      <div className="glass-card flex max-w-md flex-col items-center gap-5 p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
          <Icon name="alert" className="h-7 w-7" />
        </span>
        <h1 className="font-display text-2xl font-semibold text-white">Something Went Wrong</h1>
        <p className="text-sm text-white/55">
          An unexpected error occurred while loading this page. Please try again.
        </p>
        <div className="flex gap-3">
          <button type="button" onClick={reset} className="btn-gold">
            Try Again
          </button>
          <Link href="/" className="btn-outline">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
