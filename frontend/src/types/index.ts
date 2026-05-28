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

/** Research report metadata — returned after deep research */
export interface ResearchReport {
  /** Walrus blob ID of the PDF report */
  reportBlobId: string;
  /** SHA-256 hash of the PDF */
  reportHash: string;
  /** Sui transaction digest */
  txDigest: string;
  /** Number of sources analyzed */
  sourceCount: number;
  /** Number of facts extracted */
  factCount: number;
  /** Direct download URL for the PDF */
  reportUrl: string;
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
  /** Research report attached to this message */
  report?: ResearchReport;
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
