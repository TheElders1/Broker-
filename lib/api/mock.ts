/**
 * DEMO / MOCK DATA — used only when the app is running in "demo" mode
 * (see lib/api/config.ts). None of this represents real users, funds,
 * balances, or blockchain activity. Every service module that reads from
 * here is written so that switching APP_MODE to "production" makes it
 * call the real backend instead — nothing here reaches production output.
 */

import type {
  BitcoinDeposit,
  BitcoinDepositAddress,
  BitcoinWithdrawal,
  KycStatusResponse,
  MarketInstrument,
  NotificationItem,
  PortfolioSummary,
  Position,
  SupportTicket,
  Transaction,
  User,
  WalletSummary,
} from "./types";

export const MOCK_USER: User = {
  id: "demo-user-1",
  firstName: "Demo",
  lastName: "Client",
  email: "demo.client@example.com",
  accountType: "Basic",
  kycStatus: "not_started",
  createdAt: "2026-01-01T00:00:00Z",
};

export const MOCK_MARKETS: MarketInstrument[] = [
  { symbol: "EUR/USD", category: "Forex", price: 1.0842, changePercent: 0.24 },
  { symbol: "GBP/USD", category: "Forex", price: 1.2715, changePercent: -0.11 },
  { symbol: "XAU/USD", category: "Commodities", price: 2342.1, changePercent: 0.62 },
  { symbol: "WTI Crude", category: "Commodities", price: 78.42, changePercent: -0.45 },
  { symbol: "US 500", category: "Indices", price: 5308.4, changePercent: -0.08 },
  { symbol: "UK 100", category: "Indices", price: 8120.6, changePercent: 0.32 },
  { symbol: "BTC/USD", category: "Cryptocurrencies", price: 64210, changePercent: 1.35 },
  { symbol: "ETH/USD", category: "Cryptocurrencies", price: 3142, changePercent: 0.94 },
];

export const MOCK_POSITIONS: Position[] = [];

export const MOCK_PORTFOLIO: PortfolioSummary = {
  balance: 0,
  availableFunds: 0,
  unrealizedPl: 0,
  todayPl: 0,
  todayPlPercent: 0,
  equityCurve: [10, 12, 11, 15, 14, 18, 16, 20, 19, 22],
};

export const MOCK_WALLET: WalletSummary = {
  totalBalanceUsd: 0,
  availableBalanceUsd: 0,
  pendingBalanceUsd: 0,
  assets: [
    { asset: "BTC", total: 0, available: 0, pending: 0 },
    { asset: "USD", total: 0, available: 0, pending: 0 },
  ],
};

export const MOCK_DEPOSIT_ADDRESS: BitcoinDepositAddress = {
  address: "bc1q-demo-address-not-real-0000000000000",
  network: "Bitcoin",
  assignedAt: "2026-01-01T00:00:00Z",
};

export const MOCK_BITCOIN_DEPOSITS: BitcoinDeposit[] = [];

export const MOCK_BITCOIN_WITHDRAWALS: BitcoinWithdrawal[] = [];

export const MOCK_TRANSACTIONS: Transaction[] = [];

export const MOCK_KYC_STATUS: KycStatusResponse = {
  status: "not_started",
  submittedDocuments: [],
};

export const MOCK_NOTIFICATIONS: NotificationItem[] = [];

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [];

export async function mockDelay<T>(value: T, ms = 450): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return value;
}
