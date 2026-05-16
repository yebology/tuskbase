/**
 * dApp Kit instance — configures Sui wallet connection for the app.
 */

import { createDAppKit } from "@mysten/dapp-kit-react";
import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";

const RPC_URLS = {
  devnet: "https://fullnode.devnet.sui.io:443",
} as const;

export const dAppKit = createDAppKit({
  networks: ["devnet"],
  createClient: (network) =>
    new SuiJsonRpcClient({ url: RPC_URLS[network], network }),
});

// Register types for hook type inference
declare module "@mysten/dapp-kit-react" {
  interface Register {
    dAppKit: typeof dAppKit;
  }
}
