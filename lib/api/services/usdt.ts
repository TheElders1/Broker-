import { apiFetch } from "../client";
import { IS_DEMO_MODE } from "../config";
import {
  MOCK_USDT_DEPOSITS,
  MOCK_USDT_DEPOSIT_ADDRESS,
  MOCK_USDT_WITHDRAWALS,
  mockDelay,
} from "../mock";
import type { UsdtDeposit, UsdtDepositAddress, UsdtNetwork, UsdtWithdrawal, UsdtWithdrawalRequest } from "../types";

/**
 * Backend contract:
 *   GET  /usdt/deposit-address?network=TRC20|ERC20|BEP20   -> UsdtDepositAddress
 *   GET  /usdt/deposits                                    -> UsdtDeposit[]
 *   GET  /usdt/withdrawals                                 -> UsdtWithdrawal[]
 *   POST /usdt/withdrawals   { destinationAddress, amountUsdt, network } -> UsdtWithdrawal
 *
 * USDT deposit addresses are network-specific (TRC20/ERC20/BEP20 are
 * different chains) — always confirm the network before requesting an
 * address or submitting a withdrawal. As with Bitcoin, the frontend never
 * generates addresses, holds private keys, or signs transactions; it only
 * displays what the backend returns and submits withdrawal requests for
 * the backend to validate and broadcast.
 */

export async function getDepositAddress(network: UsdtNetwork = "TRC20"): Promise<UsdtDepositAddress> {
  if (IS_DEMO_MODE) return mockDelay({ ...MOCK_USDT_DEPOSIT_ADDRESS, network });
  return apiFetch<UsdtDepositAddress>("/usdt/deposit-address", { query: { network } });
}

export async function listDeposits(): Promise<UsdtDeposit[]> {
  if (IS_DEMO_MODE) return mockDelay(MOCK_USDT_DEPOSITS);
  return apiFetch<UsdtDeposit[]>("/usdt/deposits");
}

export async function listWithdrawals(): Promise<UsdtWithdrawal[]> {
  if (IS_DEMO_MODE) return mockDelay(MOCK_USDT_WITHDRAWALS);
  return apiFetch<UsdtWithdrawal[]>("/usdt/withdrawals");
}

export async function requestWithdrawal(req: UsdtWithdrawalRequest): Promise<UsdtWithdrawal> {
  if (IS_DEMO_MODE) {
    return mockDelay(
      {
        id: `demo-usdt-wd-${Date.now()}`,
        destinationAddress: req.destinationAddress,
        amountUsdt: req.amountUsdt,
        network: req.network,
        networkFeeUsdt: 0,
        status: "pending",
        txId: null,
        createdAt: new Date().toISOString(),
      },
      700
    );
  }
  return apiFetch<UsdtWithdrawal>("/usdt/withdrawals", { method: "POST", body: req });
}
