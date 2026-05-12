/** Core domain types for Tuskbase */

export interface Memory {
  id: string;
  content: string;
  sourceUrl: string;
  sourceDomain: string;
  timestamp: string;
  blobId: string;
  snapshotBlobId: string;
  contentHash: string;
  txDigest: string;
  trustScore: number;
  /** Session ID — groups memories by research query */
  sessionId: string;
}

/** A research session — one user query = one session */
export interface ResearchSession {
  id: string;
  query: string;
  timestamp: string;
  memoryCount: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  memories?: Memory[];
  timestamp: string;
  /** Links chat message to a research session */
  sessionId?: string;
}

export interface TrustLabel {
  label: string;
  color: string;
}

export interface VerificationStep {
  id: string;
  label: string;
  detail: string;
  status: "pass" | "fail" | "pending";
  icon: string;
}

export interface VerificationResult {
  isVerified: boolean;
  steps: VerificationStep[];
  memory: Memory;
}
