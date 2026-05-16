/**
 * Tuskbase Backend — Entry point.
 * Wires DI container, registers routes, and starts the server.
 */

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./config/env.js";
import { createContainer } from "./container.js";
import { createHealthRoute } from "./routes/health.route.js";
import { createResearchRoute } from "./routes/research.route.js";
import { createMemoryRoute } from "./routes/memory.route.js";

// Initialize DI container
const container = createContainer();

// Create Hono app
const app = new Hono();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:3005"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// Routes
app.route("/api/health", createHealthRoute(container.memwal));
app.route("/api/research", createResearchRoute(
  container.researchUseCase,
  container.ai,
  container.tatumMcp
));
app.route(
  "/api/memory",
  createMemoryRoute(container.recallUseCase, container.verifyUseCase)
);

// Root
app.get("/", (c) =>
  c.json({
    name: "Tuskbase API",
    version: "0.1.0",
    description: "Verifiable Knowledge Agent — powered by Walrus + Tatum + Sui",
  })
);

// Start server
serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`🦭 Tuskbase backend running on http://localhost:${info.port}`);
});
