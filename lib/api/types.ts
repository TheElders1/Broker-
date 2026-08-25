// Shared API domain types. These describe the contract the frontend
// expects from the backend — the backend developer can treat this file
// as the source of truth for response shapes.

export type BitcoinTxStatus =
  | "pending"
  | "confirming"
  | "confirmed"
  | "completed"
  | "failed"
  | "cancelled";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: "Basic" | "Professional" | "Premium";
  kycStatus: "not_started" | "pending" | "verified" | "rejected";
  createdAt: string;
};

export type AuthSession = {
  user: User;
};

export type MarketInstrument = {
  symbol: string;
  category: "Forex" | "Commodities" | "Indices" | "Stocks" | "Cryptocurrencies";
  price: number;
  changePercent: number;
};

export type Position = {
  id: string;
  symbol: string;
  side: "Buy" | "Sell";
  size: number;
  entryPrice: number;
  currentPrice: number;
  pl: number;
};

export type PortfolioSummary = {
  balance: number;
  availableFunds: number;
  unrealizedPl: number;
  todayPl: number;
  todayPlPercent: number;
  equityCurve: number[];
};

export type WalletAssetBalance = {
  asset: "BTC" | "USDT" | "USD" | string;
  total: number;
  available: number;
  pending: number;
};

export type WalletSummary = {
  totalBalanceUsd: number;
  availableBalanceUsd: number;
  pendingBalanceUsd: number;
  assets: WalletAssetBalance[];
};

export type BitcoinDepositAddress = {
  address: string;
  network: "Bitcoin";
  assignedAt: string;
};

export type BitcoinDeposit = {
  id: string;
  amountBtc: number;
  status: BitcoinTxStatus;
  confirmations: number;
  confirmationsRequired: number;
  txId: string | null;
  createdAt: string;
};

export type BitcoinWithdrawalRequest = {
  destinationAddress: string;
  amountBtc: number;
};

export type BitcoinWithdrawal = {
  id: string;
  destinationAddress: string;
  amountBtc: number;
  networkFeeBtc: number;
  status: BitcoinTxStatus;
  txId: string | null;
  createdAt: string;
};

// USDT shares the same lifecycle statuses as Bitcoin (pending -> confirming
// -> confirmed -> completed, or failed/cancelled).
export type UsdtNetwork = "TRC20" | "ERC20" | "BEP20";

export type UsdtDepositAddress = {
  address: string;
  network: UsdtNetwork;
  assignedAt: string;
};

export type UsdtDeposit = {
  id: string;
  amountUsdt: number;
  network: UsdtNetwork;
  status: BitcoinTxStatus;
  confirmations: number;
  confirmationsRequired: number;
  txId: string | null;
  createdAt: string;
};

export type UsdtWithdrawalRequest = {
  destinationAddress: string;
  amountUsdt: number;
  network: UsdtNetwork;
};

export type UsdtWithdrawal = {
  id: string;
  destinationAddress: string;
  amountUsdt: number;
  network: UsdtNetwork;
  networkFeeUsdt: number;
  status: BitcoinTxStatus;
  txId: string | null;
  createdAt: string;
};

// --- Admin ---

export type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: User["accountType"];
  balanceUsd: number;
  status: "active" | "suspended";
  createdAt: string;
  // Present for self-registered accounts (the public Open Account form);
  // undefined for accounts the admin created manually, which don't
  // collect these. Never includes the password.
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  currency?: string;
  experience?: string;
};

export type CreateUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: User["accountType"];
  initialBalanceUsd: number;
  dateOfBirth: string;
  country: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  currency: string;
  experience: string;
};

export type AccountRequestStatus = "pending" | "processed" | "dismissed";

export type AccountRequest = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  accountType: string;
  currency: string;
  experience: string;
  status: AccountRequestStatus;
  submittedAt: string;
};

export type SubmitAccountRequestPayload = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  accountType: string;
  currency: string;
  experience: string;
};

export type Transaction = {
  id: string;
  type: "Deposit" | "Withdrawal" | "Trade Settlement" | "Transfer";
  asset: string;
  amount: number;
  status: BitcoinTxStatus | "settled";
  txId: string | null;
  date: string;
};

export type KycStatusResponse = {
  status: User["kycStatus"];
  submittedDocuments: { type: string; status: string; uploadedAt: string }[];
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export type SupportTicket = {
  id: string;
  subject: string;
  status: "open" | "pending" | "resolved";
  createdAt: string;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
};
