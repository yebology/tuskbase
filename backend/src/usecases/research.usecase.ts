/**
 * Research Use Case — orchestrates the full deep research flow.
 * Search (20 sources) → Extract facts → Store in MemWal → Generate PDF →
 * Store PDF on Walrus → Record on-chain (1 Sui tx) → Return summary + PDF link.
 */

import type { SearchService } from "../services/search.service.js";
import type { AIService } from "../services/ai.service.js";
import type { WalrusService } from "../services/walrus.service.js";
import type { MemwalService } from "../services/memwal.service.js";
import type { ProvenanceService } from "../services/provenance.service.js";
import type { TatumService } from "../services/tatum.service.js";
import type { PdfService } from "../services/pdf.service.js";
import type {
  ResearchResult,
  ExtractedFact,
  ProcessedSource,
  ReportData,
} from "../types/index.js";
import { env } from "../config/env.js";

interface Dependencies {
  search: SearchService;
  ai: AIService;
  walrus: WalrusService;
  memwal: MemwalService;
  provenance: ProvenanceService;
  tatum: TatumService;
  pdf: PdfService;
}

export class ResearchUseCase {
  private deps: Dependencies;

  constructor(deps: Dependencies) {
    this.deps = deps;
  }

  /** Execute a full deep research flow for a given query */
  async execute(query: string, knowledgeBaseId?: string): Promise<ResearchResult> {
    const { search, ai, walrus, memwal, provenance, tatum, pdf } = this.deps;
    const effectiveKbId = knowledgeBaseId || env.DEFAULT_KNOWLEDGE_BASE_ID || undefined;

    // 1. Search the web for relevant sources (20 sources)
    console.log("[Research] Searching web for 20 sources...");
    const searchResults = await search.search(query);
    console.log(`[Research] Found ${searchResults.length} sources`);

    // 2. Process all sources — extract facts + store snapshots
    console.log("[Research] Extracting facts from all sources...");
    const processedSources: ProcessedSource[] = [];
    const allFacts: ExtractedFact[] = [];

    // Process in batches of 5 to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < searchResults.length; i += batchSize) {
      const batch = searchResults.slice(i, i + batchSize);

      const batchResults = await Promise.all(
        batch.map(async (result) => {
          try {
            // Extract facts + store snapshot in parallel
            const [factsWithScores, snapshot] = await Promise.all([
              ai.extractFacts(result.content, result.url),
              walrus.store(result.content),
            ]);

            const facts = factsWithScores.map((f) => f.fact);
            const trustScore =
              factsWithScores.length > 0
                ? Math.round(
                    factsWithScores.reduce((sum, f) => sum + f.trustScore, 0) /
                      factsWithScores.length
                  )
                : provenance.calculateTrustScore(result.domain);

            const source: ProcessedSource = {
              title: result.title,
              url: result.url,
              domain: result.domain,
              trustScore,
              facts,
              snapshotBlobId: snapshot.blobId,
            };

            const extractedFacts: ExtractedFact[] = factsWithScores.map((f) => ({
              fact: f.fact,
              trustScore: f.trustScore,
              sourceUrl: result.url,
              sourceDomain: result.domain,
            }));

            return { source, facts: extractedFacts };
          } catch (error) {
            console.error(
              `[Research] Failed to process ${result.domain}:`,
              error instanceof Error ? error.message : error
            );
            return null;
          }
        })
      );

      for (const result of batchResults) {
        if (result) {
          processedSources.push(result.source);
          allFacts.push(...result.facts);
        }
      }
    }

    console.log(
      `[Research] Processed ${processedSources.length} sources, ${allFacts.length} facts`
    );

    // 3. Store all facts in MemWal for semantic recall (parallel, non-blocking)
    console.log("[Research] Storing facts in MemWal...");
    const memwalPromises = allFacts.map((fact) =>
      memwal.remember(fact.fact).catch((err) => {
        console.error("[Research] MemWal store failed:", err);
        return null;
      })
    );
    await Promise.all(memwalPromises);

    // 4. Generate AI content for the report
    console.log("[Research] Generating report content...");
    const factStrings = allFacts.map((f) => f.fact);

    const [pdfSummary, analysis, conclusion, chatSummary] = await Promise.all([
      ai.summarize(factStrings, query),
      ai.generateAnalysis(factStrings, query),
      ai.generateConclusion(factStrings, query),
      ai.generateChatSummary(factStrings, query, processedSources.length),
    ]);

    // 5. Build report data and generate PDF (two-pass for provenance)
    console.log("[Research] Generating PDF report...");
    const reportData: ReportData = {
      query,
      generatedAt: new Date().toISOString(),
      sources: processedSources,
      facts: allFacts,
      summary: pdfSummary,
      analysis,
      conclusion,
    };

    // First pass: generate PDF to compute hash
    const firstPassPdf = await pdf.generate(reportData);
    const reportHash = provenance.computeHash(firstPassPdf.toString("base64"));

    // 6. Store first-pass PDF on Walrus to get blob ID
    console.log("[Research] Storing PDF on Walrus...");
    const pdfBlob = await walrus.store(firstPassPdf);
    const reportBlobId = pdfBlob.blobId;

    // 7. Record on-chain (1 transaction for the entire report)
    let txDigest = `walrus:${reportBlobId}`;
    if (effectiveKbId) {
      console.log("[Research] Recording on-chain...");
      txDigest = await this.recordOnChain(effectiveKbId, reportBlobId, reportHash, query);
    }

    // 8. Second pass: re-generate PDF with provenance data filled in
    console.log("[Research] Finalizing PDF with provenance...");
    reportData.reportHash = reportHash;
    reportData.txDigest = txDigest;
    reportData.reportBlobId = reportBlobId;

    const finalPdf = await pdf.generate(reportData);

    // 9. Store final PDF on Walrus (with provenance section filled)
    const finalBlob = await walrus.store(finalPdf);
    const finalBlobId = finalBlob.blobId;

    console.log("[Research] Done!");
    console.log(`   Sources: ${processedSources.length}`);
    console.log(`   Facts: ${allFacts.length}`);
    console.log(`   PDF Blob: ${finalBlobId}`);
    console.log(`   Tx: ${txDigest}`);

    const reportUrl = `${env.WALRUS_AGGREGATOR_URL}/v1/blobs/${finalBlobId}`;

    return {
      summary: chatSummary,
      reportBlobId: finalBlobId,
      reportHash,
      txDigest,
      sourceCount: processedSources.length,
      factCount: allFacts.length,
      reportUrl,
    };
  }

  /** Record report provenance on-chain — 1 Sui transaction */
  private async recordOnChain(
    knowledgeBaseId: string,
    reportBlobId: string,
    reportHash: string,
    query: string
  ): Promise<string> {
    try {
      const txResult = await this.deps.tatum.storeMemoryOnChain({
        knowledgeBaseId,
        blobId: reportBlobId,
        snapshotBlobId: reportBlobId, // Report is its own snapshot
        sourceUrl: `tuskbase://research/${encodeURIComponent(query)}`,
        sourceDomain: "tuskbase.research",
        contentHash: reportHash,
        trustScore: 9, // Self-generated report
      });
      return txResult.digest;
    } catch (error) {
      console.error(
        "[Research] On-chain record failed:",
        error instanceof Error ? error.message : error
      );
      return "on_chain_failed";
    }
  }
}
