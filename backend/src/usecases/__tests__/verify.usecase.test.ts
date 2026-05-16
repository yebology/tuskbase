import { describe, it, expect, vi, beforeEach } from "vitest";
import { VerifyUseCase } from "../verify.usecase.js";

describe("VerifyUseCase", () => {
  const mockWalrus = {
    exists: vi.fn(),
    retrieve: vi.fn(),
    store: vi.fn(),
  };

  const mockProvenance = {
    verifyIntegrity: vi.fn(),
    computeHash: vi.fn(),
    calculateTrustScore: vi.fn(),
    buildMetadata: vi.fn(),
  };

  const mockTatum = {
    verifyTransaction: vi.fn(),
    storeMemoryOnChain: vi.fn(),
    createKnowledgeBase: vi.fn(),
    publishKnowledgeBase: vi.fn(),
    getObject: vi.fn(),
    getTransaction: vi.fn(),
    queryEvents: vi.fn(),
    getMemoryEvents: vi.fn(),
    getNetworkInfo: vi.fn(),
  };

  const mockTatumMcp = {
    getExchangeRate: vi.fn(),
    getWalletPortfolio: vi.fn(),
    getTransactionHistory: vi.fn(),
    checkMaliciousAddress: vi.fn(),
    executeRpc: vi.fn(),
  };

  let useCase: VerifyUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new VerifyUseCase({
      walrus: mockWalrus as any,
      provenance: mockProvenance as any,
      tatum: mockTatum as any,
      tatumMcp: mockTatumMcp as any,
    });
  });

  it("should return all true when memory is fully verified", async () => {
    // Arrange
    mockWalrus.exists.mockResolvedValue(true);
    mockWalrus.retrieve.mockResolvedValue(Buffer.from("fact content"));
    mockProvenance.verifyIntegrity.mockReturnValue(true);
    mockTatum.verifyTransaction.mockResolvedValue(true);
    mockTatumMcp.getExchangeRate.mockResolvedValue({ data: { value: "1.5" } });

    // Act
    const result = await useCase.execute("blob_1", "hash_1", "tx_1", "snap_1");

    // Assert
    expect(result.isValid).toBe(true);
    expect(result.blobExists).toBe(true);
    expect(result.hashMatches).toBe(true);
    expect(result.onChainRecordExists).toBe(true);
    expect(result.snapshotExists).toBe(true);
    expect(result.suiPriceUsd).toBe(1.5);
  });

  it("should return false when blob does not exist", async () => {
    // Arrange
    mockWalrus.exists.mockResolvedValueOnce(false); // blob
    mockWalrus.exists.mockResolvedValueOnce(true); // snapshot
    mockTatum.verifyTransaction.mockResolvedValue(true);
    mockTatumMcp.getExchangeRate.mockResolvedValue({ data: null });

    // Act
    const result = await useCase.execute("blob_1", "hash_1", "tx_1", "snap_1");

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.blobExists).toBe(false);
    expect(result.hashMatches).toBe(false); // Can't verify hash if blob doesn't exist
  });

  it("should return false when hash does not match", async () => {
    // Arrange
    mockWalrus.exists.mockResolvedValue(true);
    mockWalrus.retrieve.mockResolvedValue(Buffer.from("tampered content"));
    mockProvenance.verifyIntegrity.mockReturnValue(false);
    mockTatum.verifyTransaction.mockResolvedValue(true);
    mockTatumMcp.getExchangeRate.mockResolvedValue({ data: null });

    // Act
    const result = await useCase.execute("blob_1", "hash_1", "tx_1", "snap_1");

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.blobExists).toBe(true);
    expect(result.hashMatches).toBe(false);
  });

  it("should skip on-chain check for placeholder tx digests", async () => {
    // Arrange
    mockWalrus.exists.mockResolvedValue(true);
    mockWalrus.retrieve.mockResolvedValue(Buffer.from("content"));
    mockProvenance.verifyIntegrity.mockReturnValue(true);
    mockTatumMcp.getExchangeRate.mockResolvedValue({ data: null });

    // Act
    const result = await useCase.execute(
      "blob_1",
      "hash_1",
      "no_kb_specified",
      "snap_1"
    );

    // Assert
    expect(mockTatum.verifyTransaction).not.toHaveBeenCalled();
    expect(result.onChainRecordExists).toBe(false);
  });

  it("should not fail if exchange rate fetch fails", async () => {
    // Arrange
    mockWalrus.exists.mockResolvedValue(true);
    mockWalrus.retrieve.mockResolvedValue(Buffer.from("content"));
    mockProvenance.verifyIntegrity.mockReturnValue(true);
    mockTatum.verifyTransaction.mockResolvedValue(true);
    mockTatumMcp.getExchangeRate.mockRejectedValue(new Error("API down"));

    // Act
    const result = await useCase.execute("blob_1", "hash_1", "tx_1", "snap_1");

    // Assert
    expect(result.isValid).toBe(true);
    expect(result.suiPriceUsd).toBeNull();
  });
});
