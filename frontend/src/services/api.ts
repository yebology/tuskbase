/**
 * API Client — handles all communication with the Tuskbase backend.
 * Currently prepared but not called — hooks still use mock data.
 * Switch USE_MOCK_DATA to false when backend is ready.
 */

import type { Memory, VerificationResult } from "@/types";

/** Toggle this to switch between mock data and real API */
export const USE_MOCK_DATA = true;

/** Base URL for the backend API */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// ============================================================
// Types matching backend response shapes
// ============================================================

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

interface ResearchResponse {
  memories: ApiMemory[];
  summary: string;
}

interface RecallResponse {
  memories: Array<{
    content: string;
    relevanceScore: number;
    blobId?: string;
  }>;
  total: number;
}

interface VerifyResponse {
  isValid: boolean;
  blobExists: boolean;
  hashMatches: boolean;
  onChainRecordExists: boolean;
  snapshotExists: boolean;
}

interface HealthResponse {
  status: string;
  timestamp: string;
  services: {
    memwal: "connected" | "disconnected";
    walrus: "connected" | "disconnected";
    tatum: "connected" | "disconnected";
  };
}

/** Backend memory shape (slightly different from frontend Memory type) */
interface ApiMemory {
  id: string;
  content: string;
  sourceUrl: string;
  sourceDomain: string;
  blobId: string;
  snapshotBlobId: string;
  contentHash: string;
  txDigest: string;
  trustScore: number;
  timestamp: string;
  memwalBlobId?: string;
}

// ============================================================
// HTTP helpers
// ============================================================

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      body.message ?? body.error ?? `Request failed: ${response.statusText}`
    );
  }

  return response.json();
}

// ============================================================
// API methods
// ============================================================

/**
 * Execute a research query — searches web, extracts facts, stores on Walrus.
 */
export async function research(
  query: string,
  knowledgeBaseId?: string
): Promise<ResearchResponse> {
  const res = await request<ApiResponse<ResearchResponse>>("/api/research", {
    method: "POST",
    body: JSON.stringify({ query, knowledgeBaseId }),
  });
  return res.data;
}

/**
 * Recall relevant memories by semantic search via MemWal.
 */
export async function recallMemories(
  query: string,
  limit = 10
): Promise<RecallResponse> {
  const res = await request<ApiResponse<RecallResponse>>("/api/memory/recall", {
    method: "POST",
    body: JSON.stringify({ query, limit }),
  });
  return res.data;
}

/**
 * Verify a memory's on-chain provenance — checks Walrus + Sui.
 */
export async function verifyMemory(memory: Memory): Promise<VerifyResponse> {
  const res = await request<ApiResponse<VerifyResponse>>("/api/memory/verify", {
    method: "POST",
    body: JSON.stringify({
      blobId: memory.blobId,
      expectedHash: memory.contentHash,
      txDigest: memory.txDigest,
      snapshotBlobId: memory.snapshotBlobId,
    }),
  });
  return res.data;
}

/**
 * Check backend health and service connectivity.
 */
export async function checkHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/api/health");
}

// ============================================================
// Mappers — convert API responses to frontend types
// ============================================================

/** Convert backend ApiMemory to frontend Memory type */
export function mapApiMemoryToMemory(apiMemory: ApiMemory, sessionId?: string): Memory {
  return {
    id: apiMemory.id,
    content: apiMemory.content,
    sourceUrl: apiMemory.sourceUrl,
    sourceDomain: apiMemory.sourceDomain,
    timestamp: apiMemory.timestamp,
    blobId: apiMemory.blobId,
    snapshotBlobId: apiMemory.snapshotBlobId,
    contentHash: apiMemory.contentHash,
    txDigest: apiMemory.txDigest,
    trustScore: apiMemory.trustScore,
    sessionId: sessionId ?? "unknown",
  };
}

/** Convert verify response to frontend VerificationResult */
export function mapVerifyResponse(
  response: VerifyResponse,
  memory: Memory
): VerificationResult {
  return {
    isVerified: response.isValid,
    steps: [
      {
        id: "walrus",
        label: "Walrus Storage",
        detail: `Blob ${response.blobExists ? "found" : "not found"}: ${memory.blobId.slice(0, 16)}...`,
        status: response.blobExists ? "pass" : "fail",
        icon: "database",
      },
      {
        id: "hash",
        label: "Content Hash Match",
        detail: `SHA-256: ${memory.contentHash.slice(0, 16)}...`,
        status: response.hashMatches ? "pass" : "fail",
        icon: "file",
      },
      {
        id: "onchain",
        label: "On-Chain Record",
        detail: `Sui Tx: ${memory.txDigest.slice(0, 16)}...`,
        status: response.onChainRecordExists ? "pass" : "fail",
        icon: "shield",
      },
      {
        id: "snapshot",
        label: "Source Snapshot",
        detail: `Snapshot: ${memory.snapshotBlobId.slice(0, 16)}...`,
        status: response.snapshotExists ? "pass" : "fail",
        icon: "link",
      },
    ],
    memory,
  };
}
