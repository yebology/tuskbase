/**
 * Database Service — handles persistence of sessions, messages, and memories.
 * Uses Prisma with PostgreSQL for structured data storage.
 */

import { PrismaClient } from "@prisma/client";
import type { StoredMemory } from "../types/index.js";

const prisma = new PrismaClient();

export class DatabaseService {
  /** Create a new research session */
  async createSession(query: string): Promise<string> {
    const session = await prisma.session.create({
      data: { query },
    });
    return session.id;
  }

  /** Get all sessions (most recent first) */
  async getSessions() {
    return prisma.session.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { memories: true } } },
    });
  }

  /** Get a session with its messages and memories */
  async getSession(id: string) {
    return prisma.session.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        memories: { orderBy: { createdAt: "desc" } },
      },
    });
  }

  /** Rename a session */
  async renameSession(id: string, query: string) {
    return prisma.session.update({
      where: { id },
      data: { query },
    });
  }

  /** Delete a session and all its data */
  async deleteSession(id: string) {
    return prisma.session.delete({ where: { id } });
  }

  /** Add a message to a session */
  async addMessage(sessionId: string, role: string, content: string) {
    return prisma.message.create({
      data: { sessionId, role, content },
    });
  }

  /** Store a memory linked to a session */
  async storeMemory(sessionId: string, memory: StoredMemory) {
    return prisma.memory.create({
      data: {
        sessionId,
        content: memory.content,
        sourceUrl: memory.sourceUrl,
        sourceDomain: memory.sourceDomain,
        blobId: memory.blobId,
        snapshotBlobId: memory.snapshotBlobId,
        contentHash: memory.contentHash,
        txDigest: memory.txDigest,
        trustScore: memory.trustScore,
        memwalBlobId: memory.memwalBlobId,
      },
    });
  }

  /** Get all memories (optionally filtered by session) */
  async getMemories(sessionId?: string) {
    return prisma.memory.findMany({
      where: sessionId ? { sessionId } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }

  /** Get a single memory by ID */
  async getMemory(id: string) {
    return prisma.memory.findUnique({ where: { id } });
  }

  /** Disconnect Prisma client (for graceful shutdown) */
  async disconnect() {
    await prisma.$disconnect();
  }
}
