/**
 * Mock data layer — simulates API responses.
 * Will be replaced by real services (MemWal, Walrus, Tatum) in production.
 */

import type { Memory, ResearchSession, ChatMessage } from "@/types";

export const MOCK_SESSIONS: ResearchSession[] = [
  {
    id: "session_001",
    query: "Research DeFi protocols on Sui blockchain",
    timestamp: "2026-05-25T10:29:00Z",
    memoryCount: 3,
  },
  {
    id: "session_002",
    query: "What is Walrus protocol and how does it store data?",
    timestamp: "2026-05-25T11:00:00Z",
    memoryCount: 2,
  },
];

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
    sessionId: "session_001",
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
    sessionId: "session_001",
  },
  {
    id: "mem_003",
    content:
      "DeFi on Sui has seen rapid growth with protocols like Cetus, Turbos, and Suilend. Total Value Locked exceeded $1.5B in Q1 2026, driven by Sui's low latency and parallel execution.",
    sourceUrl: "https://defillama.com/chain/Sui",
    sourceDomain: "defillama.com",
    timestamp: "2026-05-25T10:35:00Z",
    blobId: "P6juBIS3qEmvfgijD1JpK4HlJkMm7NoQpRsStTuVwXy",
    snapshotBlobId: "D4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5aB6cD7eF",
    contentHash:
      "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
    txDigest: "9QrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEf",
    trustScore: 7,
    sessionId: "session_001",
  },
  {
    id: "mem_004",
    content:
      "Walrus uses Red Stuff erasure coding which splits data into slivers distributed across storage nodes. Only a fraction of slivers are needed to reconstruct the original data, providing fault tolerance.",
    sourceUrl: "https://docs.wal.app/architecture",
    sourceDomain: "wal.app",
    timestamp: "2026-05-25T11:02:00Z",
    blobId: "Q7kvCJT4rFnwghkjE2KqL5ImKlNn8OpRqSsTtUuVwXy",
    snapshotBlobId: "G7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0hI",
    contentHash:
      "3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
    txDigest: "AbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQr",
    trustScore: 9,
    sessionId: "session_002",
  },
  {
    id: "mem_005",
    content:
      "Walrus storage is paid in WAL tokens with a cost of approximately 0.5 WAL per GB per epoch. Data persists for the number of epochs purchased and can be extended.",
    sourceUrl: "https://docs.wal.app/pricing",
    sourceDomain: "wal.app",
    timestamp: "2026-05-25T11:04:00Z",
    blobId: "R8lwDKU5sGoxhilkF3LrM6JnLmOo9PqSrTtUuVvWxYz",
    snapshotBlobId: "J0kL1mN2oP3qR4sT5uV6wX7yZ8aB9cD0eF1gH2iJ3kL",
    contentHash:
      "4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
    txDigest: "StUvWxYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIj",
    trustScore: 9,
    sessionId: "session_002",
  },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg_001",
    role: "user",
    content: "Research DeFi protocols on Sui blockchain",
    timestamp: "2026-05-25T10:29:00Z",
    sessionId: "session_001",
  },
  {
    id: "msg_002",
    role: "assistant",
    content:
      "I researched DeFi on Sui and found 3 key findings:\n\n**Walrus Storage** — Decentralized storage using Red Stuff erasure coding with 4.5x replication, storing 450TB+ since March 2025.\n\n**Sui Architecture** — Object-centric model enables parallel transaction processing, achieving 300K+ TPS.\n\n**DeFi Growth** — TVL exceeded $1.5B in Q1 2026, with Cetus, Turbos, and Suilend as leading protocols.\n\nAll findings stored with verifiable provenance on Walrus. Check the Memories tab to verify each one.",
    memories: MOCK_MEMORIES.filter((m) => m.sessionId === "session_001"),
    timestamp: "2026-05-25T10:30:00Z",
    sessionId: "session_001",
  },
];
