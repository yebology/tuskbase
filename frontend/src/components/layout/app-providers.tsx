"use client";

import dynamic from "next/dynamic";

const WalletProvider = dynamic(
  () =>
    import("@/components/layout/wallet-provider").then(
      (mod) => mod.WalletProvider
    ),
  { ssr: false }
);

/** App-level client providers (wallet, etc.) */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
