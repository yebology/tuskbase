"use client";

import { useCurrentAccount, useWallets, useDAppKit } from "@mysten/dapp-kit-react";
import { Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { truncateAddress } from "@/lib/formatters";

/** Wallet connect button — compact for sidebar */
export function ConnectWallet() {
  const account = useCurrentAccount();
  const wallets = useWallets();
  const dAppKit = useDAppKit();

  if (account) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-muted text-[11px] flex-1 min-w-0">
          <Wallet className="w-3 h-3 text-primary shrink-0" />
          <span className="font-mono truncate">
            {truncateAddress(account.address)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            try { dAppKit.disconnectWallet(); } catch {}
          }}
          aria-label="Disconnect wallet"
        >
          <LogOut className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  const handleConnect = async () => {
    if (wallets.length === 0) {
      window.open(
        "https://chromewebstore.google.com/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil",
        "_blank"
      );
      return;
    }
    try {
      await dAppKit.connectWallet({ wallet: wallets[0] });
    } catch {
      // User rejected or wallet error — silently ignore
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-xs h-8 gap-1.5"
      onClick={handleConnect}
    >
      <Wallet className="w-3 h-3" />
      Connect Wallet
    </Button>
  );
}
