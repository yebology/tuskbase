"use client";

import { Globe, Lock, Brain, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_KNOWLEDGE_BASES } from "@/services/mock-data";
import { formatTimestamp } from "@/lib/formatters";
import type { KnowledgeBase } from "@/types";

/** Knowledge bases page — manage and publish research collections */
export default function KnowledgePage() {
  return (
    <div className="flex flex-col h-full">
      <KnowledgeHeader />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-w-5xl">
          {MOCK_KNOWLEDGE_BASES.map((kb) => (
            <KnowledgeBaseCard key={kb.id} kb={kb} />
          ))}
          <CreateCard />
        </div>
      </div>
    </div>
  );
}

function KnowledgeHeader() {
  return (
    <header className="border-b border-border px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="font-semibold">Knowledge Bases</h2>
        <p className="text-xs text-muted-foreground">
          Collections of verified research — publish to share with the world
        </p>
      </div>
      <Button size="sm">
        <Plus className="w-4 h-4 mr-1" />
        New Knowledge Base
      </Button>
    </header>
  );
}

function KnowledgeBaseCard({ kb }: { kb: KnowledgeBase }) {
  const avgTrust = (kb.totalTrustScore / kb.memoryCount).toFixed(1);

  return (
    <Card className="hover:border-primary/30 transition-colors cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{kb.name}</CardTitle>
          <VisibilityBadge isPublic={kb.isPublic} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{kb.description}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Brain className="w-3 h-3" />
            <span>{kb.memoryCount} memories</span>
          </div>
          <span>Avg trust: {avgTrust}/10</span>
        </div>

        <p className="text-[10px] text-muted-foreground mt-3">
          Created {formatTimestamp(kb.createdAt)}
        </p>
      </CardContent>
    </Card>
  );
}

function VisibilityBadge({ isPublic }: { isPublic: boolean }) {
  if (isPublic) {
    return (
      <Badge variant="secondary" className="text-[10px] text-emerald-500">
        <Globe className="w-3 h-3 mr-1" />
        Public
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="text-[10px]">
      <Lock className="w-3 h-3 mr-1" />
      Private
    </Badge>
  );
}

function CreateCard() {
  return (
    <Card className="border-dashed flex items-center justify-center min-h-[180px] cursor-pointer hover:border-primary/30 transition-colors">
      <div className="text-center text-muted-foreground">
        <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Create new knowledge base</p>
        <p className="text-[10px]">Start a research session to build one</p>
      </div>
    </Card>
  );
}
