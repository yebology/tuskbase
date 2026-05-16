/**
 * AI Service — handles LLM interactions for summarization and fact extraction.
 * Uses OpenAI GPT-4o-mini for cost-effective research summarization.
 */

import OpenAI from "openai";
import { env } from "../config/env.js";

/** Intent types the AI can detect from user queries */
export type QueryIntent =
  | { type: "web_research" }
  | { type: "blockchain_price" }
  | { type: "blockchain_portfolio"; address: string }
  | { type: "blockchain_transactions"; address: string }
  | { type: "blockchain_security"; address: string };

export class AIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }

  /** Detect user intent — is this a web research query or a blockchain query? */
  async detectIntent(query: string): Promise<QueryIntent> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You classify user queries into intents. Return a JSON object with "type" and optionally "address".

Types:
- "web_research" — general research questions (default)
- "blockchain_price" — asking about SUI/crypto price
- "blockchain_portfolio" — asking about wallet balance/tokens (needs address)
- "blockchain_transactions" — asking about transaction history (needs address)
- "blockchain_security" — asking if an address is safe/malicious (needs address)

If the query mentions a Sui address (0x...), extract it into "address".
If unsure, default to "web_research".

Examples:
- "What is Walrus?" → {"type": "web_research"}
- "What's the SUI price?" → {"type": "blockchain_price"}
- "Show balance of 0xabc..." → {"type": "blockchain_portfolio", "address": "0xabc..."}
- "Is 0xabc... safe?" → {"type": "blockchain_security", "address": "0xabc..."}`,
        },
        { role: "user", content: query },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
    });

    const text = response.choices[0]?.message?.content ?? '{"type":"web_research"}';
    try {
      const parsed = JSON.parse(text);
      return parsed as QueryIntent;
    } catch {
      return { type: "web_research" };
    }
  }

  /** Summarize a research source into key facts */
  async extractFacts(content: string, sourceUrl: string): Promise<string[]> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'You are a research assistant. Extract 1-3 key factual claims from the given content. Each fact should be a single, verifiable statement. Return a JSON object with a "facts" key containing an array of strings. Example: {"facts": ["fact 1", "fact 2"]}',
        },
        {
          role: "user",
          content: `Source: ${sourceUrl}\n\nContent:\n${content}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const text = response.choices[0]?.message?.content ?? '{"facts":[]}';
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed.facts) ? parsed.facts : [];
    } catch {
      return [];
    }
  }

  /** Generate a research summary from multiple findings */
  async summarize(facts: string[], query: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a research assistant. Summarize the findings into a clear, structured response. Use markdown formatting. Be concise but comprehensive.",
        },
        {
          role: "user",
          content: `Research query: "${query}"\n\nFindings:\n${facts.map((f, i) => `${i + 1}. ${f}`).join("\n")}`,
        },
      ],
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content ?? "No summary generated.";
  }

  /** Format blockchain data into a readable response */
  async formatBlockchainResponse(data: unknown, context: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Format the given blockchain data into a clear, readable markdown response. Include relevant numbers, addresses (truncated), and context. Be concise.",
        },
        {
          role: "user",
          content: `Context: ${context}\n\nData:\n${JSON.stringify(data, null, 2)}`,
        },
      ],
      temperature: 0.2,
    });

    return response.choices[0]?.message?.content ?? "Could not format blockchain data.";
  }
}
