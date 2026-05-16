/** Backend domain types */

export interface ResearchRequest {
  query: string;
  knowledgeBaseId?: string;
}

export interface ResearchResult {
  memories: StoredMemory[];
  summary: string;
}

export interface StoredMemory {
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
  /** Blob ID from MemWal SDK (encrypted memory on Walrus) */
  memwalBlobId?: string;
}

export interface SearchResult {
  title: string;
  url: string;
  content: string;
  domain: string;
}

export interface ProvenanceMetadata {
  sourceUrl: string;
  sourceDomain: string;
  contentHash: string;
  snapshotBlobId: string;
  trustScore: number;
  timestamp: string;
}

export interface VerificationResult {
  isValid: boolean;
  blobExists: boolean;
  hashMatches: boolean;
  onChainRecordExists: boolean;
  snapshotExists: boolean;
  /** Current SUI price in USD (from Tatum MCP Data API) */
  suiPriceUsd: number | null;
}
