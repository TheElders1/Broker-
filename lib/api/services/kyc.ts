import { apiFetch, apiFetchForm } from "../client";
import { IS_DEMO_MODE } from "../config";
import { MOCK_KYC_STATUS, mockDelay } from "../mock";
import type { KycStatusResponse } from "../types";

/**
 * Backend contract:
 *   GET  /kyc/status                 -> KycStatusResponse
 *   POST /kyc/documents (multipart)  { documentType, file } -> 202
 *
 * The frontend never performs identity verification itself — it only
 * uploads the submitted document to the backend, which is responsible for
 * relaying it to the configured KYC provider.
 */

export async function getKycStatus(): Promise<KycStatusResponse> {
  if (IS_DEMO_MODE) return mockDelay(MOCK_KYC_STATUS);
  return apiFetch<KycStatusResponse>("/kyc/status");
}

export async function submitDocument(documentType: string, file: File): Promise<void> {
  if (IS_DEMO_MODE) return mockDelay(undefined, 800);
  const formData = new FormData();
  formData.append("documentType", documentType);
  formData.append("file", file);
  await apiFetchForm<void>("/kyc/documents", formData);
}
