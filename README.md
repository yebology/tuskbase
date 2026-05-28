# 🦭 Tuskbase

> **AI research agent with verifiable reports — every finding stored on Walrus with cryptographic proof on Sui.**

## 🎬 Demo Video

[![Tuskbase Demo](https://img.shields.io/badge/Watch%20Demo-YouTube-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=pxf4NT5lXrk)

---

**Tuskbase** is a verifiable AI research agent. Ask it any question — it searches up to 20 real sources, extracts key facts, generates a professional PDF report, and records the proof on the Sui blockchain via Tatum RPC.

Unlike ChatGPT where sources sometimes don't even exist, Tuskbase actually visits every website and stores the evidence permanently on Walrus. Anyone can verify the report hasn't been tampered with by checking the on-chain hash.

---

## ✨ How It Works

1. 🔎 **Ask** — Type a research question
2. 🌐 **Search** — Agent searches up to 20 real sources via Tavily
3. 🤖 **Extract** — AI pulls out 3-5 key facts per source with trust scores
4. 🧠 **Remember** — Facts stored in MemWal for semantic recall
5. 📄 **Report** — Full PDF generated (summary, findings, analysis, sources, provenance)
6. 🐋 **Store** — PDF stored permanently on Walrus
7. 🔗 **Prove** — Report hash recorded on Sui via Tatum RPC (1 transaction)
8. ✅ **Verify** — Anyone can check the on-chain hash matches the PDF

---

## 🎯 Key Features

### 📄 Deep Research Reports
- Up to 20 sources analyzed per query
- 3-5 facts extracted per source with AI
- Professional PDF with: executive summary, key findings, detailed analysis, sources, provenance
- Trust scoring (1-10) based on source domain authority

### 🐋 Decentralized Storage (Walrus)
- PDF reports stored permanently on Walrus
- All facts stored in MemWal for semantic recall across sessions
- Content-addressable — tamper-proof by design

### 🔗 On-Chain Provenance (Sui)
- 1 Sui transaction per research report
- Stores: report hash, blob ID, timestamp
- Anyone can verify report authenticity on-chain
- Smart contract enforces access control and data integrity

### 🤖 AI Agent with Blockchain Tools (Tatum MCP)
| User asks... | Agent uses... |
|---|---|
| "Research Walrus storage" | Tavily → OpenAI → Walrus → Sui |
| "What's the SUI price?" | Tatum MCP Data API |
| "Show portfolio of 0xabc..." | Tatum MCP Data API |

---

## 🧩 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend (Next.js 16)                    │
│              Research Chat → PDF Download                 │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (Hono + TypeScript)                  │
│                                                          │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Search   │  │ AI           │  │ PDF Generator     │  │
│  │ (Tavily) │  │ (OpenAI)     │  │ (PDFKit)          │  │
│  └──────────┘  └──────────────┘  └───────────────────┘  │
│                                                          │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ MemWal   │  │ Walrus       │  │ Tatum             │  │
│  │ (Memory) │  │ (Storage)    │  │ (Sui RPC)         │  │
│  └────┬─────┘  └──────┬───────┘  └────────┬──────────┘  │
└───────┼────────────────┼──────────────────┼─────────────┘
        │                │                  │
        ▼                ▼                  ▼
┌──────────────┐ ┌──────────────┐  ┌──────────────────┐
│   Walrus     │ │   Walrus     │  │   Sui Blockchain │
│  (memories)  │ │ (PDF reports)│  │  (provenance)    │
│  via MemWal  │ │  via HTTP    │  │  via Tatum RPC   │
└──────────────┘ └──────────────┘  └──────────────────┘
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, shadcn/ui |
| Backend | Hono, TypeScript, PDFKit, Prisma, PostgreSQL |
| AI | OpenAI GPT-4o-mini (intent routing + extraction + report generation) |
| Memory | MemWal SDK (`@mysten-incubation/memwal`) |
| Storage | Walrus HTTP API (PDF reports + snapshots) |
| Blockchain | Sui (Move smart contracts) |
| RPC | Tatum Sui RPC Gateway |
| Data API | Tatum MCP (`@tatumio/blockchain-mcp`) |
| Search | Tavily API (up to 20 sources per query) |
| Wallet | @mysten/dapp-kit-react |

---

## 🧩 Project Structure

```
tuskbase/
├── frontend/                     # Next.js — single-page research UI
│   ├── src/
│   │   ├── app/page.tsx          # Main page (sessions + chat + PDF download)
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui primitives
│   │   │   ├── chat/           # Chat message, input, report download
│   │   │   └── layout/         # Theme toggle, wallet connect
│   │   ├── hooks/use-chat.ts    # Chat sessions + API calls
│   │   ├── services/api.ts      # Backend API client
│   │   └── types/               # TypeScript interfaces
│   └── Makefile
├── backend/                      # Hono — API + research orchestration
│   ├── src/
│   │   ├── config/              # Environment, constants
│   │   ├── services/            # External integrations
│   │   │   ├── search.service.ts    # Tavily (20 sources)
│   │   │   ├── ai.service.ts        # OpenAI (extract + summarize + analyze)
│   │   │   ├── pdf.service.ts       # PDFKit (report generation)
│   │   │   ├── walrus.service.ts    # Walrus (blob storage)
│   │   │   ├── memwal.service.ts    # MemWal (semantic memory)
│   │   │   ├── tatum.service.ts     # Tatum Sui RPC (transactions)
│   │   │   └── tatum-mcp.service.ts # Tatum MCP (blockchain queries)
│   │   ├── usecases/
│   │   │   ├── research.usecase.ts  # Search → Extract → PDF → Store → Prove
│   │   │   ├── verify.usecase.ts    # On-chain verification
│   │   │   └── recall.usecase.ts    # Semantic memory recall
│   │   ├── routes/              # API endpoints
│   │   ├── container.ts         # Dependency injection
│   │   └── index.ts             # Entry point
│   └── Makefile
├── contracts/                    # Move smart contract (Sui)
│   └── tuskbase/
│       ├── sources/
│       │   ├── knowledge_base.move  # KB lifecycle
│       │   └── memory.move          # Memory/report provenance
│       └── tests/
└── docker-compose.yml
```

---

## 🧭 How to Run

### Prerequisites
- Node.js 18+
- Sui CLI (for smart contract)
- API keys: OpenAI, Tavily, Tatum

### 1. Clone

```bash
git clone https://github.com/yebology/tuskbase.git
cd tuskbase
```

### 2. Configure

```bash
cp backend/.env.example backend/.env
# Fill in: OPENAI_API_KEY, TAVILY_API_KEY, TATUM_API_KEY, MEMWAL credentials
```

### 3. Start Backend

```bash
cd backend
make install
make dev
# http://localhost:8000
```

### 4. Start Frontend

```bash
cd frontend
make install
make dev
# http://localhost:3000
```

### 5. Deploy Contract (optional)

```bash
cd contracts/tuskbase
sui move build --build-env testnet
sui client test-publish --gas-budget 100000000 --build-env testnet
```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|------------|
| `PORT` | Backend port (default: 8000) |
| `DATABASE_URL` | PostgreSQL connection |
| `OPENAI_API_KEY` | OpenAI API key |
| `MEMWAL_PRIVATE_KEY` | Ed25519 key for MemWal |
| `MEMWAL_ACCOUNT_ID` | MemWal account |
| `WALRUS_PUBLISHER_URL` | Walrus publisher endpoint |
| `WALRUS_AGGREGATOR_URL` | Walrus aggregator endpoint |
| `TATUM_API_KEY` | Tatum API key |
| `TATUM_SUI_RPC` | Tatum Sui RPC gateway |
| `TAVILY_API_KEY` | Tavily search API key |
| `TUSKBASE_PACKAGE_ID` | Deployed contract package ID |
| `SUI_PRIVATE_KEY` | Sui keypair for signing |
| `DEFAULT_KNOWLEDGE_BASE_ID` | Default KB object ID on Sui |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/api/health` | Health check |
| POST | `/api/research` | Deep research → returns summary + PDF link |
| POST | `/api/memory/recall` | Semantic memory recall |
| POST | `/api/memory/verify` | Verify report on-chain |

---

## 🔥 Why Tuskbase?

| Without Tuskbase | With Tuskbase |
|------|--------|
| AI gives you text you have to trust | Every claim backed by real sources |
| Sources sometimes don't exist | Agent actually visits up to 20 real websites |
| No way to verify after the fact | On-chain hash proves report is authentic |
| Knowledge locked in one platform | PDF + Walrus = permanent, decentralized |
| Forgets between sessions | MemWal remembers across sessions |

---

## 🤝 Contributors

🧑 **Yobel Nathaniel Filipus**
- 🐙 Github: [@yebology](https://github.com/yebology)
- 💼 LinkedIn: [View Profile](https://linkedin.com/in/yobelnathanielfilipus)

---

## ⚠️ Disclaimer

Tuskbase is a hackathon project demonstrating verifiable AI research on decentralized infrastructure. Trust scores are heuristic-based and do not guarantee content accuracy. Always verify critical information independently.

---

## 📄 License

MIT License
