/**
 * MemWal Service — handles persistent AI memory on Walrus.
 * Stores and recalls memories with semantic search.
 */

import { env } from "../config/env.js";

interface RememberResult {
  jobId: string;
}

interface RecallResult {
  results: Array<{
    content: string;
    score: number;
    metadata?: Record<string, unknown>;
  }>;
}

export class MemwalService {
  private key: string;
  private accountId: string;
  private serverUrl: string;
  private namespace: string;

  constructor() {
    this.key = env.MEMWAL_PRIVATE_KEY;
    this.accountId = env.MEMWAL_ACCOUNT_ID;
    this.serverUrl = env.MEMWAL_RELAYER_URL;
    this.namespace = env.MEMWAL_NAMESPACE;
  }

  /** Store a memory in MemWal */
  async remember(content: string): Promise<RememberResult> {
    // In production, uses @mysten-incubation/memwal SDK:
    // const memwal = MemWal.create({ key, accountId, serverUrl, namespace });
    // return await memwal.remember(content);

    const response = await fetch(`${this.serverUrl}/v1/remember`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.key}`,
      },
      body: JSON.stringify({
        account_id: this.accountId,
        namespace: this.namespace,
        content,
      }),
    });

    if (!response.ok) {
      throw new Error(`MemWal remember failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { jobId: data.job_id };
  }

  /** Recall relevant memories by semantic search */
  async recall(query: string, limit = 10): Promise<RecallResult> {
    const response = await fetch(`${this.serverUrl}/v1/recall`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.key}`,
      },
      body: JSON.stringify({
        account_id: this.accountId,
        namespace: this.namespace,
        query,
        limit,
      }),
    });

    if (!response.ok) {
      throw new Error(`MemWal recall failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /** Check relayer health */
  async health(): Promise<boolean> {
    try {
      const response = await fetch(`${this.serverUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
