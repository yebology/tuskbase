import { ExternalLink, Clock, Shield, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  getTrustLabel,
  formatTimestamp,
  truncateHash,
  getSuiExplorerTxUrl,
} from "@/lib/formatters";
import type { Memory } from "@/types";

interface MemoryDetailProps {
  memory: Memory;
}

/** Full memory detail view with provenance and on-chain data */
export function MemoryDetail({ memory }: MemoryDetailProps) {
  const trust = getTrustLabel(memory.trustScore);

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-lg">Memory Detail</h3>
        <a href={`/verify?id=${memory.id}`}>
          <Button variant="outline" size="sm">
            <Shield className="w-3 h-3 mr-1" />
            Verify On-Chain
          </Button>
        </a>
      </div>

      <ContentCard content={memory.content} />
      <ProvenanceCard memory={memory} trust={trust} />
      <OnChainCard memory={memory} />
    </div>
  );
}

function ContentCard({ content }: { content: string }) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{content}</p>
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
              {memory.sourceUrl}
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

function OnChainCard({ memory }: { memory: Memory }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          On-Chain Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <HashRow label="Walrus Blob ID" value={memory.blobId} />
        <Separator />
        <HashRow label="Snapshot Blob ID" value={memory.snapshotBlobId} />
        <Separator />
        <HashRow label="Content Hash (SHA-256)" value={memory.contentHash} />
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Sui Tx Digest</span>
          <a
            href={getSuiExplorerTxUrl(memory.txDigest)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-primary hover:underline"
          >
            {truncateHash(memory.txDigest, 10)}
          </a>
        </div>
      </CardContent>
    </Card>
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

function HashRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
        {truncateHash(value, 12)}
      </code>
    </div>
  );
}
