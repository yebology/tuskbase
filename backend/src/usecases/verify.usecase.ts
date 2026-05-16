/**
 * Verify Use Case — verifies memory authenticity on-chain.
 * Checks: blob exists on Walrus, hash matches, on-chain record exists.
 * Uses Tatum MCP Data API for enriched transaction verification.
 */

import type { WalrusService } from "../services/walrus.service.js";
import type { ProvenanceService } from "../services/provenance.service.js";
import type { TatumService } from "../services/tatum.service.js";
import type { TatumMcpService } from "../services/tatum-mcp.service.js";
import type { VerificationResult } from "../types/index.js";

interface Dependencies {
  walrus: WalrusService;
  provenance: ProvenanceService;
  tatum: TatumService;
  tatumMcp: TatumMcpService;
}

export class VerifyUseCase {
  private deps: Dependencies;

  constructor(deps: Dependencies) {
    this.deps = deps;
  }

  /** Verify a memory's authenticity by checking all provenance layers */
  async execute(
    blobId: string,
    expectedHash: string,
    txDigest: string,
    snapshotBlobId: string
  ): Promise<VerificationResult> {
    const { walrus, provenance, tatum, tatumMcp } = this.deps;

    // 1. Check blob exists on Walrus
    const blobExists = await walrus.exists(blobId);

    // 2. Retrieve content and verify hash
    let hashMatches = false;
    if (blobExists) {
      try {
        const content = await walrus.retrieve(blobId);
        hashMatches = provenance.verifyIntegrity(
          content.toString("utf-8"),
          expectedHash
        );
      } catch {
        hashMatches = false;
      }
    }

    // 3. Verify on-chain transaction via Tatum RPC
    let onChainRecordExists = false;
    if (txDigest && !txDigest.startsWith("no_kb") && !txDigest.startsWith("on_chain")) {
      onChainRecordExists = await tatum.verifyTransaction(txDigest);
    }

    // 4. Check snapshot blob exists on Walrus
    const snapshotExists = await walrus.exists(snapshotBlobId);

    // 5. Enrich with Tatum MCP Data API — get SUI exchange rate for context
    let suiPriceUsd: number | null = null;
    try {
      const rateResult = await tatumMcp.getExchangeRate();
      if (rateResult.data?.value) {
        suiPriceUsd = Number(rateResult.data.value);
      }
    } catch {
      // Non-critical — don't fail verification if rate fetch fails
    }

    return {
      isValid: blobExists && hashMatches && onChainRecordExists && snapshotExists,
      blobExists,
      hashMatches,
      onChainRecordExists,
      snapshotExists,
      suiPriceUsd,
    };
  }
}
