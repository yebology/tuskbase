/**
 * Research Route — handles research requests from the frontend.
 */

import { Hono } from "hono";
import { z } from "zod";
import type { ResearchUseCase } from "../usecases/research.usecase.js";

const researchSchema = z.object({
  query: z.string().min(1).max(500),
  knowledgeBaseId: z.string().optional(),
});

export function createResearchRoute(researchUseCase: ResearchUseCase) {
  const route = new Hono();

  route.post("/", async (c) => {
    const body = await c.req.json();
    const parsed = researchSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: "Invalid request", details: parsed.error.format() }, 400);
    }

    try {
      const result = await researchUseCase.execute(
        parsed.data.query,
        parsed.data.knowledgeBaseId
      );
      return c.json({
        success: true,
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return c.json({ error: "Research failed", message }, 500);
    }
  });

  return route;
}
