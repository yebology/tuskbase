/**
 * Database Service — handles persistence of sessions, messages, and memories.
 * Uses Prisma with PostgreSQL. Gracefully degrades if DB is unavailable.
 */

import type { StoredMemory } from "../types/index.js";

let prisma: any = null;

async function getClient() {
  if (prisma) return prisma;
  try {
    const { PrismaClient } = await import("@prisma/client");
    prisma = new PrismaClient();
    await prisma.$connect();
    return prisma;
  } catch (error) {
    console.warn("[Database] PostgreSQL not available — running without persistence");
    return null;
  }
}

export class DatabaseService {
  /** Create a new research session */
  async createSession(query: string): Promise<string | null> {
    const client = await getClient();
    if (!client) return null;
    const session = await client.session.create({ data: { query } });
    return session.id;
  }

  /** Get all sessions (most recent first) */
  async getSessions() {
    const client = await getClient();
    if (!client) return [];
    return client.session.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { memories: true } } },
    });
  }

  /** Get a session with its messages and memories */
  async getSession(id: string) {
    const client = await getClient();
    if (!client) return null;
    return client.session.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        memories: { orderBy: { createdAt: "desc" } },
      },
    });
  }

  /** Rename a session */
  async renameSession(id: string, query: string) {
    const client = await getClient();
    if (!client) return null;
    return client.session.update({ where: { id }, data: { query } });
  }

  /** Delete a session and all its data */
  async deleteSession(id: string) {
    const client = await getClient();
    if (!client) return null;
    return client.session.delete({ where: { id } });
  }

  /** Add a message to a session */
  async addMessage(sessionId: string, role: string, content: string) {
    const client = await getClient();
    if (!client) return null;
    return client.message.create({ data: { sessionId, role, content } });
  }

  /** Store a memory linked to a session */
  async storeMemory(sessionId: string, memory: StoredMemory) {
    const client = await getClient();
    if (!client) return null;
    return client.memory.create({
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
    const client = await getClient();
    if (!client) return [];
    return client.memory.findMany({
      where: sessionId ? { sessionId } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }

  /** Get a single memory by ID */
  async getMemory(id: string) {
    const client = await getClient();
    if (!client) return null;
    return client.memory.findUnique({ where: { id } });
  }

  /** Disconnect Prisma client (for graceful shutdown) */
  async disconnect() {
    if (prisma) await prisma.$disconnect();
  }
}
