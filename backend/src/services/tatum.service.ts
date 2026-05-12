/**
 * Tatum Service — handles Sui blockchain interactions via Tatum RPC Gateway.
 * Uses @mysten/sui SDK with Tatum as the RPC endpoint for transaction building,
 * signing, and execution.
 *
 * This demonstrates Tatum MCP's `gateway_execute_rpc` capability — all Sui
 * JSON-RPC calls are routed through Tatum's infrastructure.
 */

import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { env } from "../config/env.js";

interface TransactionResult {
  digest: string;
  status: "success" | "failure";
}

export class TatumService {
  private client: SuiJsonRpcClient;
  private rpcUrl: string;
  private apiKey: string;

  constructor() {
    this.rpcUrl = env.TATUM_SUI_RPC;
    this.apiKey = env.TATUM_API_KEY;

    // Use Tatum RPC Gateway as the Sui client endpoint
    this.client = new SuiJsonRpcClient({
      url: this.rpcUrl,
      network: env.SUI_NETWORK,
    });
  }

  /**
   * Execute a raw JSON-RPC call to Sui via Tatum Gateway.
   * Equivalent to Tatum MCP's `gateway_execute_rpc` tool.
   */
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

  /**
   * Store a memory on-chain by calling tuskbase::memory::store.
   * Builds a programmable transaction, signs it, and executes via Tatum RPC.
   */
  async storeMemoryOnChain(params: {
    knowledgeBaseId: string;
    blobId: string;
    snapshotBlobId: string;
    sourceUrl: string;
    sourceDomain: string;
    contentHash: string;
    trustScore: number;
  }): Promise<TransactionResult> {
    const packageId = env.TUSKBASE_PACKAGE_ID;

    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::memory::store`,
      arguments: [
        tx.object(params.knowledgeBaseId),
        tx.pure.string(params.blobId),
        tx.pure.string(params.snapshotBlobId),
        tx.pure.string(params.sourceUrl),
        tx.pure.string(params.sourceDomain),
        tx.pure.string(params.contentHash),
        tx.pure.u8(params.trustScore),
        tx.object("0x6"), // Sui Clock shared object
      ],
    });

    return this.signAndExecute(tx);
  }

  /**
   * Create a knowledge base on-chain.
   */
  async createKnowledgeBase(params: {
    name: string;
    description: string;
  }): Promise<TransactionResult> {
    const packageId = env.TUSKBASE_PACKAGE_ID;

    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::knowledge_base::create`,
      arguments: [
        tx.pure.string(params.name),
        tx.pure.string(params.description),
        tx.object("0x6"), // Sui Clock shared object
      ],
    });

    return this.signAndExecute(tx);
  }

  /**
   * Publish a knowledge base (make it public).
   */
  async publishKnowledgeBase(params: {
    knowledgeBaseId: string;
  }): Promise<TransactionResult> {
    const packageId = env.TUSKBASE_PACKAGE_ID;

    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::knowledge_base::publish`,
      arguments: [tx.object(params.knowledgeBaseId)],
    });

    return this.signAndExecute(tx);
  }

  /**
   * Sign and execute a transaction via Tatum RPC Gateway.
   * Uses the configured sender keypair for signing.
   */
  private async signAndExecute(tx: Transaction): Promise<TransactionResult> {
    try {
      // Derive keypair from the sender address's private key
      // In production, this would use a secure key management solution
      const keypair = this.getKeypair();

      const result = await this.client.signAndExecuteTransaction({
        signer: keypair,
        transaction: tx,
      });

      // Wait for transaction confirmation
      const txResponse = await this.client.waitForTransaction({
        digest: result.digest,
        options: { showEffects: true },
      });

      const status = txResponse.effects?.status?.status === "success"
        ? "success" as const
        : "failure" as const;

      return { digest: result.digest, status };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Transaction execution failed: ${message}`);
    }
  }

  /**
   * Get the Ed25519 keypair for signing transactions.
   * Uses SUI_SENDER_ADDRESS as a private key (hex) for the backend wallet.
   */
  private getKeypair(): Ed25519Keypair {
    const privateKey = env.SUI_PRIVATE_KEY;
    if (!privateKey || privateKey === "0x0") {
      throw new Error("SUI_PRIVATE_KEY not configured — cannot sign transactions");
    }
    return Ed25519Keypair.fromSecretKey(privateKey);
  }

  /** Get an object by ID from Sui via Tatum */
  async getObject(objectId: string): Promise<unknown> {
    return this.rpc("sui_getObject", [
      objectId,
      { showContent: true, showOwner: true },
    ]);
  }

  /** Get transaction details by digest via Tatum */
  async getTransaction(digest: string): Promise<unknown> {
    return this.rpc("sui_getTransactionBlock", [
      digest,
      { showEffects: true, showEvents: true },
    ]);
  }

  /** Query events by package and module via Tatum */
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

  /** Query memory events for a specific knowledge base */
  async getMemoryEvents(knowledgeBaseId?: string, limit = 20): Promise<unknown[]> {
    const packageId = env.TUSKBASE_PACKAGE_ID;
    const events = await this.queryEvents(packageId, "memory", "MemoryStored", limit);

    if (knowledgeBaseId) {
      return events.filter((e: unknown) => {
        const event = e as { parsedJson?: { kb_id: string } };
        return event.parsedJson?.kb_id === knowledgeBaseId;
      });
    }

    return events;
  }

  /** Verify a transaction exists and was successful via Tatum */
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

  /** Get the current Sui network info via Tatum */
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
