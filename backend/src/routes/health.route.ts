/**
 * Health Route — basic health check and service status.
 */

import { Hono } from "hono";
import type { MemwalService } from "../services/memwal.service.js";

export function createHealthRoute(memwal: MemwalService) {
  const route = new Hono();

  route.get("/", async (c) => {
    let memwalHealthy = false;
    try {
      memwalHealthy = await memwal.health();
    } catch {
      memwalHealthy = false;
    }

    return c.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        memwal: memwalHealthy ? "connected" : "disconnected",
        walrus: "connected",
        tatum: "connected",
      },
    });
  });

  return route;
}
