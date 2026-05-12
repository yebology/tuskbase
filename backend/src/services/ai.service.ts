/**
 * AI Service — handles LLM interactions for summarization and fact extraction.
 * Uses OpenAI GPT-4o-mini for cost-effective research summarization.
 */

import OpenAI from "openai";
import { env } from "../config/env.js";

export class AIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
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
}
