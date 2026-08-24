/**
 * DEMO / MOCK DATA — used only when the app is running in "demo" mode
 * (see lib/api/config.ts). None of this represents real users, funds,
 * balances, or blockchain activity. Every service module that reads from
 * here is written so that switching APP_MODE to "production" makes it
 * call the real backend instead — nothing here reaches production output.
 */

import type {
  AccountRequest,
  AdminUser,
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
  UsdtDeposit,
  UsdtDepositAddress,
  UsdtWithdrawal,
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
    { asset: "USDT", total: 0, available: 0, pending: 0 },
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

export const MOCK_USDT_DEPOSIT_ADDRESS: UsdtDepositAddress = {
  address: "T-demo-usdt-address-not-real-0000000000",
  network: "TRC20",
  assignedAt: "2026-01-01T00:00:00Z",
};

export const MOCK_USDT_DEPOSITS: UsdtDeposit[] = [];

export const MOCK_USDT_WITHDRAWALS: UsdtWithdrawal[] = [];

export const MOCK_TRANSACTIONS: Transaction[] = [];

export const MOCK_KYC_STATUS: KycStatusResponse = {
  status: "not_started",
  submittedDocuments: [],
};

export const MOCK_NOTIFICATIONS: NotificationItem[] = [];

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [];

// Sample demo records so the admin panel has something to show and act
// on. These are clearly fictional — not real clients — and only exist
// in this browser session; nothing here persists to a real database.
export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: "admin-demo-user-1",
    firstName: "Amara",
    lastName: "Whitfield",
    email: "amara.whitfield@example.com",
    accountType: "Professional",
    balanceUsd: 12480.5,
    status: "active",
    createdAt: "2026-02-11T09:30:00Z",
  },
  {
    id: "admin-demo-user-2",
    firstName: "Daniel",
    lastName: "Osei",
    email: "daniel.osei@example.com",
    accountType: "Basic",
    balanceUsd: 500,
    status: "active",
    createdAt: "2026-03-02T14:05:00Z",
  },
  {
    id: "admin-demo-user-3",
    firstName: "Priya",
    lastName: "Nair",
    email: "priya.nair@example.com",
    accountType: "Premium",
    balanceUsd: 84200,
    status: "suspended",
    createdAt: "2026-01-20T11:15:00Z",
  },
];

export const MOCK_ACCOUNT_REQUESTS: AccountRequest[] = [
  {
    id: "req-demo-1",
    firstName: "Marcus",
    lastName: "Lindqvist",
    dateOfBirth: "1991-04-12",
    email: "marcus.lindqvist@example.com",
    phone: "+46 70 123 4567",
    address: "14 Storgatan",
    city: "Stockholm",
    postalCode: "111 22",
    country: "Sweden",
    accountType: "Professional",
    currency: "USD",
    experience: "Intermediate",
    status: "pending",
    submittedAt: "2026-08-20T16:42:00Z",
  },
  {
    id: "req-demo-2",
    firstName: "Chidinma",
    lastName: "Eze",
    dateOfBirth: "1997-09-03",
    email: "chidinma.eze@example.com",
    phone: "+234 802 555 0134",
    address: "22 Adeola Odeku Street",
    city: "Lagos",
    postalCode: "106104",
    country: "Nigeria",
    accountType: "Basic",
    currency: "USD",
    experience: "Beginner",
    status: "pending",
    submittedAt: "2026-08-22T08:15:00Z",
  },
];

export async function mockDelay<T>(value: T, ms = 450): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return value;
}
