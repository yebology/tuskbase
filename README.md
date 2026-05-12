# 🦭 Tuskbase

> **AI research agent with verifiable memory — every fact stored on Walrus with cryptographic proof of its source.**

## 🎬 Demo Video

[![Tuskbase Demo](https://img.shields.io/badge/Watch%20Demo-YouTube-red?style=for-the-badge&logo=youtube)](https://youtu.be/TODO)

---

**Tuskbase** is a verifiable knowledge agent that researches topics, stores findings on Walrus decentralized storage, and records provenance on-chain via Sui — so anyone can verify what the AI knows, where it learned it, and when.

Unlike ChatGPT or Perplexity where you just "trust" the AI, Tuskbase lets you **prove** every claim. Each memory has a source URL, content hash, timestamp on Sui, and a snapshot of the original page — all verifiable by anyone.

---

## ✨ Overview

AI agents today have two problems: they forget everything between sessions, and when they do "remember," you can't verify if what they say is true. Tuskbase solves both:

- 🧠 **Persistent Memory** — Agent remembers across sessions via MemWal on Walrus
- 🔍 **Verifiable Provenance** — Every fact has on-chain proof: source URL, content hash, timestamp
- 📸 **Source Snapshots** — Original page content stored on Walrus as evidence
- 📊 **Trust Scoring** — Sources rated 1-10 based on domain authority
- 📚 **Public Knowledge Bases** — Publish and share verified research with the world
- 🤖 **Autonomous Agent** — Uses Tatum MCP for direct blockchain interactions

---

## 🎯 Key Features

### 🔍 AI Research Agent
- Ask any research question → agent searches the web via Tavily
- AI extracts key facts and summarizes findings
- Each fact stored individually with full provenance chain
- Streaming responses with source citations

### 🧠 Verifiable Memory (MemWal + Walrus)
- All memories stored on Walrus decentralized storage via MemWal SDK
- Semantic search for relevant recall across sessions
- End-to-end encrypted, user-owned memory
- Content-addressable — same content = same blob ID

### 📸 Source Snapshots
- When agent finds a source, the **full page content** is stored on Walrus
- This proves what the source said at the time of research
- Even if the source page changes or goes offline, the snapshot remains

### 🔗 On-Chain Provenance (Sui Smart Contract)
- Custom Move smart contract records every memory on-chain
- Stores: blob ID, snapshot blob ID, source URL, content hash, trust score, timestamp
- Anyone can verify by checking the Sui transaction
- Knowledge bases as Sui objects owned by the researcher

### 📊 Trust Scoring
- Automatic scoring based on source domain authority
- `.gov` / `.edu` = 10, official docs = 9, blogs = 5-6, social = 3-4
- Visible in UI — users know which facts are most reliable

### 📚 Public Knowledge Bases
- Group memories into knowledge bases
- Publish to make publicly verifiable
- Anyone can browse, verify sources, and build on top

---

## 📋 How It Works

1. 🔎 **Ask** — User asks the agent to research a topic
2. 🌐 **Search** — Agent searches the web via Tavily API
3. 🤖 **Extract** — AI extracts key facts from each source
4. 📸 **Snapshot** — Original page content stored on Walrus
5. 🧠 **Remember** — Facts stored in MemWal for semantic recall
6. 🔗 **Record** — Provenance metadata recorded on Sui via Tatum RPC
7. ✅ **Verify** — Anyone can verify any memory's authenticity on-chain

---

## 🧩 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend (Next.js 16)                    │
│  Research Chat → Memory Explorer → Verify → Knowledge    │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (Hono + TypeScript)                  │
│                                                          │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Search   │  │ AI           │  │ Provenance        │  │
│  │ (Tavily) │  │ (OpenAI)     │  │ (Hash + Score)    │  │
│  └──────────┘  └──────────────┘  └───────────────────┘  │
│                                                          │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ MemWal   │  │ Walrus       │  │ Tatum             │  │
│  │ (Memory) │  │ (Snapshots)  │  │ (Sui RPC)         │  │
│  └────┬─────┘  └──────┬───────┘  └────────┬──────────┘  │
└───────┼────────────────┼──────────────────┼─────────────┘
        │                │                  │
        ▼                ▼                  ▼
┌──────────────┐ ┌──────────────┐  ┌──────────────────┐
│   Walrus     │ │   Walrus     │  │   Sui Blockchain │
│  (memories)  │ │ (snapshots)  │  │  (smart contract)│
│  via MemWal  │ │  via HTTP    │  │  via Tatum RPC   │
└──────────────┘ └──────────────┘  └──────────────────┘
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, Tailwind CSS v4, shadcn/ui, TypeScript |
| Backend | Hono, TypeScript, Zod validation |
| AI | OpenAI GPT-4o-mini |
| Memory | MemWal SDK (`@mysten-incubation/memwal`) |
| Storage | Walrus HTTP API (publisher/aggregator) |
| Blockchain | Sui (Move smart contracts) |
| RPC | Tatum Sui RPC Gateway |
| Search | Tavily API |

---

## 🧩 Project Structure

```
tuskbase/
├── frontend/                     # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                  # Routes (Research, Memories, Knowledge, Verify)
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui primitives
│   │   │   ├── chat/           # Chat message, input
│   │   │   ├── memory/         # Memory card, detail view
│   │   │   └── layout/         # Sidebar, theme toggle
│   │   ├── hooks/               # useChat, useMemories, useVerification
│   │   ├── services/            # Mock data (replaced by real API)
│   │   ├── types/               # TypeScript interfaces
│   │   ├── constants/           # App config, trust thresholds
│   │   └── lib/                 # Formatters, utilities
│   └── Makefile
├── backend/                      # Backend (Hono)
│   ├── src/
│   │   ├── config/              # Environment, constants
│   │   ├── types/               # Domain types
│   │   ├── services/            # External integrations
│   │   │   ├── search.service.ts    # Tavily web search
│   │   │   ├── ai.service.ts        # OpenAI summarization
│   │   │   ├── walrus.service.ts    # Walrus blob storage
│   │   │   ├── memwal.service.ts    # MemWal memory layer
│   │   │   ├── tatum.service.ts     # Tatum Sui RPC
│   │   │   └── provenance.service.ts # Hashing + trust scoring
│   │   ├── usecases/            # Business logic orchestration
│   │   │   ├── research.usecase.ts  # Search → Store → Record
│   │   │   ├── verify.usecase.ts    # On-chain verification
│   │   │   └── recall.usecase.ts    # Semantic memory recall
│   │   ├── routes/              # API endpoints
│   │   ├── container.ts         # Dependency injection
│   │   └── index.ts             # App entry point
│   └── Makefile
├── contracts/                    # Smart Contract (Move)
│   └── tuskbase/
│       ├── sources/
│       │   ├── knowledge_base.move  # KB lifecycle
│       │   └── memory.move          # Memory storage + provenance
│       └── tests/
│           └── tuskbase_tests.move  # 8 tests
├── research/                     # Hackathon research docs
└── README.md
```

---

## 🧭 How to Run

### 📦 Prerequisites
- Node.js 18+
- Sui CLI (for smart contract)
- API keys: OpenAI, Tavily, Tatum

### 🔨 1. Clone Repository

```bash
git clone https://github.com/yebology/tuskbase.git
cd tuskbase
```

### 🔐 2. Configure Environment

```bash
cp backend/.env.example backend/.env
# Fill in: OPENAI_API_KEY, TAVILY_API_KEY, TATUM_API_KEY, MEMWAL credentials
```

### 🚀 3. Start Backend

```bash
cd backend
make install
make dev
# Server runs on http://localhost:8000
```

### 🌐 4. Start Frontend

```bash
cd frontend
make install
make dev
# App runs on http://localhost:3000
```

### ⚓ 5. Deploy Smart Contract (Testnet)

```bash
cd contracts/tuskbase
sui move build
sui client publish --gas-budget 100000000
```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|------------|
| `PORT` | Backend server port (default: 8000) |
| `OPENAI_API_KEY` | OpenAI API key for GPT-4o-mini |
| `MEMWAL_PRIVATE_KEY` | Ed25519 private key for MemWal |
| `MEMWAL_ACCOUNT_ID` | MemWal account ID |
| `MEMWAL_RELAYER_URL` | MemWal relayer endpoint |
| `WALRUS_PUBLISHER_URL` | Walrus publisher for storing blobs |
| `WALRUS_AGGREGATOR_URL` | Walrus aggregator for reading blobs |
| `TATUM_API_KEY` | Tatum API key for Sui RPC |
| `TATUM_SUI_RPC` | Tatum Sui RPC gateway URL |
| `TAVILY_API_KEY` | Tavily API key for web search |
| `TUSKBASE_PACKAGE_ID` | Deployed smart contract package ID |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/api/health` | Health check + service status |
| POST | `/api/research` | Execute research query |
| POST | `/api/memory/recall` | Recall relevant memories |
| POST | `/api/memory/verify` | Verify memory on-chain |

---

## 🔥 Why Tuskbase?

| Without Tuskbase | With Tuskbase |
|------|--------|
| AI forgets everything between sessions | Persistent memory via MemWal on Walrus |
| "Trust me bro" — no way to verify AI claims | Every fact has on-chain proof |
| Sources disappear or change | Source snapshots stored permanently on Walrus |
| Knowledge locked in one platform | Public knowledge bases anyone can verify |
| Centralized memory (AWS, Redis) | Decentralized, user-owned memory |

---

## 🤝 Contributors

🧑 **Yobel Nathaniel Filipus**
- 🐙 Github: [@yebology](https://github.com/yebology)
- 💼 LinkedIn: [View Profile](https://linkedin.com/in/yobelnathanielfilipus)

---

## ⚠️ Disclaimer

Tuskbase is a hackathon project demonstrating verifiable AI memory on decentralized infrastructure. Trust scores are heuristic-based and do not guarantee content accuracy. Always verify critical information independently.

---

## 📄 License

MIT License
