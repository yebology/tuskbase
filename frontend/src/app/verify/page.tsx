"use client";

import {
  Shield,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
  Clock,
  Database,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getTrustLabel } from "@/lib/formatters";
import { useVerification, type VerifyStep } from "@/hooks/use-verification";

const STEP_ICONS = {
  database: Database,
  file: FileText,
  shield: Shield,
  clock: Clock,
  link: ExternalLink,
} as const;

/** Verification page — prove memory authenticity on-chain */
export default function VerifyPage() {
  const { memory, steps, isVerifying, isVerified, verify } = useVerification();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verify();
  };

  return (
    <div className="flex flex-col h-full">
      <header className="border-b border-border px-6 py-4">
        <h2 className="font-semibold">Verify Memory</h2>
        <p className="text-xs text-muted-foreground">
          Verify any memory&apos;s authenticity by checking its on-chain
          provenance
        </p>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          <SearchForm
            query={query}
            onChange={setQuery}
            onSubmit={handleSubmit}
            isVerifying={isVerifying}
          />

          <VerificationResultCard
            isVerified={isVerified}
            isVerifying={isVerifying}
            content={memory.content}
            steps={steps}
          />

          <SourceInfoCard
            sourceUrl={memory.sourceUrl}
            sourceDomain={memory.sourceDomain}
            trustScore={memory.trustScore}
          />
        </div>
      </div>
    </div>
  );
}

function SearchForm({
  query,
  onChange,
  onSubmit,
  isVerifying,
}: {
  query: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isVerifying: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2 mb-8">
      <Input
        placeholder="Enter memory ID or Walrus blob ID..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={isVerifying}>
        <Search className="w-4 h-4 mr-1" />
        Verify
      </Button>
    </form>
  );
}

function VerificationResultCard({
  isVerified,
  isVerifying,
  content,
  steps,
}: {
  isVerified: boolean | null;
  isVerifying: boolean;
  content: string;
  steps: VerifyStep[];
}) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Verification Result</CardTitle>
          <StatusBadge isVerified={isVerified} isVerifying={isVerifying} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted rounded-lg p-4 mb-4">
          <p className="text-sm">{content}</p>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Verification Chain</h4>
          {steps.map((step) => (
            <StepRow key={step.id} step={step} />
          ))}
        </div>

        {isVerified === true && <SuccessBanner />}
      </CardContent>
    </Card>
  );
}

function StatusBadge({
  isVerified,
  isVerifying,
}: {
  isVerified: boolean | null;
  isVerifying: boolean;
}) {
  if (isVerifying) return <Badge variant="secondary">Checking...</Badge>;
  if (isVerified === true) {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Verified
      </Badge>
    );
  }
  if (isVerified === false) {
    return (
      <Badge variant="destructive">
        <XCircle className="w-3 h-3 mr-1" />
        Failed
      </Badge>
    );
  }
  return <Badge variant="secondary">Pending</Badge>;
}

function StepRow({ step }: { step: VerifyStep }) {
  const Icon = STEP_ICONS[step.icon];

  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step.status === "pass"
            ? "bg-emerald-500/10 text-emerald-500"
            : step.status === "fail"
              ? "bg-red-500/10 text-red-500"
              : "bg-muted text-muted-foreground"
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{step.label}</p>
        <p className="text-xs text-muted-foreground font-mono">{step.detail}</p>
      </div>
      {step.status === "pass" && (
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      )}
      {step.status === "fail" && <XCircle className="w-4 h-4 text-red-500" />}
    </div>
  );
}

function SuccessBanner() {
  return (
    <>
      <Separator className="my-4" />
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span className="font-medium text-sm text-emerald-500">
            Memory is authentic and unmodified
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Content hash matches on-chain record. Source snapshot is available on
          Walrus. Timestamp is verified via Sui blockchain clock.
        </p>
      </div>
    </>
  );
}

function SourceInfoCard({
  sourceUrl,
  sourceDomain,
  trustScore,
}: {
  sourceUrl: string;
  sourceDomain: string;
  trustScore: number;
}) {
  const trust = getTrustLabel(trustScore);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">
          Source Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">URL</span>
          <a
            href={sourceUrl}
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {sourceUrl}
          </a>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Domain</span>
          <span>{sourceDomain}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Trust Score</span>
          <span className={trust.color}>
            {trustScore}/10 ({trust.label})
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
