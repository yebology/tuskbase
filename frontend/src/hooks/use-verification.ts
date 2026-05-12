"use client";

import { useState, useCallback } from "react";
import type { Memory } from "@/types";
import { MOCK_MEMORIES } from "@/services/mock-data";
import { UI } from "@/constants";
import { truncateHash, formatTimestamp } from "@/lib/formatters";

export interface VerifyStep {
  id: string;
  icon: "database" | "file" | "shield" | "clock" | "link";
  label: string;
  detail: string;
  status: "pass" | "fail" | "pending";
}

/**
 * Hook for memory verification flow.
 * Will connect to Walrus + Sui on-chain verification in production.
 */
export function useVerification() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [memory] = useState<Memory>(MOCK_MEMORIES[0]);

  const steps: VerifyStep[] = [
    {
      id: "walrus",
      icon: "database",
      label: "Walrus Storage",
      detail: `Blob exists: ${truncateHash(memory.blobId, 16)}`,
      status: isVerified === true ? "pass" : "pending",
    },
    {
      id: "hash",
      icon: "file",
      label: "Content Hash Match",
      detail: `SHA-256: ${truncateHash(memory.contentHash, 16)}`,
      status: isVerified === true ? "pass" : "pending",
    },
    {
      id: "onchain",
      icon: "shield",
      label: "On-Chain Record",
      detail: `Sui Tx: ${truncateHash(memory.txDigest, 16)}`,
      status: isVerified === true ? "pass" : "pending",
    },
    {
      id: "timestamp",
      icon: "clock",
      label: "Timestamp Verified",
      detail: formatTimestamp(memory.timestamp),
      status: isVerified === true ? "pass" : "pending",
    },
    {
      id: "snapshot",
      icon: "link",
      label: "Source Snapshot",
      detail: `Snapshot blob: ${truncateHash(memory.snapshotBlobId, 16)}`,
      status: isVerified === true ? "pass" : "pending",
    },
  ];

  const verify = useCallback(() => {
    setIsVerifying(true);
    setIsVerified(null);

    // Simulated verification — will check Walrus + Sui on-chain in production
    setTimeout(() => {
      setIsVerified(true);
      setIsVerifying(false);
    }, UI.SIMULATED_VERIFY_DELAY_MS);
  }, []);

  const reset = useCallback(() => {
    setIsVerified(null);
    setIsVerifying(false);
  }, []);

  return {
    memory,
    steps,
    isVerifying,
    isVerified,
    verify,
    reset,
  };
}
