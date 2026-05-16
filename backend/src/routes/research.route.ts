/**
 * Research Route — handles research requests from the frontend.
 * Routes queries to either web research or blockchain tools based on AI intent detection.
 */

import { Hono } from "hono";
import { z } from "zod";
import type { ResearchUseCase } from "../usecases/research.usecase.js";
import type { AIService } from "../services/ai.service.js";
import type { TatumMcpService } from "../services/tatum-mcp.service.js";

const researchSchema = z.object({
  query: z.string().min(1).max(500),
  knowledgeBaseId: z.string().optional(),
});

export function createResearchRoute(
  researchUseCase: ResearchUseCase,
  ai: AIService,
  tatumMcp: TatumMcpService
) {
  const route = new Hono();

  route.post("/", async (c) => {
    const body = await c.req.json();
    const parsed = researchSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        { error: "Invalid request", details: parsed.error.format() },
        400
      );
    }

    const { query, knowledgeBaseId } = parsed.data;

    try {
      // 1. Detect intent — is this web research or blockchain query?
      const intent = await ai.detectIntent(query);

      // 2. Route based on intent
      if (intent.type === "web_research") {
        // Standard web research flow
        const result = await researchUseCase.execute(query, knowledgeBaseId);
        return c.json({ success: true, data: result });
      }

      // Blockchain queries via Tatum MCP
      let blockchainData: unknown;
      let context: string;

      switch (intent.type) {
        case "blockchain_price":
          blockchainData = (await tatumMcp.getExchangeRate()).data;
          context = "SUI token exchange rate";
          break;

        case "blockchain_portfolio":
          blockchainData = (
            await tatumMcp.getWalletPortfolio(intent.address)
          ).data;
          context = `Wallet portfolio for ${intent.address}`;
          break;

        case "blockchain_transactions":
          blockchainData = (
            await tatumMcp.getTransactionHistory(intent.address)
          ).data;
          context = `Transaction history for ${intent.address}`;
          break;

        case "blockchain_security":
          blockchainData = (
            await tatumMcp.checkMaliciousAddress(intent.address)
          ).data;
          context = `Security check for ${intent.address}`;
          break;

        default:
          const result = await researchUseCase.execute(query, knowledgeBaseId);
          return c.json({ success: true, data: result });
      }

      // 3. Format blockchain data into readable response via AI
      const summary = await ai.formatBlockchainResponse(
        blockchainData,
        context
      );

      return c.json({
        success: true,
        data: {
          memories: [],
          summary,
          source: "tatum_mcp",
          intent: intent.type,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return c.json({ error: "Research failed", message }, 500);
    }
  });

  return route;
}
