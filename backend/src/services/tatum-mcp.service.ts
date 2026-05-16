/**
 * Tatum MCP Service — wraps Tatum's blockchain MCP tools as AI agent capabilities.
 * Provides blockchain data queries (wallet portfolio, tx history, token info)
 * that the AI agent can use during research to enrich findings with on-chain data.
 *
 * This integrates the @tatumio/blockchain-mcp package's API client directly,
 * giving our AI agent the same capabilities as the Tatum MCP server tools.
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

  /**
   * Get wallet portfolio — equivalent to Tatum MCP's `get_wallet_portfolio` tool.
   * Returns token balances for a Sui address.
   */
  async getWalletPortfolio(address: string): Promise<TatumApiResponse> {
    return this.client.executeRequest("GET", `/v4/data/portfolio`, {
      chain: "sui",
      addresses: address,
    });
  }

  /**
   * Get transaction history — equivalent to Tatum MCP's `get_transaction_history` tool.
   * Returns recent transactions for a Sui address.
   */
  async getTransactionHistory(
    address: string,
    limit = 10
  ): Promise<TatumApiResponse> {
    return this.client.executeRequest("GET", `/v4/data/transactions`, {
      chain: "sui",
      addresses: address,
      limit,
    });
  }

  /**
   * Check if an address is malicious — equivalent to Tatum MCP's `check_malicious_address` tool.
   */
  async checkMaliciousAddress(address: string): Promise<TatumApiResponse> {
    return this.client.executeRequest("GET", `/v4/data/security/address`, {
      chain: "sui",
      address,
    });
  }

  /**
   * Get exchange rate for SUI — equivalent to Tatum MCP's `get_exchange_rate` tool.
   */
  async getExchangeRate(currency = "usd"): Promise<TatumApiResponse> {
    return this.client.executeRequest("GET", `/v4/data/exchange-rate`, {
      chain: "sui",
      currency,
    });
  }

  /**
   * Execute a raw RPC call via Tatum Gateway — equivalent to `gateway_execute_rpc` tool.
   * This is the core MCP tool for direct blockchain interaction.
   */
  async executeRpc(
    method: string,
    params: unknown[] = []
  ): Promise<TatumApiResponse> {
    return this.client.executeRequest("POST", `/v4/blockchain/node/sui`, {
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    });
  }
}
