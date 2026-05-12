/**
 * MemWal Service — handles persistent AI memory on Walrus.
 * Uses the official @mysten-incubation/memwal SDK for encrypted,
 * semantic-searchable memory storage on Walrus.
 */

import { MemWal } from "@mysten-incubation/memwal";
import type {
  RememberResult,
  RecallResult as SDKRecallResult,
  AnalyzeWaitResult,
  RestoreResult,
  HealthResult,
} from "@mysten-incubation/memwal";
import { env } from "../config/env.js";

interface MemwalRememberResult {
  jobId: string;
  blobId: string;
}

interface MemwalRecallResult {
  results: Array<{
    content: string;
    score: number;
    blobId: string;
  }>;
  total: number;
}

interface MemwalAnalyzeResult {
  facts: string[];
  succeeded: number;
  failed: number;
}

export class MemwalService {
  private client: ReturnType<typeof MemWal.create>;

  constructor() {
    this.client = MemWal.create({
      key: env.MEMWAL_PRIVATE_KEY,
      accountId: env.MEMWAL_ACCOUNT_ID,
      serverUrl: env.MEMWAL_RELAYER_URL,
      namespace: env.MEMWAL_NAMESPACE,
    });
  }

  /** Store a memory and wait for confirmation */
  async remember(content: string): Promise<MemwalRememberResult> {
    const result: RememberResult = await this.client.rememberAndWait(content);
    return {
      jobId: result.job_id ?? result.id,
      blobId: result.blob_id,
    };
  }

  /** Store a memory without waiting (fire-and-forget) */
  async rememberAsync(content: string): Promise<{ jobId: string }> {
    const job = await this.client.remember(content);
    return { jobId: job.job_id };
  }

  /** Recall relevant memories by semantic search */
  async recall(query: string, limit = 10): Promise<MemwalRecallResult> {
    const result: SDKRecallResult = await this.client.recall(query, limit);
    return {
      results: result.results.map((r) => ({
        content: r.text,
        score: 1 - r.distance, // Convert distance to similarity (lower distance = more similar)
        blobId: r.blob_id,
      })),
      total: result.total,
    };
  }

  /** Extract facts from text and store each as a separate memory */
  async analyze(text: string): Promise<MemwalAnalyzeResult> {
    const result: AnalyzeWaitResult = await this.client.analyzeAndWait(text);
    return {
      facts: result.facts.map((f) => f.text),
      succeeded: result.succeeded,
      failed: result.failed,
    };
  }

  /** Rebuild missing index entries from Walrus */
  async restore(): Promise<{ restored: number; total: number }> {
    const result: RestoreResult = await this.client.restore(env.MEMWAL_NAMESPACE);
    return {
      restored: result.restored,
      total: result.total,
    };
  }

  /** Check relayer health */
  async health(): Promise<boolean> {
    try {
      const result: HealthResult = await this.client.health();
      return result.status === "ok";
    } catch {
      return false;
    }
  }
}
