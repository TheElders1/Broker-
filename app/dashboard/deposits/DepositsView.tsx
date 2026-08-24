"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import BitcoinAddressQR from "@/components/BitcoinAddressQR";
import CopyButton from "@/components/CopyButton";
import BitcoinStatusBadge from "@/components/BitcoinStatusBadge";
import { Widget, EmptyState } from "@/components/dashboard/DashboardWidgets";
import { LoadingBlock, ErrorBlock } from "@/components/dashboard/ResourceState";
import { useApiResource } from "@/lib/useApiResource";
import { getDepositAddress as getBtcAddress, listDeposits as listBtcDeposits } from "@/lib/api/services/bitcoin";
import { getDepositAddress as getUsdtAddress, listDeposits as listUsdtDeposits } from "@/lib/api/services/usdt";
import type { UsdtNetwork } from "@/lib/api/types";

type Asset = "BTC" | "USDT";
const USDT_NETWORKS: UsdtNetwork[] = ["TRC20", "ERC20", "BEP20"];

export default function DepositsView() {
  const [asset, setAsset] = useState<Asset>("BTC");
  const [network, setNetwork] = useState<UsdtNetwork>("TRC20");

  const btcAddress = useApiResource(getBtcAddress, []);
  const btcDeposits = useApiResource(listBtcDeposits, []);
  const usdtAddress = useApiResource(() => getUsdtAddress(network), [network]);
  const usdtDeposits = useApiResource(listUsdtDeposits, []);

  const address = asset === "BTC" ? btcAddress : usdtAddress;
  const deposits = asset === "BTC" ? btcDeposits : usdtDeposits;

  return (
    <div>
      <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/[0.02] p-1">
        {(["BTC", "USDT"] as Asset[]).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAsset(a)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              asset === a ? "bg-gold-gradient text-ink-950" : "text-white/60 hover:text-white"
            }`}
          >
            {a === "BTC" ? "Bitcoin" : "USDT"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.4fr]">
        <Widget title={asset === "BTC" ? "Bitcoin Deposit Address" : "USDT Deposit Address"}>
          {asset === "USDT" ? (
            <div className="mb-5">
              <label htmlFor="usdtNetwork" className="label-field">
                Network
              </label>
              <select
                id="usdtNetwork"
                className="input-field"
                value={network}
                onChange={(e) => setNetwork(e.target.value as UsdtNetwork)}
              >
                {USDT_NETWORKS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-white/40">
                Sending USDT on the wrong network can result in permanent loss of funds — always
                match the network here to the network you send from.
              </p>
            </div>
          ) : null}

          {address.status === "loading" ? (
            <LoadingBlock />
          ) : address.status === "error" ? (
            <ErrorBlock message={address.error} onRetry={address.reload} />
          ) : (
            <div className="flex flex-col items-center gap-5 text-center">
              <BitcoinAddressQR address={address.data.address} />
              <div className="w-full rounded-lg border border-white/10 bg-ink-900/60 px-4 py-3">
                <p className="break-all font-mono text-xs text-white/70">{address.data.address}</p>
              </div>
              <CopyButton value={address.data.address} label="Copy Address" />
              <div className="flex items-start gap-2.5 rounded-lg border border-royal-400/30 bg-royal-500/10 p-3.5 text-left text-xs text-royal-200">
                <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  {asset === "BTC"
                    ? "Send only Bitcoin (BTC) to this address."
                    : `Send only USDT on the ${network} network to this address.`}{" "}
                  This address and its balance are controlled entirely by the backend — the
                  frontend never holds private keys.
                </p>
              </div>
            </div>
          )}
        </Widget>

        <Widget title="Deposit History">
          {deposits.status === "loading" ? (
            <LoadingBlock />
          ) : deposits.status === "error" ? (
            <ErrorBlock message={deposits.error} onRetry={deposits.reload} />
          ) : deposits.data.length === 0 ? (
            <EmptyState
              icon="lock"
              title="No deposits yet"
              description={`Once you send ${asset === "BTC" ? "Bitcoin" : "USDT"} to your deposit address, it will appear here with live confirmation status.`}
            />
          ) : (
            <div className="flex flex-col gap-4">
              {deposits.data.map((d) => (
                <div key={d.id} className="rounded-xl border border-white/10 bg-ink-900/60 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-base font-semibold text-white">
                      {"amountBtc" in d ? `${d.amountBtc} BTC` : `${d.amountUsdt} USDT`}
                    </p>
                    <BitcoinStatusBadge status={d.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-white/50">
                    <div>
                      <p className="text-white/35">Confirmations</p>
                      <p className="text-white/75">
                        {d.confirmations}/{d.confirmationsRequired}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/35">Date</p>
                      <p className="text-white/75">{new Date(d.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-white/35">Transaction ID</p>
                      <p className="break-all font-mono text-white/75">{d.txId ?? "Pending assignment"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Widget>
      </div>
    </div>
  );
}
