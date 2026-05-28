/**
 * Provenance Service — handles content hashing, trust scoring, and verification.
 * Pure business logic — no external dependencies.
 */

import { createHash } from "crypto";
import {
  HIGH_TRUST_DOMAINS,
  MEDIUM_TRUST_DOMAINS,
} from "../config/constants.js";
import type { ProvenanceMetadata } from "../types/index.js";

export class ProvenanceService {
  /** Compute SHA-256 hash of content for integrity verification */
  computeHash(content: string): string {
    return createHash("sha256").update(content, "utf-8").digest("hex");
  }

  /** Calculate trust score (1-10) — AI-assisted based on domain reputation */
  calculateTrustScore(domain: string): number {
    // Tier 1: Government and academic (10)
    if (domain.endsWith(".gov") || domain.endsWith(".edu")) return 10;

    // Tier 2: Official protocol docs (9)
    if (
      domain.includes("docs.") ||
      HIGH_TRUST_DOMAINS.some((d) => domain.includes(d))
    ) return 9;

    // Tier 3: Known crypto/tech platforms (7-8)
    if (MEDIUM_TRUST_DOMAINS.some((d) => domain.includes(d))) return 8;
    if (domain.endsWith(".org")) return 7;

    // Tier 4: Exchanges, news, established platforms (6-7)
    if (
      domain.includes("binance") ||
      domain.includes("coinbase") ||
      domain.includes("bitget") ||
      domain.includes("kraken") ||
      domain.includes("nansen") ||
      domain.includes("messari") ||
      domain.includes("coingecko") ||
      domain.includes("coinmarketcap")
    ) return 7;

    // Tier 5: General tech content (6)
    if (
      domain.includes("medium.com") ||
      domain.includes("dev.to") ||
      domain.includes("blog") ||
      domain.includes("learn.")
    ) return 6;

    // Tier 6: Social / user-generated (4)
    if (
      domain.includes("reddit.com") ||
      domain.includes("twitter.com") ||
      domain.includes("x.com")
    ) return 4;

    // Default
    return 5;
  }

  /** Build provenance metadata for a memory */
  buildMetadata(
    sourceUrl: string,
    content: string,
    snapshotBlobId: string
  ): ProvenanceMetadata {
    let domain: string;
    try {
      domain = new URL(sourceUrl).hostname;
    } catch {
      domain = "unknown";
    }
    return {
      sourceUrl,
      sourceDomain: domain,
      contentHash: this.computeHash(content),
      snapshotBlobId,
      trustScore: this.calculateTrustScore(domain),
      timestamp: new Date().toISOString(),
    };
  }

  /** Verify content integrity by comparing hash */
  verifyIntegrity(content: string, expectedHash: string): boolean {
    return this.computeHash(content) === expectedHash;
  }
}
