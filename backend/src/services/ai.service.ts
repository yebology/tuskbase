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
  private model: string;

  constructor() {
    this.client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      baseURL: env.OPENAI_BASE_URL,
    });
    this.model = env.OPENAI_MODEL;
  }

  /** Detect user intent — is this a web research query or a blockchain query? */
  async detectIntent(query: string): Promise<QueryIntent> {
    const response = await this.client.chat.completions.create({
      model: this.model,
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

  /** Summarize a research source into key facts with trust scores */
  async extractFacts(content: string, sourceUrl: string): Promise<Array<{ fact: string; trustScore: number }>> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "system",
          content: `You are a research assistant. Extract 1-3 key factual claims from the given content.

For each fact, also rate the source trustworthiness (1-10):
- 10: Government, academic institutions
- 8-9: Official protocol docs, established research platforms
- 7: Major exchanges, reputable news, well-known platforms
- 5-6: Blogs, medium articles, general tech sites
- 3-4: Social media, forums, anonymous sources

Return a JSON object: {"facts": [{"fact": "...", "trustScore": N}, ...]}`,
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
      if (Array.isArray(parsed.facts)) {
        return parsed.facts.map((f: any) => ({
          fact: typeof f === "string" ? f : f.fact ?? "",
          trustScore: typeof f === "string" ? 5 : Math.min(10, Math.max(1, f.trustScore ?? 5)),
        }));
      }
      return [];
    } catch {
      return [];
    }
  }

  /** Generate a research summary from multiple findings */
  async summarize(facts: string[], query: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "system",
          content: `You are a research assistant. Create a well-formatted markdown summary.

FORMAT RULES (strict):
- Start with a one-sentence overview paragraph
- Use ## for section headings (with relevant emoji prefix, e.g. ## 🔍 Key Findings)
- Use bullet points (- ) for lists
- Use numbered lists (1. 2. 3.) for sequential/ranked items
- Use **bold** for key terms
- Use \`code\` for specific numbers, values, or technical terms (e.g. \`$1.5B\`, \`300K TPS\`)
- Use > blockquote for important highlights or conclusions
- Use markdown tables (| col | col |) when comparing data or listing 2+ items with multiple attributes
- Use emoji to highlight key points (🔑 ⚡ 📊 🔗 💡 🏗️ etc.)
- Keep paragraphs short (2-3 sentences max)
- End with > 💡 **Key Takeaway:** followed by one sentence
- Total length: 150-300 words
- DO NOT use plain text without formatting
- ALWAYS leave a blank line between headings, paragraphs, lists, tables, and blockquotes`,
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
      model: this.model,
      messages: [
        {
          role: "system",
          content: `You format blockchain data into visually appealing markdown responses.

FORMAT RULES:
- Use ## heading with emoji (e.g. ## 💰 SUI Price)
- Use \`code\` for numbers and values (e.g. \`$0.91\`)
- Use **bold** for labels
- Use tables if multiple data points
- Use > blockquote for key insight
- Add relevant emoji throughout
- Keep it concise (3-5 lines max)
- Make it look professional and clean`,
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
