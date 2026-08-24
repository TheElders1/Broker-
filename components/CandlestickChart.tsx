"use client";

import { useEffect, useState } from "react";

type OHLC = { open: number; close: number; high: number; low: number };

const CANDLE_COUNT = 15;
const CANDLE_SPACING = 20;
const CANDLE_START_X = 10;
const MIN_Y = 2;
const MAX_Y = 78;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Generates an initial series with a gentle upward-looking drift, like the original static chart. */
function makeInitialSeries(): OHLC[] {
  const series: OHLC[] = [];
  let level = 62;
  for (let i = 0; i < CANDLE_COUNT; i++) {
    const open = level;
    level = clamp(level + (Math.random() - 0.5) * 10 - 2.4, MIN_Y, MAX_Y);
    const close = level;
    const high = clamp(Math.max(open, close) + Math.random() * 5, MIN_Y, MAX_Y);
    const low = clamp(Math.min(open, close) - Math.random() * 5, MIN_Y, MAX_Y);
    series.push({ open, close, high, low });
  }
  return series;
}

/** Random-walk the next candle from the previous close — used to append a new bar as older ones scroll off. */
function nextCandle(prevClose: number): OHLC {
  const open = prevClose;
  const close = clamp(open + (Math.random() - 0.5) * 10 - 0.6, MIN_Y, MAX_Y);
  const high = clamp(Math.max(open, close) + Math.random() * 5, MIN_Y, MAX_Y);
  const low = clamp(Math.min(open, close) - Math.random() * 5, MIN_Y, MAX_Y);
  return { open, close, high, low };
}

export default function CandlestickChart({
  className = "",
  live = false,
}: {
  className?: string;
  live?: boolean;
}) {
  const [series, setSeries] = useState<OHLC[]>(makeInitialSeries);

  useEffect(() => {
    if (!live) return;
    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const id = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1];
        const appended = [...prev, nextCandle(last.close)];
        return appended.length > CANDLE_COUNT ? appended.slice(appended.length - CANDLE_COUNT) : appended;
      });
    }, 2800);

    return () => clearInterval(id);
  }, [live]);

  return (
    <svg viewBox="0 0 300 80" className={className} preserveAspectRatio="none" aria-hidden="true">
      {series.map((c, i) => {
        const x = CANDLE_START_X + i * CANDLE_SPACING;
        const up = c.close < c.open;
        const color = up ? "#E6C264" : "#5A75DC";
        const bodyTop = Math.min(c.open, c.close);
        const bodyHeight = Math.max(Math.abs(c.open - c.close), 1.5);
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={c.high} y2={c.low} stroke={color} strokeWidth={1} opacity={0.7} />
            <rect
              x={x - 4}
              y={bodyTop}
              width={8}
              height={bodyHeight}
              rx={1.5}
              fill={color}
              opacity={0.92}
              style={live ? undefined : { animation: `float 6s ease-in-out ${i * 0.15}s infinite` }}
            />
          </g>
        );
      })}
    </svg>
  );
}
