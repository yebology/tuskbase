"use client";

import { useState, useEffect } from "react";
import {
  ExternalLink,
  Clock,
  Shield,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  getTrustLabel,
  formatTimestamp,
  truncateHash,
  getSuiExplorerTxUrl,
} from "@/lib/formatters";
import { verifyMemory, USE_MOCK_DATA } from "@/services/api";
import { UI } from "@/constants";
import type { Memory } from "@/types";

interface MemoryDetailProps {
  memory: Memory;
}

/** Full memory detail view with provenance and auto-verification */
export function MemoryDetail({ memory }: MemoryDetailProps) {
  const trust = getTrustLabel(memory.trustScore);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  // Auto-verify when memory changes
  useEffect(() => {
    setIsVerifying(true);
    setIsVerified(null);

    if (USE_MOCK_DATA) {
      // Simulated verification
      const timer = setTimeout(() => {
        setIsVerified(true);
        setIsVerifying(false);
      }, UI.SIMULATED_VERIFY_DELAY_MS);
      return () => clearTimeout(timer);
    } else {
      // Real API verification
      verifyMemory(memory)
        .then((result) => {
          setIsVerified(result.isValid);
        })
        .catch(() => {
          setIsVerified(false);
        })
        .finally(() => {
          setIsVerifying(false);
        });
    }
  }, [memory.id]);

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-lg">Memory Detail</h3>
        <VerificationStatus isVerifying={isVerifying} isVerified={isVerified} />
      </div>

      <ContentCard content={memory.content} />
      <ProvenanceCard memory={memory} trust={trust} />
      <OnChainCard memory={memory} isVerifying={isVerifying} isVerified={isVerified} />
    </div>
  );
}

function VerificationStatus({
  isVerifying,
  isVerified,
}: {
  isVerifying: boolean;
  isVerified: boolean | null;
}) {
  if (isVerifying) {
    return (
      <Badge variant="secondary" className="gap-1.5">
        <Loader2 className="w-3 h-3 animate-spin" />
        Verifying...
      </Badge>
    );
  }
  if (isVerified === true) {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1.5">
        <CheckCircle2 className="w-3 h-3" />
        Verified
      </Badge>
    );
  }
  if (isVerified === false) {
    return (
      <Badge variant="destructive" className="gap-1.5">
        <XCircle className="w-3 h-3" />
        Failed
      </Badge>
    );
  }
  return null;
}

function ContentCard({ content }: { content: string }) {
  return (
    <Card className="mb-4 border-primary/20 bg-primary/[0.02]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{content}</p>
      </CardContent>
    </Card>
  );
}

function ProvenanceCard({
  memory,
  trust,
}: {
  memory: Memory;
  trust: { label: string; color: string };
}) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Provenance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <DetailRow
          icon={<ExternalLink className="w-4 h-4 text-muted-foreground" />}
          label="Source"
          value={
            <a
              href={memory.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              {memory.sourceDomain}
            </a>
          }
        />
        <Separator />
        <DetailRow
          icon={<Clock className="w-4 h-4 text-muted-foreground" />}
          label="Stored at"
          value={
            <span className="text-sm font-mono">
              {formatTimestamp(memory.timestamp)}
            </span>
          }
        />
        <Separator />
        <DetailRow
          icon={<Shield className="w-4 h-4 text-muted-foreground" />}
          label="Trust Score"
          value={
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${trust.color}`}>
                {memory.trustScore}/10
              </span>
              <Badge variant="outline" className="text-[10px]">
                {trust.label}
              </Badge>
            </div>
          }
        />
      </CardContent>
    </Card>
  );
}

function OnChainCard({
  memory,
  isVerifying,
  isVerified,
}: {
  memory: Memory;
  isVerifying: boolean;
  isVerified: boolean | null;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          On-Chain Verification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <VerifyRow
            label="Walrus Blob"
            value={memory.blobId}
            isVerifying={isVerifying}
            isVerified={isVerified}
          />
          <Separator />
          <VerifyRow
            label="Content Hash"
            value={memory.contentHash}
            isVerifying={isVerifying}
            isVerified={isVerified}
          />
          <Separator />
          <VerifyRow
            label="Sui Tx"
            value={memory.txDigest}
            isVerifying={isVerifying}
            isVerified={isVerified}
            href={getSuiExplorerTxUrl(memory.txDigest)}
          />
          <Separator />
          <VerifyRow
            label="Snapshot"
            value={memory.snapshotBlobId}
            isVerifying={isVerifying}
            isVerified={isVerified}
          />
        </div>

        {isVerified === true && (
          <>
            <Separator className="my-4" />
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-medium text-sm text-emerald-500">
                  Authentic and unmodified
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Content hash matches on-chain record. Source snapshot available
                on Walrus. Timestamp verified via Sui.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function VerifyRow({
  label,
  value,
  isVerifying,
  isVerified,
  href,
}: {
  label: string;
  value: string;
  isVerifying: boolean;
  isVerified: boolean | null;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-primary hover:underline truncate"
          >
            {truncateHash(value, 12)}
          </a>
        ) : (
          <code className="text-xs font-mono bg-muted px-2 py-1 rounded truncate">
            {truncateHash(value, 12)}
          </code>
        )}
        {isVerifying && (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground shrink-0" />
        )}
        {!isVerifying && isVerified === true && (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        )}
        {!isVerifying && isVerified === false && (
          <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
        )}
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm">
        {icon}
        <span className="text-muted-foreground">{label}</span>
      </div>
      {value}
    </div>
  );
}
