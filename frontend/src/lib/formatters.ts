/** Pure formatting utilities — no side effects, no dependencies */

import { TRUST_THRESHOLDS, TRUST_LABELS } from "@/constants";
import type { TrustLabel } from "@/types";

/**
 * Returns a human-readable trust label and color class for a given score.
 * @param score - Trust score from 1-10
 */
export function getTrustLabel(score: number): TrustLabel {
  if (score >= TRUST_THRESHOLDS.VERY_HIGH) return TRUST_LABELS.VERY_HIGH;
  if (score >= TRUST_THRESHOLDS.HIGH) return TRUST_LABELS.HIGH;
  if (score >= TRUST_THRESHOLDS.MEDIUM) return TRUST_LABELS.MEDIUM;
  if (score >= TRUST_THRESHOLDS.LOW) return TRUST_LABELS.LOW;
  return TRUST_LABELS.VERY_LOW;
}

/**
 * Formats an ISO timestamp into a short human-readable string.
 * @param iso - ISO 8601 date string
 */
export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Relative time for recent
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  // Absolute for older
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Truncates a hash/ID string showing first and last N characters.
 * @param hash - Full hash string
 * @param chars - Number of characters to show on each side
 */
export function truncateHash(hash: string, chars = 8): string {
  if (hash.length <= chars * 2 + 3) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

/**
 * Truncates an address for display.
 * @param address - Full Sui address
 */
export function truncateAddress(address: string): string {
  return truncateHash(address, 6);
}

/**
 * Builds a Sui explorer URL for a transaction.
 * @param txDigest - Transaction digest
 */
export function getSuiExplorerTxUrl(txDigest: string): string {
  return `https://suiscan.xyz/mainnet/tx/${txDigest}`;
}

/**
 * Builds a Walrus aggregator URL for a blob.
 * @param blobId - Walrus blob ID
 */
export function getWalrusBlobUrl(blobId: string): string {
  return `https://aggregator.walrus.site/v1/blobs/${blobId}`;
}
