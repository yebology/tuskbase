import { z } from "zod";
import "dotenv/config";

/** Environment variable schema — validates all required config at startup */
const envSchema = z.object({
  PORT: z.coerce.number().default(8000),

  // Database
  DATABASE_URL: z.string().url().default("postgresql://postgres:postgres@localhost:5432/tuskbase"),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_BASE_URL: z.string().url().default("https://api.openai.com/v1"),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),

  // MemWal
  MEMWAL_PRIVATE_KEY: z.string().min(1),
  MEMWAL_ACCOUNT_ID: z.string().min(1),
  MEMWAL_RELAYER_URL: z.string().url().default("https://relayer.memwal.ai"),
  MEMWAL_NAMESPACE: z.string().default("tuskbase"),

  // Walrus
  WALRUS_PUBLISHER_URL: z
    .string()
    .url()
    .default("https://publisher.walrus.site"),
  WALRUS_AGGREGATOR_URL: z
    .string()
    .url()
    .default("https://aggregator.walrus.site"),

  // Tatum
  TATUM_API_KEY: z.string().min(1),
  TATUM_SUI_RPC: z
    .string()
    .url()
    .default("https://sui-devnet.gateway.tatum.io"),

  // Tavily
  TAVILY_API_KEY: z.string().min(1),

  // Sui
  SUI_NETWORK: z.enum(["mainnet", "testnet", "devnet"]).default("devnet"),
  TUSKBASE_PACKAGE_ID: z.string().default("0x0"),
  SUI_PRIVATE_KEY: z.string().default("0x0"),
  DEFAULT_KNOWLEDGE_BASE_ID: z.string().default(""),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    console.error(result.error.format());
    process.exit(1);
  }
  return result.data;
}

export const env = loadEnv();
