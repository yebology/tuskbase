"use client";

import { DAppKitProvider } from "@mysten/dapp-kit-react";
import { dAppKit } from "@/lib/dapp-kit";

/** Client-side wallet provider — wraps children with dApp Kit context */
export function WalletProvider({ children }: { children: React.ReactNode }) {
  return <DAppKitProvider dAppKit={dAppKit}>{children}</DAppKitProvider>;
}
