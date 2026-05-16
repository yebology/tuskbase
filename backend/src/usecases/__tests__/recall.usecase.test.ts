import { describe, it, expect, vi, beforeEach } from "vitest";
import { RecallUseCase } from "../recall.usecase.js";

describe("RecallUseCase", () => {
  const mockMemwal = {
    recall: vi.fn(),
    remember: vi.fn(),
    rememberAsync: vi.fn(),
    analyze: vi.fn(),
    restore: vi.fn(),
    health: vi.fn(),
  };

  let useCase: RecallUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new RecallUseCase({ memwal: mockMemwal as any });
  });

  it("should return memories with relevance scores", async () => {
    // Arrange
    mockMemwal.recall.mockResolvedValue({
      results: [
        { content: "Sui has 300K TPS", score: 0.92, blobId: "blob_1" },
        { content: "Walrus uses erasure coding", score: 0.85, blobId: "blob_2" },
      ],
      total: 2,
    });

    // Act
    const result = await useCase.execute("Sui performance", 10);

    // Assert
    expect(result.memories).toHaveLength(2);
    expect(result.memories[0].content).toBe("Sui has 300K TPS");
    expect(result.memories[0].relevanceScore).toBe(0.92);
    expect(result.memories[0].blobId).toBe("blob_1");
    expect(result.total).toBe(2);
  });

  it("should return empty array when no memories match", async () => {
    // Arrange
    mockMemwal.recall.mockResolvedValue({ results: [], total: 0 });

    // Act
    const result = await useCase.execute("something obscure", 5);

    // Assert
    expect(result.memories).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it("should pass limit parameter to memwal", async () => {
    // Arrange
    mockMemwal.recall.mockResolvedValue({ results: [], total: 0 });

    // Act
    await useCase.execute("query", 3);

    // Assert
    expect(mockMemwal.recall).toHaveBeenCalledWith("query", 3);
  });
});
