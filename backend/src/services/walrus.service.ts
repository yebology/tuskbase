/**
 * Walrus Service — handles decentralized blob storage.
 * Stores content snapshots and retrieves blobs for verification.
 */

import { env } from "../config/env.js";
import { WALRUS_STORAGE_EPOCHS } from "../config/constants.js";

interface StoreResponse {
  blobId: string;
  txDigest?: string;
}

export class WalrusService {
  private publisherUrl: string;
  private aggregatorUrl: string;

  constructor() {
    this.publisherUrl = env.WALRUS_PUBLISHER_URL;
    this.aggregatorUrl = env.WALRUS_AGGREGATOR_URL;
  }

  /** Store a blob on Walrus and return the blob ID */
  async store(content: string | Buffer): Promise<StoreResponse> {
    const body =
      typeof content === "string" ? Buffer.from(content, "utf-8") : content;

    const response = await fetch(
      `${this.publisherUrl}/v1/blobs?epochs=${WALRUS_STORAGE_EPOCHS}`,
      {
        method: "PUT",
        body,
      }
    );

    if (!response.ok) {
      throw new Error(`Walrus store failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Handle both "newlyCreated" and "alreadyCertified" responses
    if (data.newlyCreated) {
      return {
        blobId: data.newlyCreated.blobObject.blobId,
        txDigest: data.newlyCreated.blobObject.id,
      };
    }

    if (data.alreadyCertified) {
      return {
        blobId: data.alreadyCertified.blobId,
      };
    }

    throw new Error("Unexpected Walrus response format");
  }

  /** Retrieve a blob from Walrus by its ID */
  async retrieve(blobId: string): Promise<Buffer> {
    const response = await fetch(
      `${this.aggregatorUrl}/v1/blobs/${blobId}`
    );

    if (!response.ok) {
      throw new Error(`Walrus retrieve failed: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /** Check if a blob exists on Walrus */
  async exists(blobId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.aggregatorUrl}/v1/blobs/${blobId}`,
        { method: "HEAD" }
      );
      return response.ok;
    } catch {
      return false;
    }
  }
}
