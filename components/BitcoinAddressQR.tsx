"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function BitcoinAddressQR({
  address,
  size = 176,
}: {
  address: string;
  size?: number;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(address, {
      width: size,
      margin: 1,
      color: { dark: "#05070D", light: "#F0D98C" },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [address, size]);

  return (
    <div
      className="flex items-center justify-center rounded-xl border border-white/10 bg-white p-3"
      style={{ width: size + 24, height: size + 24 }}
    >
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={dataUrl} alt={`QR code for Bitcoin address ${address}`} width={size} height={size} />
      ) : (
        <div className="h-full w-full animate-pulse rounded-lg bg-ink-900/10" />
      )}
    </div>
  );
}
