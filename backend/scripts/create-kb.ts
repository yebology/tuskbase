/**
 * Script to create a Knowledge Base on-chain.
 * Run: npx tsx scripts/create-kb.ts
 *
 * After running, copy the KB object ID and set it as DEFAULT_KNOWLEDGE_BASE_ID in .env
 */

import "dotenv/config";
import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

const PACKAGE_ID = process.env.TUSKBASE_PACKAGE_ID!;
const PRIVATE_KEY = process.env.SUI_PRIVATE_KEY!;
const NETWORK = (process.env.SUI_NETWORK ?? "devnet") as "mainnet" | "testnet" | "devnet";

// Use Sui public RPC for transaction building (Tatum doesn't support all methods)
const PUBLIC_RPC = `https://fullnode.${NETWORK}.sui.io:443`;

async function main() {
  console.log("🦭 Creating Knowledge Base on-chain...");
  console.log(`   Package: ${PACKAGE_ID}`);
  console.log(`   Network: ${NETWORK}`);
  console.log(`   RPC: ${PUBLIC_RPC}`);

  const client = new SuiJsonRpcClient({ url: PUBLIC_RPC, network: NETWORK });
  const keypair = Ed25519Keypair.fromSecretKey(PRIVATE_KEY);
  const sender = keypair.getPublicKey().toSuiAddress();

  console.log(`   Sender: ${sender}`);

  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::knowledge_base::create`,
    arguments: [
      tx.pure.string("Tuskbase Research"),
      tx.pure.string("Default knowledge base for Tuskbase research agent"),
      tx.object("0x6"), // Sui Clock
    ],
  });

  const result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  });

  console.log(`\n✅ Transaction submitted: ${result.digest}`);

  // Wait for confirmation and get created objects
  const txResponse = await client.waitForTransaction({
    digest: result.digest,
    options: { showEffects: true, showObjectChanges: true },
  });

  const status = txResponse.effects?.status?.status;
  console.log(`   Status: ${status}`);

  if (status === "success" && txResponse.objectChanges) {
    const created = txResponse.objectChanges.filter(
      (change) => change.type === "created"
    );
    for (const obj of created) {
      if (obj.type === "created") {
        console.log(`\n📦 Created object:`);
        console.log(`   Object ID: ${obj.objectId}`);
        console.log(`   Type: ${obj.objectType}`);

        if (obj.objectType.includes("KnowledgeBase")) {
          console.log(`\n🎯 Add this to your .env:`);
          console.log(`   DEFAULT_KNOWLEDGE_BASE_ID=${obj.objectId}`);
        }
      }
    }
  } else {
    console.error("❌ Transaction failed:", txResponse.effects?.status);
  }
}

main().catch(console.error);
