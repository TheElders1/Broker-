"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

export default function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" onClick={handleCopy} className="btn-outline">
      <Icon name={copied ? "check" : "copy"} className="h-4 w-4" />
      {copied ? "Copied" : label}
    </button>
  );
}
