/**
 * Tatum Service — handles Sui blockchain interactions via Tatum RPC.
 * Executes transactions, queries on-chain state, and verifies records.
 */

import { env } from "../config/env.js";

interface TransactionResult {
  digest: string;
  status: "success" | "failure";
}

export class TatumService {
  private rpcUrl: string;
  private apiKey: string;

  constructor() {
    this.rpcUrl = env.TATUM_SUI_RPC;
    this.apiKey = env.TATUM_API_KEY;
  }

  /** Execute a JSON-RPC call to Sui via Tatum */
  private async rpc(method: string, params: unknown[]): Promise<unknown> {
    const response = await fetch(this.rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tatum RPC failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`Sui RPC error: ${data.error.message}`);
    }

    return data.result;
  }

  /** Get an object by ID from Sui */
  async getObject(objectId: string): Promise<unknown> {
    return this.rpc("sui_getObject", [
      objectId,
      { showContent: true, showOwner: true },
    ]);
  }

  /** Get transaction details by digest */
  async getTransaction(digest: string): Promise<unknown> {
    return this.rpc("sui_getTransactionBlock", [
      digest,
      { showEffects: true, showEvents: true },
    ]);
  }

  /** Query events by package and module */
  async queryEvents(
    packageId: string,
    module: string,
    eventType: string,
    limit = 10
  ): Promise<unknown[]> {
    const result = await this.rpc("suix_queryEvents", [
      {
        MoveEventType: `${packageId}::${module}::${eventType}`,
      },
      null,
      limit,
      true, // descending
    ]);

    return (result as { data: unknown[] })?.data ?? [];
  }

  /** Verify a transaction exists and was successful */
  async verifyTransaction(digest: string): Promise<boolean> {
    try {
      const tx = (await this.getTransaction(digest)) as {
        effects?: { status?: { status: string } };
      };
      return tx?.effects?.status?.status === "success";
    } catch {
      return false;
    }
  }

  /** Get the current Sui network info */
  async getNetworkInfo(): Promise<{ epoch: string; version: string }> {
    const result = (await this.rpc("sui_getLatestSuiSystemState", [])) as {
      epoch: string;
      systemStateVersion: string;
    };
    return {
      epoch: result.epoch,
      version: result.systemStateVersion,
    };
  }
}
