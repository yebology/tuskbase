import { z } from "zod";
import "dotenv/config";

/** Environment variable schema — validates all required config at startup */
const envSchema = z.object({
  PORT: z.coerce.number().default(8000),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1),

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
