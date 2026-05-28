/**
 * Tatum MCP Service — wraps Tatum's blockchain MCP tools as AI agent capabilities.
 * Endpoints sourced from: https://github.com/tatumio/blockchain-mcp/blob/main/src/services/data.ts
 */

import { TatumApiClient } from "@tatumio/blockchain-mcp/dist/api-client.js";
import type { TatumApiResponse } from "@tatumio/blockchain-mcp/dist/types.js";
import { env } from "../config/env.js";

const TATUM_BASE_URL = "https://api.tatum.io";

export class TatumMcpService {
  private client: TatumApiClient;

  constructor() {
    this.client = new TatumApiClient({
      apiKey: env.TATUM_API_KEY,
      baseUrl: TATUM_BASE_URL,
      timeout: 30000,
      retryAttempts: 2,
    });
  }

  /** Get current exchange rate — /v3/tatum/rate/{symbol} */
  async getExchangeRate(symbol = "SUI", basePair = "USD"): Promise<TatumApiResponse> {
    return this.client.executeRequest("GET", `/v3/tatum/rate/${symbol}`, {
      basePair,
    });
  }

  /** Get wallet portfolio — /v4/data/wallet/portfolio */
  async getWalletPortfolio(address: string): Promise<TatumApiResponse> {
    return this.client.executeRequest("GET", `/v4/data/wallet/portfolio`, {
      chain: "sui-mainnet",
      addresses: address,
      tokenTypes: "native",
    });
  }

  /** Get transaction history — /v4/data/transactions */
  async getTransactionHistory(address: string, limit = 10): Promise<TatumApiResponse> {
    return this.client.executeRequest("GET", `/v4/data/transactions`, {
      chain: "sui-mainnet",
      addresses: address,
      pageSize: String(limit),
    });
  }

  /** Check if address is malicious — /v3/security/address/{address} */
  async checkMaliciousAddress(address: string): Promise<TatumApiResponse> {
    return this.client.executeRequest("GET", `/v3/security/address/${address}`, {});
  }
}
