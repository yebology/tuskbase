import { describe, it, expect } from "vitest";
import { ProvenanceService } from "../provenance.service.js";

describe("ProvenanceService", () => {
  const service = new ProvenanceService();

  describe("computeHash", () => {
    it("should return consistent SHA-256 hash for same content", () => {
      // Arrange
      const content = "Sui can process 300K TPS";

      // Act
      const hash1 = service.computeHash(content);
      const hash2 = service.computeHash(content);

      // Assert
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 hex = 64 chars
    });

    it("should return different hash for different content", () => {
      // Arrange
      const content1 = "fact one";
      const content2 = "fact two";

      // Act
      const hash1 = service.computeHash(content1);
      const hash2 = service.computeHash(content2);

      // Assert
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("calculateTrustScore", () => {
    it("should return 10 for .gov domains", () => {
      expect(service.calculateTrustScore("data.gov")).toBe(10);
    });

    it("should return 10 for .edu domains", () => {
      expect(service.calculateTrustScore("mit.edu")).toBe(10);
    });

    it("should return 9 for high-trust domains", () => {
      expect(service.calculateTrustScore("docs.sui.io")).toBe(9);
      expect(service.calculateTrustScore("tatum.io")).toBe(9);
      expect(service.calculateTrustScore("arxiv.org")).toBe(9);
    });

    it("should return 8 for medium-trust domains", () => {
      expect(service.calculateTrustScore("github.com")).toBe(8);
      expect(service.calculateTrustScore("blog.sui.io")).toBe(8);
    });

    it("should return 7 for .org domains", () => {
      expect(service.calculateTrustScore("wikipedia.org")).toBe(7);
    });

    it("should return 6 for blog/tech content domains", () => {
      expect(service.calculateTrustScore("medium.com")).toBe(6);
      expect(service.calculateTrustScore("dev.to")).toBe(6);
    });

    it("should return 4 for social media domains", () => {
      expect(service.calculateTrustScore("reddit.com")).toBe(4);
      expect(service.calculateTrustScore("x.com")).toBe(4);
    });

    it("should return 5 for unknown domains", () => {
      expect(service.calculateTrustScore("randomsite.xyz")).toBe(5);
    });
  });

  describe("buildMetadata", () => {
    it("should build complete provenance metadata", () => {
      // Arrange
      const sourceUrl = "https://docs.sui.io/concepts";
      const content = "Sui uses object-centric model";
      const snapshotBlobId = "snap_123";

      // Act
      const meta = service.buildMetadata(sourceUrl, content, snapshotBlobId);

      // Assert
      expect(meta.sourceUrl).toBe(sourceUrl);
      expect(meta.sourceDomain).toBe("docs.sui.io");
      expect(meta.snapshotBlobId).toBe(snapshotBlobId);
      expect(meta.trustScore).toBe(9);
      expect(meta.contentHash).toHaveLength(64);
      expect(meta.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it("should handle malformed URLs gracefully", () => {
      // Arrange
      const sourceUrl = "not-a-valid-url";
      const content = "some fact";
      const snapshotBlobId = "snap_456";

      // Act
      const meta = service.buildMetadata(sourceUrl, content, snapshotBlobId);

      // Assert
      expect(meta.sourceDomain).toBe("unknown");
      expect(meta.trustScore).toBe(5);
    });
  });

  describe("verifyIntegrity", () => {
    it("should return true when hash matches content", () => {
      // Arrange
      const content = "verifiable fact";
      const hash = service.computeHash(content);

      // Act & Assert
      expect(service.verifyIntegrity(content, hash)).toBe(true);
    });

    it("should return false when content has been modified", () => {
      // Arrange
      const original = "original fact";
      const hash = service.computeHash(original);
      const modified = "modified fact";

      // Act & Assert
      expect(service.verifyIntegrity(modified, hash)).toBe(false);
    });
  });
});
