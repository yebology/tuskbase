/**
 * Research Use Case — orchestrates the full research flow.
 * Search → Summarize → Store on Walrus → Record provenance → Save to MemWal.
 *
 * This is the core business logic that ties all services together.
 */

import type { SearchService } from "../services/search.service.js";
import type { AIService } from "../services/ai.service.js";
import type { WalrusService } from "../services/walrus.service.js";
import type { MemwalService } from "../services/memwal.service.js";
import type { ProvenanceService } from "../services/provenance.service.js";
import type { TatumService } from "../services/tatum.service.js";
import type { ResearchResult, StoredMemory } from "../types/index.js";

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
  async execute(query: string): Promise<ResearchResult> {
    const { search, ai, walrus, memwal, provenance } = this.deps;

    // 1. Search the web for relevant sources
    const searchResults = await search.search(query);

    // 2. Extract facts from each source
    const memories: StoredMemory[] = [];

    for (const result of searchResults) {
      // 2a. Extract key facts via AI
      const facts = await ai.extractFacts(result.content, result.url);

      for (const fact of facts) {
        // 3. Store source snapshot on Walrus
        const snapshot = await walrus.store(result.content);

        // 4. Build provenance metadata
        const meta = provenance.buildMetadata(
          result.url,
          fact,
          snapshot.blobId
        );

        // 5. Store the fact content on Walrus
        const blob = await walrus.store(fact);

        // 6. Save to MemWal for semantic recall
        await memwal.remember(fact);

        // 7. Record on-chain via Tatum (will call smart contract)
        // TODO: Call tuskbase::memory::store via Tatum RPC
        const txDigest = "pending_implementation";

        memories.push({
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
        });
      }
    }

    // 8. Generate summary from all facts
    const allFacts = memories.map((m) => m.content);
    const summary = await ai.summarize(allFacts, query);

    return { memories, summary };
  }
}
