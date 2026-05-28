/** Application-wide constants */

export const APP_NAME = "Tuskbase";
export const APP_DESCRIPTION = "Verifiable Knowledge Agent";
export const APP_TAGLINE = "AI that doesn't just remember — it proves what it knows.";

/** Trust score thresholds */
export const TRUST_THRESHOLDS = {
  VERY_HIGH: 9,
  HIGH: 7,
  MEDIUM: 5,
  LOW: 3,
} as const;

/** Trust score display config */
export const TRUST_LABELS = {
  VERY_HIGH: { label: "Very High", color: "text-emerald-500" },
  HIGH: { label: "High", color: "text-green-500" },
  MEDIUM: { label: "Medium", color: "text-yellow-500" },
  LOW: { label: "Low", color: "text-orange-500" },
  VERY_LOW: { label: "Very Low", color: "text-red-500" },
} as const;

/** Network configuration */
export const NETWORK = {
  SUI_EXPLORER_BASE: "https://suiscan.xyz/devnet",
  WALRUS_AGGREGATOR: "https://aggregator.walrus.site",
  WALRUS_PUBLISHER: "https://publisher.walrus.site",
  TATUM_SUI_RPC: "https://sui-mainnet.gateway.tatum.io",
  MEMWAL_RELAYER: "https://relayer.memwal.ai",
} as const;

/** UI constants */
export const UI = {
  MAX_CHAT_INPUT_HEIGHT: 128,
  DEFAULT_RECALL_LIMIT: 10,
  HASH_TRUNCATE_CHARS: 12,
  SIMULATED_RESPONSE_DELAY_MS: 2000,
  SIMULATED_VERIFY_DELAY_MS: 1500,
} as const;

/** Navigation items */
export const NAV_ITEMS = [
  { href: "/", label: "Research", icon: "MessageSquare" },
] as const;
