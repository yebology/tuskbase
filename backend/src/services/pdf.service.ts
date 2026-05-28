/**
 * PDF Service — generates professional research reports using PDFKit.
 * Produces well-formatted, multi-page PDF documents with proper typography,
 * headers, footers, page numbers, and structured sections.
 */

import PDFDocument from "pdfkit";
import type { ReportData, ProcessedSource, ExtractedFact } from "../types/index.js";

/** Color palette for the report */
const COLORS = {
  primary: "#1a1a2e",
  secondary: "#16213e",
  accent: "#0f3460",
  highlight: "#e94560",
  text: "#2d2d2d",
  textLight: "#666666",
  border: "#e0e0e0",
  background: "#f8f9fa",
  white: "#ffffff",
  trustHigh: "#22c55e",
  trustMedium: "#f59e0b",
  trustLow: "#ef4444",
} as const;

/** Font sizes */
const FONT_SIZE = {
  title: 24,
  subtitle: 14,
  heading: 16,
  subheading: 13,
  body: 10.5,
  small: 9,
  footnote: 8,
} as const;

/** Page layout */
const LAYOUT = {
  marginTop: 72,
  marginBottom: 72,
  marginLeft: 60,
  marginRight: 60,
  contentWidth: 0, // calculated in constructor
} as const;

export class PdfService {
  /** Generate a complete research report PDF and return as Buffer */
  async generate(data: ReportData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: "A4",
        bufferPages: true,
        margins: {
          top: LAYOUT.marginTop,
          bottom: LAYOUT.marginBottom,
          left: LAYOUT.marginLeft,
          right: LAYOUT.marginRight,
        },
        info: {
          Title: `Research Report: ${data.query}`,
          Author: "Tuskbase Research Agent",
          Subject: data.query,
          Creator: "Tuskbase — Verifiable AI Research",
        },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const contentWidth =
        doc.page.width - LAYOUT.marginLeft - LAYOUT.marginRight;

      // === PAGE 1: COVER ===
      this.renderCover(doc, data, contentWidth);

      // === PAGE 2+: TABLE OF CONTENTS ===
      doc.addPage();
      this.renderTableOfContents(doc, data, contentWidth);

      // === EXECUTIVE SUMMARY ===
      doc.addPage();
      this.renderExecutiveSummary(doc, data, contentWidth);

      // === KEY FINDINGS ===
      doc.addPage();
      this.renderKeyFindings(doc, data, contentWidth);

      // === DETAILED ANALYSIS ===
      doc.addPage();
      this.renderDetailedAnalysis(doc, data, contentWidth);

      // === CONCLUSION ===
      doc.addPage();
      this.renderConclusion(doc, data, contentWidth);

      // === SOURCES ===
      doc.addPage();
      this.renderSources(doc, data, contentWidth);

      // === PROVENANCE VERIFICATION ===
      doc.addPage();
      this.renderProvenance(doc, data, contentWidth);

      // === ADD PAGE NUMBERS ===
      this.addPageNumbers(doc);

      doc.end();
    });
  }

  /** Render the cover page */
  private renderCover(
    doc: PDFKit.PDFDocument,
    data: ReportData,
    contentWidth: number
  ): void {
    // Background accent bar at top
    doc.rect(0, 0, doc.page.width, 8).fill(COLORS.highlight);

    // Logo / Brand
    const centerX = LAYOUT.marginLeft + contentWidth / 2;

    doc.moveDown(6);
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(COLORS.textLight)
      .text("TUSKBASE", LAYOUT.marginLeft, doc.y, {
        width: contentWidth,
        align: "center",
      });

    doc
      .font("Helvetica")
      .fontSize(FONT_SIZE.small)
      .fillColor(COLORS.textLight)
      .text("Verifiable AI Research Agent", {
        width: contentWidth,
        align: "center",
      });

    // Divider
    doc.moveDown(3);
    const dividerY = doc.y;
    doc
      .moveTo(centerX - 40, dividerY)
      .lineTo(centerX + 40, dividerY)
      .lineWidth(2)
      .stroke(COLORS.highlight);

    // Title
    doc.moveDown(3);
    doc
      .font("Helvetica-Bold")
      .fontSize(FONT_SIZE.title)
      .fillColor(COLORS.primary)
      .text("Research Report", LAYOUT.marginLeft, doc.y, {
        width: contentWidth,
        align: "center",
      });

    doc.moveDown(1);
    doc
      .font("Helvetica")
      .fontSize(FONT_SIZE.subtitle)
      .fillColor(COLORS.secondary)
      .text(`"${data.query}"`, {
        width: contentWidth,
        align: "center",
      });

    // Metadata box
    doc.moveDown(5);
    const boxY = doc.y;
    const boxX = LAYOUT.marginLeft + contentWidth / 2 - 120;
    const boxWidth = 240;

    doc
      .roundedRect(boxX, boxY, boxWidth, 100, 4)
      .fillAndStroke(COLORS.background, COLORS.border);

    doc
      .font("Helvetica")
      .fontSize(FONT_SIZE.small)
      .fillColor(COLORS.textLight);

    const metaX = boxX + 20;
    let metaY = boxY + 16;

    doc.text(`Date:`, metaX, metaY);
    doc
      .font("Helvetica-Bold")
      .fillColor(COLORS.text)
      .text(
        new Date(data.generatedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        metaX + 80,
        metaY
      );

    metaY += 20;
    doc
      .font("Helvetica")
      .fillColor(COLORS.textLight)
      .text(`Sources:`, metaX, metaY);
    doc
      .font("Helvetica-Bold")
      .fillColor(COLORS.text)
      .text(`${data.sources.length} analyzed`, metaX + 80, metaY);

    metaY += 20;
    doc
      .font("Helvetica")
      .fillColor(COLORS.textLight)
      .text(`Findings:`, metaX, metaY);
    doc
      .font("Helvetica-Bold")
      .fillColor(COLORS.text)
      .text(`${data.facts.length} key facts`, metaX + 80, metaY);

    metaY += 20;
    doc
      .font("Helvetica")
      .fillColor(COLORS.textLight)
      .text(`Verified:`, metaX, metaY);
    doc
      .font("Helvetica-Bold")
      .fillColor(COLORS.trustHigh)
      .text(`On-chain (Sui)`, metaX + 80, metaY);

    // Footer note
    doc
      .font("Helvetica")
      .fontSize(FONT_SIZE.footnote)
      .fillColor(COLORS.textLight)
      .text(
        "This report is cryptographically verified on the Sui blockchain.",
        LAYOUT.marginLeft,
        doc.page.height - LAYOUT.marginBottom - 30,
        { width: contentWidth, align: "center" }
      );
    doc.text(
      "Provenance details available in the final section.",
      LAYOUT.marginLeft,
      doc.y,
      { width: contentWidth, align: "center" }
    );
  }

  /** Render table of contents */
  private renderTableOfContents(
    doc: PDFKit.PDFDocument,
    data: ReportData,
    contentWidth: number
  ): void {
    this.renderSectionHeader(doc, "Table of Contents", contentWidth);
    doc.moveDown(1);

    const sections = [
      { num: "1", title: "Executive Summary" },
      { num: "2", title: "Key Findings" },
      { num: "3", title: "Detailed Analysis" },
      { num: "4", title: "Conclusion & Recommendations" },
      { num: "5", title: `Sources (${data.sources.length})` },
      { num: "6", title: "Provenance Verification" },
    ];

    for (const section of sections) {
      doc
        .font("Helvetica")
        .fontSize(FONT_SIZE.body)
        .fillColor(COLORS.text)
        .text(`${section.num}.  ${section.title}`, LAYOUT.marginLeft + 20, doc.y, {
          continued: false,
        });
      doc.moveDown(0.5);
    }
  }

  /** Render executive summary section */
  private renderExecutiveSummary(
    doc: PDFKit.PDFDocument,
    data: ReportData,
    contentWidth: number
  ): void {
    this.renderSectionHeader(doc, "1. Executive Summary", contentWidth);
    doc.moveDown(1);

    doc
      .font("Helvetica")
      .fontSize(FONT_SIZE.body)
      .fillColor(COLORS.text)
      .text(data.summary, LAYOUT.marginLeft, doc.y, {
        width: contentWidth,
        align: "justify",
        lineGap: 4,
      });
  }

  /** Render key findings section */
  private renderKeyFindings(
    doc: PDFKit.PDFDocument,
    data: ReportData,
    contentWidth: number
  ): void {
    this.renderSectionHeader(doc, "2. Key Findings", contentWidth);
    doc.moveDown(1);

    // Group facts by source domain for better organization
    const factsByDomain = new Map<string, ExtractedFact[]>();
    for (const fact of data.facts) {
      const existing = factsByDomain.get(fact.sourceDomain) ?? [];
      existing.push(fact);
      factsByDomain.set(fact.sourceDomain, existing);
    }

    let factIndex = 1;
    for (const [domain, facts] of factsByDomain) {
      // Check if we need a new page
      if (doc.y > doc.page.height - LAYOUT.marginBottom - 100) {
        doc.addPage();
      }

      // Source domain subheading
      doc
        .font("Helvetica-Bold")
        .fontSize(FONT_SIZE.subheading)
        .fillColor(COLORS.accent)
        .text(`From: ${domain}`, LAYOUT.marginLeft, doc.y);

      // Trust score badge
      const trustScore = facts[0].trustScore;
      const trustColor =
        trustScore >= 8
          ? COLORS.trustHigh
          : trustScore >= 5
            ? COLORS.trustMedium
            : COLORS.trustLow;

      doc
        .font("Helvetica")
        .fontSize(FONT_SIZE.small)
        .fillColor(trustColor)
        .text(`Trust Score: ${trustScore}/10`, LAYOUT.marginLeft, doc.y);

      doc.moveDown(0.5);

      // Facts as bullet points
      for (const fact of facts) {
        if (doc.y > doc.page.height - LAYOUT.marginBottom - 60) {
          doc.addPage();
        }

        doc
          .font("Helvetica")
          .fontSize(FONT_SIZE.body)
          .fillColor(COLORS.text)
          .text(
            `[${factIndex}]  ${fact.fact}`,
            LAYOUT.marginLeft + 15,
            doc.y,
            {
              width: contentWidth - 15,
              lineGap: 3,
            }
          );
        doc.moveDown(0.4);
        factIndex++;
      }

      doc.moveDown(0.8);
    }
  }

  /** Render detailed analysis section */
  private renderDetailedAnalysis(
    doc: PDFKit.PDFDocument,
    data: ReportData,
    contentWidth: number
  ): void {
    this.renderSectionHeader(doc, "3. Detailed Analysis", contentWidth);
    doc.moveDown(1);

    doc
      .font("Helvetica")
      .fontSize(FONT_SIZE.body)
      .fillColor(COLORS.text)
      .text(data.analysis, LAYOUT.marginLeft, doc.y, {
        width: contentWidth,
        align: "justify",
        lineGap: 4,
      });
  }

  /** Render conclusion section */
  private renderConclusion(
    doc: PDFKit.PDFDocument,
    data: ReportData,
    contentWidth: number
  ): void {
    this.renderSectionHeader(
      doc,
      "4. Conclusion & Recommendations",
      contentWidth
    );
    doc.moveDown(1);

    doc
      .font("Helvetica")
      .fontSize(FONT_SIZE.body)
      .fillColor(COLORS.text)
      .text(data.conclusion, LAYOUT.marginLeft, doc.y, {
        width: contentWidth,
        align: "justify",
        lineGap: 4,
      });
  }

  /** Render sources section */
  private renderSources(
    doc: PDFKit.PDFDocument,
    data: ReportData,
    contentWidth: number
  ): void {
    this.renderSectionHeader(
      doc,
      `5. Sources (${data.sources.length})`,
      contentWidth
    );
    doc.moveDown(1);

    for (let i = 0; i < data.sources.length; i++) {
      if (doc.y > doc.page.height - LAYOUT.marginBottom - 50) {
        doc.addPage();
      }

      const source = data.sources[i];
      const trustColor =
        source.trustScore >= 8
          ? COLORS.trustHigh
          : source.trustScore >= 5
            ? COLORS.trustMedium
            : COLORS.trustLow;

      // Source number and title
      doc
        .font("Helvetica-Bold")
        .fontSize(FONT_SIZE.body)
        .fillColor(COLORS.text)
        .text(`[${i + 1}]  ${source.title || source.domain}`, LAYOUT.marginLeft, doc.y, {
          width: contentWidth,
        });

      // URL
      doc
        .font("Helvetica")
        .fontSize(FONT_SIZE.small)
        .fillColor(COLORS.accent)
        .text(source.url, LAYOUT.marginLeft + 25, doc.y, {
          width: contentWidth - 25,
          link: source.url,
        });

      // Trust score
      doc
        .font("Helvetica")
        .fontSize(FONT_SIZE.small)
        .fillColor(trustColor)
        .text(
          `Trust: ${source.trustScore}/10  •  ${source.facts.length} facts extracted`,
          LAYOUT.marginLeft + 25,
          doc.y
        );

      doc.moveDown(0.6);
    }
  }

  /** Render provenance verification section */
  private renderProvenance(
    doc: PDFKit.PDFDocument,
    data: ReportData,
    contentWidth: number
  ): void {
    this.renderSectionHeader(doc, "6. Provenance Verification", contentWidth);
    doc.moveDown(1);

    // Explanation
    doc
      .font("Helvetica")
      .fontSize(FONT_SIZE.body)
      .fillColor(COLORS.text)
      .text(
        "This research report is cryptographically anchored on the Sui blockchain. " +
          "The SHA-256 hash of this document is recorded on-chain, ensuring that the " +
          "content has not been tampered with since generation. Anyone can independently " +
          "verify the authenticity of this report using the information below.",
        LAYOUT.marginLeft,
        doc.y,
        { width: contentWidth, align: "justify", lineGap: 4 }
      );

    doc.moveDown(1.5);

    // Verification details box
    const boxY = doc.y;
    doc
      .roundedRect(LAYOUT.marginLeft, boxY, contentWidth, 130, 4)
      .fillAndStroke(COLORS.background, COLORS.border);

    let detailY = boxY + 16;
    const labelX = LAYOUT.marginLeft + 16;
    const valueX = LAYOUT.marginLeft + 140;

    const details = [
      { label: "Report Hash (SHA-256):", value: data.reportHash ?? "pending" },
      { label: "Sui Transaction:", value: data.txDigest ?? "pending" },
      { label: "Walrus Blob ID:", value: data.reportBlobId ?? "pending" },
      { label: "Generated At:", value: data.generatedAt },
      { label: "Network:", value: "Sui Devnet" },
    ];

    for (const detail of details) {
      doc
        .font("Helvetica")
        .fontSize(FONT_SIZE.small)
        .fillColor(COLORS.textLight)
        .text(detail.label, labelX, detailY);

      doc
        .font("Courier")
        .fontSize(FONT_SIZE.small)
        .fillColor(COLORS.text)
        .text(
          detail.value.length > 50
            ? detail.value.slice(0, 50) + "..."
            : detail.value,
          valueX,
          detailY,
          { width: contentWidth - 160 }
        );

      detailY += 20;
    }

    // Verification instructions
    doc.moveDown(8);
    doc
      .font("Helvetica-Bold")
      .fontSize(FONT_SIZE.subheading)
      .fillColor(COLORS.primary)
      .text("How to Verify", LAYOUT.marginLeft, doc.y);

    doc.moveDown(0.5);
    doc
      .font("Helvetica")
      .fontSize(FONT_SIZE.body)
      .fillColor(COLORS.text);

    const steps = [
      "1. Download this PDF and compute its SHA-256 hash",
      "2. Look up the Sui transaction using the digest above",
      "3. Compare the on-chain hash with your computed hash",
      "4. If they match, the report is authentic and unmodified",
    ];

    for (const step of steps) {
      doc.text(step, LAYOUT.marginLeft + 15, doc.y, {
        width: contentWidth - 15,
      });
      doc.moveDown(0.3);
    }
  }

  /** Render a section header with accent line */
  private renderSectionHeader(
    doc: PDFKit.PDFDocument,
    title: string,
    contentWidth: number
  ): void {
    doc
      .font("Helvetica-Bold")
      .fontSize(FONT_SIZE.heading)
      .fillColor(COLORS.primary)
      .text(title, LAYOUT.marginLeft, doc.y);

    // Accent underline
    const lineY = doc.y + 4;
    doc
      .moveTo(LAYOUT.marginLeft, lineY)
      .lineTo(LAYOUT.marginLeft + contentWidth, lineY)
      .lineWidth(1)
      .stroke(COLORS.border);

    // Short accent highlight
    doc
      .moveTo(LAYOUT.marginLeft, lineY)
      .lineTo(LAYOUT.marginLeft + 60, lineY)
      .lineWidth(2)
      .stroke(COLORS.highlight);

    doc.y = lineY + 8;
  }

  /** Add page numbers to all pages (except cover) */
  private addPageNumbers(doc: PDFKit.PDFDocument): void {
    const { start, count } = doc.bufferedPageRange();

    for (let i = start; i < start + count; i++) {
      doc.switchToPage(i);

      // Skip cover page
      if (i === 0) continue;

      const pageNum = i; // Cover is page 0, so page 1 = first content page
      const totalPages = count - 1;

      // Page number at bottom center
      doc
        .font("Helvetica")
        .fontSize(FONT_SIZE.footnote)
        .fillColor(COLORS.textLight)
        .text(
          `${pageNum} / ${totalPages}`,
          0,
          doc.page.height - LAYOUT.marginBottom + 20,
          { align: "center", lineBreak: false }
        );

      // Header on content pages
      doc
        .font("Helvetica")
        .fontSize(FONT_SIZE.footnote)
        .fillColor(COLORS.textLight)
        .text("Tuskbase Research Report", LAYOUT.marginLeft, 30, {
          lineBreak: false,
        });

      // Top accent line
      doc
        .moveTo(LAYOUT.marginLeft, 45)
        .lineTo(doc.page.width - LAYOUT.marginRight, 45)
        .lineWidth(0.5)
        .stroke(COLORS.border);
    }
  }
}
