/** Backend domain types */

export interface ResearchRequest {
  query: string;
  knowledgeBaseId?: string;
}

export interface ResearchResult {
  /** Short summary for chat display */
  summary: string;
  /** Walrus blob ID of the generated PDF report */
  reportBlobId: string;
  /** SHA-256 hash of the PDF content */
  reportHash: string;
  /** Sui transaction digest for on-chain provenance */
  txDigest: string;
  /** Number of sources analyzed */
  sourceCount: number;
  /** Number of facts extracted */
  factCount: number;
  /** Download URL for the PDF report */
  reportUrl: string;
}

/** Internal representation of extracted facts during research */
export interface ExtractedFact {
  fact: string;
  trustScore: number;
  sourceUrl: string;
  sourceDomain: string;
}

/** Source with extracted facts — intermediate research data */
export interface ProcessedSource {
  title: string;
  url: string;
  domain: string;
  trustScore: number;
  facts: string[];
  snapshotBlobId: string;
}

/** Data structure for PDF report generation */
export interface ReportData {
  query: string;
  generatedAt: string;
  sources: ProcessedSource[];
  facts: ExtractedFact[];
  summary: string;
  analysis: string;
  conclusion: string;
  reportHash?: string;
  txDigest?: string;
  reportBlobId?: string;
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
