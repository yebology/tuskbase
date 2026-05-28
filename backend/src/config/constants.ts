/** Application constants */

/** Trust score thresholds for source quality */
export const TRUST_SCORE = {
  MIN: 1,
  MAX: 10,
} as const;

/** High-trust domains (score 9-10) */
export const HIGH_TRUST_DOMAINS = [
  "docs.sui.io",
  "docs.wal.app",
  "docs.memwal.ai",
  "tatum.io",
  "arxiv.org",
  "nature.com",
  "science.org",
] as const;

/** Medium-high trust domains (score 7-8) */
export const MEDIUM_TRUST_DOMAINS = [
  "blog.sui.io",
  "blog.walrus.xyz",
  "github.com",
  "defillama.com",
  "messari.io",
] as const;

/** Walrus storage epochs */
export const WALRUS_STORAGE_EPOCHS = 10;

/** Max memories to recall per query */
export const DEFAULT_RECALL_LIMIT = 10;

/** Max search results from Tavily — deep research uses 20 sources */
export const MAX_SEARCH_RESULTS = 20;

/** Max facts to extract per source */
export const MAX_FACTS_PER_SOURCE = 5;
