"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { formatTickerPrice } from "@/lib/useSimulatedTicker";
import { placeOrder } from "@/lib/api/services/trading";
import { ApiError } from "@/lib/api/client";
import type { MarketInstrument } from "@/lib/api/types";

const QUANTITY_PRESETS = [0.01, 0.1, 1, 5];

export default function TradeTicket({
  markets,
  symbol,
  onSymbolChange,
  currentPrice,
  bid,
  ask,
  decimals,
}: {
  markets: MarketInstrument[];
  symbol?: string;
  onSymbolChange: (symbol: string) => void;
  currentPrice: number;
  bid: number;
  ask: number;
  decimals: number;
}) {
  const [orderType, setOrderType] = useState<"Market" | "Limit" | "Stop">("Market");
  const [quantity, setQuantity] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [noticeTone, setNoticeTone] = useState<"info" | "error">("info");
  const [submitting, setSubmitting] = useState(false);

  const qty = Number(quantity) || 0;
  const estimatedCost = qty * currentPrice;

  async function handleOrder(side: "Buy" | "Sell") {
    if (!symbol) return;
    if (qty <= 0) {
      setNotice("Enter a quantity greater than zero.");
      setNoticeTone("error");
      return;
    }
    setSubmitting(true);
    setNotice(null);
    try {
      await placeOrder({
        symbol,
        side,
        orderType,
        quantity: qty,
        limitPrice: orderType === "Limit" ? Number(limitPrice) || undefined : undefined,
        stopPrice: orderType === "Stop" ? Number(stopPrice) || undefined : undefined,
        stopLoss: stopLoss ? Number(stopLoss) : undefined,
        takeProfit: takeProfit ? Number(takeProfit) : undefined,
      });
      setNotice(
        `${side} order for ${quantity} ${symbol} received — awaiting connection to the live execution backend.`
      );
      setNoticeTone("info");
    } catch (err) {
      setNotice(err instanceof ApiError ? err.message : "The order could not be submitted.");
      setNoticeTone("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="glass-card p-6">
      {notice ? (
        <div
          className={`mb-5 flex items-start gap-2.5 rounded-lg border p-3.5 text-sm ${
            noticeTone === "error"
              ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
              : "border-royal-400/30 bg-royal-500/10 text-royal-200"
          }`}
        >
          <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{notice}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-5">
        <div>
          <label htmlFor="symbol" className="label-field">
            Symbol
          </label>
          <select
            id="symbol"
            className="input-field"
            value={symbol ?? ""}
            onChange={(e) => onSymbolChange(e.target.value)}
            disabled={markets.length === 0}
          >
            {markets.length > 0 ? (
              markets.map((m) => <option key={m.symbol}>{m.symbol}</option>)
            ) : (
              <option>Loading...</option>
            )}
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
            onChange={(e) => setOrderType(e.target.value as "Market" | "Limit" | "Stop")}
          >
            <option>Market</option>
            <option>Limit</option>
            <option>Stop</option>
          </select>
        </div>

        {orderType === "Limit" ? (
          <div>
            <label htmlFor="limitPrice" className="label-field">
              Limit Price
            </label>
            <input
              id="limitPrice"
              type="number"
              min="0"
              step="0.0001"
              placeholder={formatTickerPrice(currentPrice, decimals)}
              className="input-field"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
            />
          </div>
        ) : null}

        {orderType === "Stop" ? (
          <div>
            <label htmlFor="stopPrice" className="label-field">
              Stop Price
            </label>
            <input
              id="stopPrice"
              type="number"
              min="0"
              step="0.0001"
              placeholder={formatTickerPrice(currentPrice, decimals)}
              className="input-field"
              value={stopPrice}
              onChange={(e) => setStopPrice(e.target.value)}
            />
          </div>
        ) : null}

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="quantity" className="label-field mb-0">
              Quantity
            </label>
            <div className="flex gap-1.5">
              {QUANTITY_PRESETS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuantity(String(q))}
                  className="rounded-md border border-white/10 px-2 py-0.5 text-[11px] text-white/50 transition-colors hover:border-gold-400/40 hover:text-gold-300"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <input
            id="quantity"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            className="input-field mt-2"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          {qty > 0 ? (
            <p className="mt-1.5 text-xs text-white/40">
              Estimated value: {estimatedCost.toLocaleString(undefined, { style: "currency", currency: "USD" })}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
          <div>
            <label htmlFor="stopLoss" className="label-field">
              Stop Loss <span className="text-white/30">(optional)</span>
            </label>
            <input
              id="stopLoss"
              type="number"
              min="0"
              step="0.0001"
              className="input-field"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="takeProfit" className="label-field">
              Take Profit <span className="text-white/30">(optional)</span>
            </label>
            <input
              id="takeProfit"
              type="number"
              min="0"
              step="0.0001"
              className="input-field"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleOrder("Buy")}
          disabled={submitting || !symbol}
          className="flex flex-col items-center gap-0.5 rounded-lg bg-royal-gradient py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          Buy
          <span className="text-xs font-normal tabular-nums text-white/75">{formatTickerPrice(ask, decimals)}</span>
        </button>
        <button
          type="button"
          onClick={() => handleOrder("Sell")}
          disabled={submitting || !symbol}
          className="flex flex-col items-center gap-0.5 rounded-lg bg-gold-gradient py-3 text-sm font-semibold text-ink-950 transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          Sell
          <span className="text-xs font-normal tabular-nums text-ink-950/70">{formatTickerPrice(bid, decimals)}</span>
        </button>
      </div>
    </div>
  );
}
