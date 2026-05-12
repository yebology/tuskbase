/** Core domain types for WalrusKnow */

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
  namespace: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  owner: string;
  createdAt: string;
  memoryCount: number;
  isPublic: boolean;
  totalTrustScore: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  memories?: Memory[];
  timestamp: string;
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
