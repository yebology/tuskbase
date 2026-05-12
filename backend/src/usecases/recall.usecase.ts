/**
 * Recall Use Case — retrieves relevant memories via semantic search.
 * Queries MemWal and enriches results with on-chain metadata.
 */

import type { MemwalService } from "../services/memwal.service.js";

interface RecallResult {
  memories: Array<{
    content: string;
    relevanceScore: number;
  }>;
}

interface Dependencies {
  memwal: MemwalService;
}

export class RecallUseCase {
  private deps: Dependencies;

  constructor(deps: Dependencies) {
    this.deps = deps;
  }

  /** Recall memories relevant to a query */
  async execute(query: string, limit = 10): Promise<RecallResult> {
    const { memwal } = this.deps;

    const result = await memwal.recall(query, limit);

    return {
      memories: result.results.map((r) => ({
        content: r.content,
        relevanceScore: r.score,
      })),
    };
  }
}
