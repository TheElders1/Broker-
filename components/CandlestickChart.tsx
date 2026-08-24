type Candle = { x: number; open: number; close: number; high: number; low: number };

const CANDLES: Candle[] = [
  { x: 10, open: 60, close: 48, high: 66, low: 44 },
  { x: 30, open: 48, close: 55, high: 60, low: 42 },
  { x: 50, open: 55, close: 40, high: 58, low: 36 },
  { x: 70, open: 40, close: 46, high: 50, low: 34 },
  { x: 90, open: 46, close: 30, high: 48, low: 26 },
  { x: 110, open: 30, close: 38, high: 42, low: 24 },
  { x: 130, open: 38, close: 26, high: 40, low: 20 },
  { x: 150, open: 26, close: 34, high: 38, low: 18 },
  { x: 170, open: 34, close: 22, high: 36, low: 16 },
  { x: 190, open: 22, close: 30, high: 34, low: 14 },
  { x: 210, open: 30, close: 16, high: 32, low: 10 },
  { x: 230, open: 16, close: 24, high: 28, low: 8 },
  { x: 250, open: 24, close: 12, high: 26, low: 6 },
  { x: 270, open: 12, close: 20, high: 24, low: 4 },
  { x: 290, open: 20, close: 8, high: 22, low: 2 },
];

export default function CandlestickChart({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 80"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {CANDLES.map((c, i) => {
        const up = c.close < c.open;
        const color = up ? "#E6C264" : "#5A75DC";
        const bodyTop = Math.min(c.open, c.close);
        const bodyHeight = Math.max(Math.abs(c.open - c.close), 1.5);
        return (
          <g key={i}>
            <line
              x1={c.x}
              x2={c.x}
              y1={c.high}
              y2={c.low}
              stroke={color}
              strokeWidth={1}
              opacity={0.7}
            />
            <rect
              x={c.x - 4}
              y={bodyTop}
              width={8}
              height={bodyHeight}
              rx={1.5}
              fill={color}
              opacity={0.92}
              style={{ animation: `float 6s ease-in-out ${i * 0.15}s infinite` }}
            />
          </g>
        );
      })}
    </svg>
  );
}
