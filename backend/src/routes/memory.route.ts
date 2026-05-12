/**
 * Memory Route — handles memory recall and verification.
 */

import { Hono } from "hono";
import { z } from "zod";
import type { RecallUseCase } from "../usecases/recall.usecase.js";
import type { VerifyUseCase } from "../usecases/verify.usecase.js";

const recallSchema = z.object({
  query: z.string().min(1).max(500),
  limit: z.number().min(1).max(50).default(10),
});

const verifySchema = z.object({
  blobId: z.string().min(1),
  expectedHash: z.string().min(1),
  txDigest: z.string().min(1),
  snapshotBlobId: z.string().min(1),
});

export function createMemoryRoute(
  recallUseCase: RecallUseCase,
  verifyUseCase: VerifyUseCase
) {
  const route = new Hono();

  /** Recall relevant memories by semantic search */
  route.post("/recall", async (c) => {
    const body = await c.req.json();
    const parsed = recallSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: "Invalid request", details: parsed.error.format() }, 400);
    }

    try {
      const result = await recallUseCase.execute(
        parsed.data.query,
        parsed.data.limit
      );
      return c.json({ success: true, data: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return c.json({ error: "Recall failed", message }, 500);
    }
  });

  /** Verify a memory's on-chain provenance */
  route.post("/verify", async (c) => {
    const body = await c.req.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: "Invalid request", details: parsed.error.format() }, 400);
    }

    try {
      const result = await verifyUseCase.execute(
        parsed.data.blobId,
        parsed.data.expectedHash,
        parsed.data.txDigest,
        parsed.data.snapshotBlobId
      );
      return c.json({ success: true, data: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return c.json({ error: "Verification failed", message }, 500);
    }
  });

  return route;
}
