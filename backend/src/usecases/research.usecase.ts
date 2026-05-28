/**
 * Research Use Case — orchestrates the full research flow.
 * Search → Extract → Store (parallel) → Summarize.
 *
 * Walrus + MemWal calls are parallelized per source for speed.
 */

import type { SearchService } from "../services/search.service.js";
import type { AIService } from "../services/ai.service.js";
import type { WalrusService } from "../services/walrus.service.js";
import type { MemwalService } from "../services/memwal.service.js";
import type { ProvenanceService } from "../services/provenance.service.js";
import type { TatumService } from "../services/tatum.service.js";
import type { ResearchResult, StoredMemory } from "../types/index.js";
import { env } from "../config/env.js";

interface Dependencies {
  search: SearchService;
  ai: AIService;
  walrus: WalrusService;
  memwal: MemwalService;
  provenance: ProvenanceService;
  tatum: TatumService;
}

export class ResearchUseCase {
  private deps: Dependencies;

  constructor(deps: Dependencies) {
    this.deps = deps;
  }

  /** Execute a full research flow for a given query */
  async execute(query: string, knowledgeBaseId?: string): Promise<ResearchResult> {
    const { search, ai, walrus, memwal, provenance, tatum } = this.deps;

    // Use provided KB ID, fall back to env default for on-chain storage
    const effectiveKbId = knowledgeBaseId || env.DEFAULT_KNOWLEDGE_BASE_ID || undefined;

    // 1. Search the web for relevant sources
    console.log("[Research] Searching web...");
    const searchResults = await search.search(query);
    console.log(`[Research] Found ${searchResults.length} sources`);

    // 2. Process all sources in parallel
    const sourcePromises = searchResults.map(async (result) => {
      // 2a. Extract facts + store snapshot in parallel
      const [factsWithScores, snapshot] = await Promise.all([
        ai.extractFacts(result.content, result.url),
        walrus.store(result.content),
      ]);

      console.log(`[Research] ${result.domain}: ${factsWithScores.length} facts extracted`);

      // 2b. Process all facts from this source in parallel
      const factPromises = factsWithScores.map(async ({ fact, trustScore }): Promise<StoredMemory> => {
        const meta = provenance.buildMetadata(result.url, fact, snapshot.blobId);
        // Override hardcoded trust score with AI-decided score
        meta.trustScore = trustScore;

        // Store fact on Walrus + MemWal in parallel
        const [blob, memwalResult] = await Promise.all([
          walrus.store(fact),
          memwal.remember(fact),
        ]);

        const txDigest = effectiveKbId
          ? await this.tryStoreOnChain(effectiveKbId, blob.blobId, meta)
          : blob.txDigest ?? `walrus:${blob.blobId}`;

        return {
          id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          content: fact,
          sourceUrl: meta.sourceUrl,
          sourceDomain: meta.sourceDomain,
          blobId: blob.blobId,
          snapshotBlobId: meta.snapshotBlobId,
          contentHash: meta.contentHash,
          txDigest,
          trustScore: meta.trustScore,
          timestamp: meta.timestamp,
          memwalBlobId: memwalResult.blobId,
        };
      });

      return Promise.all(factPromises);
    });

    const nestedMemories = await Promise.all(sourcePromises);
    const memories = nestedMemories.flat();

    console.log(`[Research] Total: ${memories.length} memories stored`);

    // 3. Generate summary from all facts
    const allFacts = memories.map((m) => m.content);
    const summary = allFacts.length > 0
      ? await ai.summarize(allFacts, query)
      : "No relevant facts found for this query.";

    return { memories, summary };
  }

  /** Try to record on-chain — non-blocking, returns digest or fallback */
  private async tryStoreOnChain(
    knowledgeBaseId: string,
    blobId: string,
    meta: { snapshotBlobId: string; sourceUrl: string; sourceDomain: string; contentHash: string; trustScore: number }
  ): Promise<string> {
    try {
      const txResult = await this.deps.tatum.storeMemoryOnChain({
        knowledgeBaseId,
        blobId,
        snapshotBlobId: meta.snapshotBlobId,
        sourceUrl: meta.sourceUrl,
        sourceDomain: meta.sourceDomain,
        contentHash: meta.contentHash,
        trustScore: meta.trustScore,
      });
      return txResult.digest;
    } catch (error) {
      console.error("[Research] On-chain failed:", error instanceof Error ? error.message : error);
      return "on_chain_failed";
    }
  }
}
