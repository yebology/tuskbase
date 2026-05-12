/**
 * Tuskbase Backend — Entry point.
 * Wires DI container, registers routes, and starts the server.
 */

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
app.route("/api/research", createResearchRoute(container.researchUseCase));
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
console.log(`🦭 Tuskbase backend starting on port ${env.PORT}`);
export default {
  port: env.PORT,
  fetch: app.fetch,
};
