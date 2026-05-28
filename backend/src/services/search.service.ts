/**
 * Search Service — handles web research via Tavily API.
 * Finds relevant sources for a given research query.
 */

import { env } from "../config/env.js";
import { MAX_SEARCH_RESULTS } from "../config/constants.js";
import type { SearchResult } from "../types/index.js";

export class SearchService {
  private apiKey: string;

  constructor() {
    this.apiKey = env.TAVILY_API_KEY;
  }

  /** Search the web for a given query and return structured results */
  async search(query: string): Promise<SearchResult[]> {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: this.apiKey,
        query,
        max_results: MAX_SEARCH_RESULTS,
        include_answer: false,
        exclude_domains: [
          "youtube.com",
          "twitter.com",
          "x.com",
          "reddit.com",
          "facebook.com",
          "tiktok.com",
          "instagram.com",
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return (data.results ?? [])
      .filter((r: Record<string, string>) => {
        try {
          new URL(r.url);
          return true;
        } catch {
          return false; // Skip results with malformed URLs
        }
      })
      .map((r: Record<string, string>) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        domain: new URL(r.url).hostname,
      }));
  }
}
