// Currency list used for the account opening form and the dashboard
// Settings page's primary currency preference — kept as one shared list
// so both stay in sync.
export type Currency = { code: string; symbol: string; name: string };

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", name: "U.S. Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];
