# Tuskbase — Architecture Overview

## System Overview

Tuskbase is a verifiable AI research agent. It has three layers:

```
Frontend (Next.js) → Backend (Hono) → External Services (Walrus, MemWal, Tatum, Sui, OpenAI)
                                    → Database (PostgreSQL)
```

## Monorepo Structure

```
tuskbase/
├── frontend/          # Next.js — UI layer
├── backend/           # Hono — API + business logic
├── contracts/         # Move — Sui smart contracts
└── docker-compose.yml # Orchestration
```

Each folder is independent — own `package.json`, own `Makefile`, own build.

## Data Flow

### Research Flow
```
User query → POST /api/research
  → AI detectIntent (OpenAI)
  → [web_research]: Tavily → OpenAI extract → Walrus store → MemWal remember → Tatum Sui tx
  → [blockchain_*]: Tatum MCP Data API → OpenAI format
  → Response (summary + memories)
```

### Verify Flow
```
Memory selected → POST /api/memory/verify
  → Walrus: blob exists?
  → Walrus: retrieve + hash check
  → Tatum RPC: tx exists on Sui?
  → Walrus: snapshot exists?
  → Tatum MCP: SUI price (context)
  → Response (isValid + details)
```

### Recall Flow
```
Query → POST /api/memory/recall
  → MemWal SDK: semantic search
  → Response (matching memories)
```

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Hono over Express | Lightweight, fast, TypeScript-first, works with Node + Bun |
| DI Container | Testable, swappable services, no global state |
| Use Cases pattern | Business logic separated from routes and services |
| MemWal SDK (not raw HTTP) | Official SDK handles encryption, auth, vector search |
| Tatum as RPC gateway | Hackathon requirement — all Sui calls through Tatum |
| PostgreSQL + Prisma | Persist sessions/chat, cache memories for fast access |
| localStorage for chat | Frontend persistence without backend dependency |
| No auth (yet) | Single-user hackathon demo — backend signs with own key |

## Communication

- Frontend → Backend: REST (JSON over HTTP)
- Backend → Walrus: HTTP PUT/GET (blobs)
- Backend → MemWal: SDK (HTTP under the hood)
- Backend → Sui: @mysten/sui SDK via Tatum RPC URL
- Backend → Tatum MCP: @tatumio/blockchain-mcp API client
- Backend → OpenAI: openai SDK
- Backend → Tavily: HTTP POST
- Backend → PostgreSQL: Prisma ORM
