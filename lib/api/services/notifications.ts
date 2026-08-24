import { apiFetch } from "../client";
import { IS_DEMO_MODE } from "../config";
import { MOCK_NOTIFICATIONS, mockDelay } from "../mock";
import type { NotificationItem } from "../types";

/**
 * Backend contract:
 *   GET  /notifications           -> NotificationItem[]
 *   POST /notifications/:id/read  -> 204
 */

export async function listNotifications(): Promise<NotificationItem[]> {
  if (IS_DEMO_MODE) return mockDelay(MOCK_NOTIFICATIONS);
  return apiFetch<NotificationItem[]>("/notifications");
}

export async function markNotificationRead(id: string): Promise<void> {
  if (IS_DEMO_MODE) return mockDelay(undefined, 200);
  await apiFetch<void>(`/notifications/${encodeURIComponent(id)}/read`, { method: "POST" });
}
