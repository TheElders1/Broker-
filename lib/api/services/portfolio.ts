import { apiFetch } from "../client";
import { IS_DEMO_MODE } from "../config";
import { MOCK_PORTFOLIO, MOCK_POSITIONS, mockDelay } from "../mock";
import type { PortfolioSummary, Position } from "../types";

/**
 * Backend contract:
 *   GET /portfolio/summary     -> PortfolioSummary
 *   GET /portfolio/positions   -> Position[]
 */

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  if (IS_DEMO_MODE) return mockDelay(MOCK_PORTFOLIO);
  return apiFetch<PortfolioSummary>("/portfolio/summary");
}

export async function listPositions(): Promise<Position[]> {
  if (IS_DEMO_MODE) return mockDelay(MOCK_POSITIONS);
  return apiFetch<Position[]>("/portfolio/positions");
}
