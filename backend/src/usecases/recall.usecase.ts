/**
 * Recall Use Case — retrieves relevant memories via semantic search.
 * Queries MemWal SDK and returns results with relevance scores.
 */

import type { MemwalService } from "../services/memwal.service.js";

interface RecallResult {
  memories: Array<{
    content: string;
    relevanceScore: number;
    blobId?: string;
  }>;
  total: number;
}

interface Dependencies {
  memwal: MemwalService;
}

export class RecallUseCase {
  private deps: Dependencies;

  constructor(deps: Dependencies) {
    this.deps = deps;
  }

  /** Recall memories relevant to a query via MemWal semantic search */
  async execute(query: string, limit = 10): Promise<RecallResult> {
    const { memwal } = this.deps;

    const result = await memwal.recall(query, limit);

    return {
      memories: result.results.map((r) => ({
        content: r.content,
        relevanceScore: r.score,
        blobId: r.blobId,
      })),
      total: result.total,
    };
  }
}
