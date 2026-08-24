import { apiFetch } from "../client";
import { IS_DEMO_MODE } from "../config";
import { MOCK_SUPPORT_TICKETS, mockDelay } from "../mock";
import type { SupportTicket } from "../types";

/**
 * Backend contract:
 *   GET  /support/tickets   -> SupportTicket[]
 *   POST /support/tickets   { topic, details } -> SupportTicket
 */

export async function listTickets(): Promise<SupportTicket[]> {
  if (IS_DEMO_MODE) return mockDelay(MOCK_SUPPORT_TICKETS);
  return apiFetch<SupportTicket[]>("/support/tickets");
}

export type CreateTicketPayload = { topic: string; details: string };

export async function createTicket(payload: CreateTicketPayload): Promise<SupportTicket> {
  if (IS_DEMO_MODE) {
    return mockDelay(
      { id: `demo-ticket-${Date.now()}`, subject: payload.topic, status: "open", createdAt: new Date().toISOString() },
      600
    );
  }
  return apiFetch<SupportTicket>("/support/tickets", { method: "POST", body: payload });
}
