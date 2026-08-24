"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { useApiResource } from "@/lib/useApiResource";
import { listMarkets } from "@/lib/api/services/markets";
import { placeOrder } from "@/lib/api/services/trading";
import { ApiError } from "@/lib/api/client";

export default function TradeTicket() {
  const markets = useApiResource(listMarkets, []);
  const [symbol, setSymbol] = useState<string | null>(null);
  const [orderType, setOrderType] = useState("Market");
  const [quantity, setQuantity] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const activeSymbol = symbol ?? (markets.status === "success" ? markets.data[0]?.symbol : undefined);

  async function handleOrder(side: "Buy" | "Sell") {
    if (!activeSymbol) return;
    setSubmitting(true);
    setNotice(null);
    try {
      await placeOrder({
        symbol: activeSymbol,
        side,
        orderType: orderType as "Market" | "Limit" | "Stop",
        quantity: Number(quantity) || 0,
      });
      setNotice(
        `${side} order for ${quantity || "0"} ${activeSymbol} was submitted to the demo API layer — no real trading backend is connected yet.`
      );
    } catch (err) {
      setNotice(err instanceof ApiError ? err.message : "The order could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="glass-card p-6">
      {notice ? (
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-royal-400/30 bg-royal-500/10 p-3.5 text-sm text-royal-200">
          <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{notice}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="symbol" className="label-field">
            Symbol
          </label>
          <select
            id="symbol"
            className="input-field"
            value={activeSymbol ?? ""}
            onChange={(e) => setSymbol(e.target.value)}
            disabled={markets.status !== "success"}
          >
            {markets.status === "success"
              ? markets.data.map((m) => <option key={m.symbol}>{m.symbol}</option>)
              : <option>Loading...</option>}
          </select>
        </div>

        <div>
          <label htmlFor="orderType" className="label-field">
            Order Type
          </label>
          <select
            id="orderType"
            className="input-field"
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
          >
            <option>Market</option>
            <option>Limit</option>
            <option>Stop</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="quantity" className="label-field">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            className="input-field"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleOrder("Buy")}
          disabled={submitting || !activeSymbol}
          className="rounded-lg bg-royal-gradient py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => handleOrder("Sell")}
          disabled={submitting || !activeSymbol}
          className="rounded-lg bg-gold-gradient py-3 text-sm font-semibold text-ink-950 transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          Sell
        </button>
      </div>
    </div>
  );
}
