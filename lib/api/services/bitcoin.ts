import { apiFetch } from "../client";
import { IS_DEMO_MODE } from "../config";
import {
  MOCK_BITCOIN_DEPOSITS,
  MOCK_BITCOIN_WITHDRAWALS,
  MOCK_DEPOSIT_ADDRESS,
  mockDelay,
} from "../mock";
import type { BitcoinDeposit, BitcoinDepositAddress, BitcoinWithdrawal, BitcoinWithdrawalRequest } from "../types";

/**
 * Backend contract:
 *   GET  /bitcoin/deposit-address     -> BitcoinDepositAddress
 *   GET  /bitcoin/deposits            -> BitcoinDeposit[]
 *   GET  /bitcoin/withdrawals         -> BitcoinWithdrawal[]
 *   POST /bitcoin/withdrawals         { destinationAddress, amountBtc } -> BitcoinWithdrawal
 *
 * IMPORTANT: the frontend never generates Bitcoin addresses, holds private
 * keys, or signs transactions. It only ever displays what the backend
 * returns. Withdrawal requests are submitted to the backend for it to
 * validate, queue, and broadcast.
 */

export async function getDepositAddress(): Promise<BitcoinDepositAddress> {
  if (IS_DEMO_MODE) return mockDelay(MOCK_DEPOSIT_ADDRESS);
  return apiFetch<BitcoinDepositAddress>("/bitcoin/deposit-address");
}

export async function listDeposits(): Promise<BitcoinDeposit[]> {
  if (IS_DEMO_MODE) return mockDelay(MOCK_BITCOIN_DEPOSITS);
  return apiFetch<BitcoinDeposit[]>("/bitcoin/deposits");
}

export async function listWithdrawals(): Promise<BitcoinWithdrawal[]> {
  if (IS_DEMO_MODE) return mockDelay(MOCK_BITCOIN_WITHDRAWALS);
  return apiFetch<BitcoinWithdrawal[]>("/bitcoin/withdrawals");
}

export async function requestWithdrawal(req: BitcoinWithdrawalRequest): Promise<BitcoinWithdrawal> {
  if (IS_DEMO_MODE) {
    return mockDelay(
      {
        id: `demo-btc-wd-${Date.now()}`,
        destinationAddress: req.destinationAddress,
        amountBtc: req.amountBtc,
        networkFeeBtc: 0,
        status: "pending",
        txId: null,
        createdAt: new Date().toISOString(),
      },
      700
    );
  }
  return apiFetch<BitcoinWithdrawal>("/bitcoin/withdrawals", { method: "POST", body: req });
}
