/**
 * Mock data layer — simulates API responses.
 * Will be replaced by real services (MemWal, Walrus, Tatum) in production.
 */

import type { Memory, KnowledgeBase, ChatMessage } from "@/types";

export const MOCK_MEMORIES: Memory[] = [
  {
    id: "mem_001",
    content:
      "Walrus is a decentralized storage protocol built on Sui that uses Red Stuff erasure coding with ~4.5x replication factor. It launched mainnet in March 2025 and has stored over 450TB of data.",
    sourceUrl: "https://docs.wal.app",
    sourceDomain: "wal.app",
    timestamp: "2026-05-25T10:30:00Z",
    blobId: "M4hsZGQ1oCktdzegB6HnI6Mi28S2nqOPHxK-W7_4BUk",
    snapshotBlobId: "X7kpLmN3oRstuvwxB9CdE2FgHiJk5LmNoPqRsTuVwXy",
    contentHash:
      "8f3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
    txDigest: "4XQHFa9S324wTzYHF3vsBSwpUZuLpmwTHYMFv9nsttSs",
    trustScore: 9,
    namespace: "defi-research",
  },
  {
    id: "mem_002",
    content:
      "Sui processes independent transactions in parallel using its object-centric data model. It can handle over 300,000 simple transactions per second without consensus for non-shared objects.",
    sourceUrl: "https://docs.sui.io/concepts/sui-architecture",
    sourceDomain: "sui.io",
    timestamp: "2026-05-25T10:32:00Z",
    blobId: "N5itAHR2pDluefhiC0IoJ3GkIjLl6MnOpQrStUvWxYz",
    snapshotBlobId: "A1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC",
    contentHash:
      "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    txDigest: "7BcDEf8G9hIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOp",
    trustScore: 10,
    namespace: "defi-research",
  },
  {
    id: "mem_003",
    content:
      "MemWal is a long-term verifiable memory layer on Walrus for AI agents, launched in beta March 2026. It provides persistent memory with end-to-end encryption and provable ownership via Sui smart contracts.",
    sourceUrl: "https://docs.memwal.ai",
    sourceDomain: "memwal.ai",
    timestamp: "2026-05-25T10:35:00Z",
    blobId: "P6juBIS3qEmvfgijD1JpK4HlJkMm7NoQpRsStTuVwXy",
    snapshotBlobId: "D4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5aB6cD7eF",
    contentHash:
      "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
    txDigest: "9QrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEf",
    trustScore: 8,
    namespace: "defi-research",
  },
  {
    id: "mem_004",
    content:
      "Tatum provides enterprise-grade Sui RPC endpoints with global load balancing, automatic failovers, and smart caching. They support mainnet, testnet, and devnet via gateway URLs.",
    sourceUrl: "https://tatum.io/chain/sui",
    sourceDomain: "tatum.io",
    timestamp: "2026-05-25T10:38:00Z",
    blobId: "Q7kvCJT4rFnwghkjE2KqL5ImKlNn8OpRqSsTtUuVwXy",
    snapshotBlobId: "G7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0hI",
    contentHash:
      "3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
    txDigest: "AbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQr",
    trustScore: 8,
    namespace: "defi-research",
  },
  {
    id: "mem_005",
    content:
      "DeFi on Sui has seen rapid growth with protocols like Cetus, Turbos, and Suilend. Total Value Locked exceeded $1.5B in Q1 2026, driven by Sui's low latency and parallel execution.",
    sourceUrl: "https://defillama.com/chain/Sui",
    sourceDomain: "defillama.com",
    timestamp: "2026-05-25T10:40:00Z",
    blobId: "R8lwDKU5sGoxhilkF3LrM6JnLmOo9PqSrTtUuVvWxYz",
    snapshotBlobId: "J0kL1mN2oP3qR4sT5uV6wX7yZ8aB9cD0eF1gH2iJ3kL",
    contentHash:
      "4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
    txDigest: "StUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIj",
    trustScore: 7,
    namespace: "defi-research",
  },
];

export const MOCK_KNOWLEDGE_BASES: KnowledgeBase[] = [
  {
    id: "kb_001",
    name: "DeFi on Sui Research",
    description:
      "Comprehensive research on DeFi protocols, TVL, and ecosystem growth on Sui blockchain",
    owner: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    createdAt: "2026-05-25T10:00:00Z",
    memoryCount: 5,
    isPublic: true,
    totalTrustScore: 42,
  },
  {
    id: "kb_002",
    name: "Walrus Storage Deep Dive",
    description:
      "Technical analysis of Walrus protocol architecture, erasure coding, and performance",
    owner: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    createdAt: "2026-05-24T08:00:00Z",
    memoryCount: 12,
    isPublic: false,
    totalTrustScore: 98,
  },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg_001",
    role: "user",
    content: "Research DeFi protocols on Sui blockchain",
    timestamp: "2026-05-25T10:29:00Z",
  },
  {
    id: "msg_002",
    role: "assistant",
    content:
      "I'll research DeFi on Sui for you. Let me search for the latest information...\n\nI found 5 key findings from reliable sources. Here's a summary:\n\n**Sui Architecture** — Sui uses an object-centric data model that enables parallel transaction processing, achieving 300K+ TPS for simple transactions.\n\n**Walrus Storage** — The decentralized storage layer uses Red Stuff erasure coding with 4.5x replication, storing 450TB+ since March 2025 launch.\n\n**DeFi Growth** — TVL exceeded $1.5B in Q1 2026, with Cetus, Turbos, and Suilend as leading protocols.\n\n**Infrastructure** — Tatum provides enterprise-grade RPC endpoints with global load balancing for Sui.\n\n**MemWal** — AI memory layer launched March 2026, enabling persistent agent memory on Walrus.\n\nAll findings have been stored with verifiable provenance. You can check each source in the Memory Explorer.",
    memories: MOCK_MEMORIES.slice(0, 3),
    timestamp: "2026-05-25T10:30:00Z",
  },
];
