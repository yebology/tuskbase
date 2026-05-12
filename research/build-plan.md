# 🏗️ Build Plan — Verifiable Knowledge Agent

## Project Name: **WalrusKnow** (working title)

> AI research agent yang menyimpan findings di Walrus dengan verifiable provenance on-chain, powered by Tatum.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14 + Tailwind + shadcn/ui | Fast, polished, SSR |
| **AI/LLM** | Vercel AI SDK + OpenAI GPT-4o-mini | Cheap, fast, integrates with MemWal middleware |
| **Memory** | MemWal SDK (`@mysten-incubation/memwal`) | Persistent AI memory on Walrus |
| **Storage** | Walrus HTTP API (publisher/aggregator) | Content snapshots |
| **Blockchain** | @mysten/sui + Tatum RPC | All Sui transactions via Tatum |
| **Tatum MCP** | @tatumio/blockchain-mcp | AI agent ↔ blockchain bridge |
| **Search** | Tavily API (free tier) | Web research sources |
| **Smart Contract** | Move (Sui) | Knowledge base management on-chain |
| **Deploy** | Vercel (frontend) + Sui Mainnet | Production-ready |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                     │
│                                                          │
│  ┌──────────┐  ┌───────────────┐  ┌──────────────────┐ │
│  │ Chat UI  │  │ Memory Explorer│  │ Knowledge Verify │ │
│  │          │  │ (browse/search)│  │ (public view)    │ │
│  └────┬─────┘  └───────┬───────┘  └────────┬─────────┘ │
└───────┼─────────────────┼──────────────────┼────────────┘
        │                 │                  │
┌───────▼─────────────────▼──────────────────▼────────────┐
│                  BACKEND (Next.js API Routes)             │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │              AI Agent Core                           ││
│  │  ┌──────────┐ ┌───────────┐ ┌────────────────────┐ ││
│  │  │ Research  │ │ Summarize │ │ Provenance Manager │ ││
│  │  │ (Tavily)  │ │ (OpenAI)  │ │ (hash + metadata)  │ ││
│  │  └──────────┘ └───────────┘ └────────────────────┘ ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ MemWal   │  │ Walrus HTTP  │  │ Tatum MCP/RPC    │  │
│  │ SDK      │  │ (snapshots)  │  │ (Sui txns)       │  │
│  └────┬─────┘  └──────┬───────┘  └────────┬─────────┘  │
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

## Smart Contract (Move)

```move
module walrus_know::knowledge_base {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::transfer;
    use sui::table::{Self, Table};
    use sui::clock::Clock;
    use std::string::String;

    /// A Knowledge Base owned by a user
    public struct KnowledgeBase has key, store {
        id: UID,
        name: String,
        owner: address,
        created_at: u64,
        memory_count: u64,
        is_public: bool,
        trust_score_total: u64,
    }

    /// A Memory entry with provenance
    public struct MemoryEntry has key, store {
        id: UID,
        kb_id: ID,
        blob_id: String,          // Walrus blob ID for the memory content
        snapshot_blob_id: String,  // Walrus blob ID for source snapshot
        source_url: String,
        source_domain: String,
        content_hash: vector<u8>, // SHA-256 of original content
        timestamp: u64,
        trust_score: u8,          // 1-10 based on source quality
    }

    /// Create a new knowledge base
    public entry fun create_kb(...) { ... }

    /// Add a memory with provenance
    public entry fun add_memory(...) { ... }

    /// Publish knowledge base (make public)
    public entry fun publish_kb(...) { ... }

    /// Verify a memory (anyone can call)
    public entry fun verify_memory(...) { ... }
}
```

---

## Core Flows

### Flow 1: Research & Store

```
1. User: "Research DeFi protocols on Sui"
2. Agent → Tavily API: search("DeFi protocols Sui 2026")
3. Tavily returns 5-10 results with URLs + snippets
4. Agent → OpenAI: summarize each result, extract key facts
5. For each fact:
   a. Agent → Walrus HTTP: store source page snapshot → get snapshot_blob_id
   b. Agent → MemWal: remember(fact + metadata) → stored encrypted on Walrus
   c. Agent → Tatum RPC → Sui smart contract: add_memory(blob_id, source_url, hash, trust_score)
6. Agent → User: "Found 8 key findings. Here's the summary..."
```

### Flow 2: Recall & Verify

```
1. User: "What do you know about Sui DeFi?"
2. Agent → MemWal: recall("Sui DeFi", limit=10)
3. MemWal returns matching memories with metadata
4. Agent → User: shows findings with source links + trust scores
5. User clicks "Verify" on any memory:
   → Shows Sui transaction (via Tatum Data API)
   → Shows original snapshot from Walrus
   → Shows content hash match
```

### Flow 3: Publish Knowledge Base

```
1. User: "Publish this knowledge base"
2. Agent → Tatum RPC → Sui contract: publish_kb(kb_id)
3. Knowledge base becomes publicly viewable
4. Anyone can:
   → Browse memories
   → Verify sources
   → See trust scores
   → Fork and build on top
```

---

## Project Structure

```
walrus-know/
├── apps/
│   └── web/                    # Next.js frontend
│       ├── app/
│       │   ├── page.tsx        # Landing page
│       │   ├── chat/           # Chat UI (main research interface)
│       │   ├── explore/        # Memory explorer
│       │   ├── verify/[id]/    # Public verification page
│       │   └── api/
│       │       ├── research/   # Research endpoint
│       │       ├── memory/     # Memory CRUD
│       │       └── verify/     # Verification endpoint
│       ├── components/
│       │   ├── chat/           # Chat components
│       │   ├── memory/         # Memory display components
│       │   └── verify/         # Verification UI
│       └── lib/
│           ├── memwal.ts       # MemWal SDK wrapper
│           ├── walrus.ts       # Walrus HTTP client (snapshots)
│           ├── tatum.ts        # Tatum RPC/MCP client
│           ├── ai.ts           # OpenAI + agent logic
│           ├── provenance.ts   # Hash, metadata, trust scoring
│           └── sui.ts          # Sui transaction helpers
├── contracts/
│   └── walrus_know/            # Move smart contract
│       ├── sources/
│       │   └── knowledge_base.move
│       └── Move.toml
├── .env.example
├── package.json
├── Makefile
└── README.md
```

---

## Environment Variables

```env
# AI
OPENAI_API_KEY=sk-...

# MemWal
MEMWAL_PRIVATE_KEY=<ed25519-private-key>
MEMWAL_ACCOUNT_ID=<account-id>
MEMWAL_RELAYER_URL=https://relayer.memwal.ai
MEMWAL_NAMESPACE=walrus-know

# Walrus (for snapshots)
WALRUS_PUBLISHER_URL=https://publisher.walrus.site
WALRUS_AGGREGATOR_URL=https://aggregator.walrus.site

# Tatum
TATUM_API_KEY=<from-dashboard.tatum.io>
TATUM_SUI_RPC=https://sui-mainnet.gateway.tatum.io

# Tavily (web search)
TAVILY_API_KEY=<from-tavily.com>

# Sui
SUI_NETWORK=mainnet
KNOWLEDGE_BASE_PACKAGE_ID=<after-deploy>
```

---

## Build Phases

### Phase 1: Foundation (Day 1-3)
- [ ] Project setup (Next.js + Tailwind + shadcn/ui)
- [ ] Makefile with all targets
- [ ] MemWal SDK integration — test remember/recall
- [ ] Tatum RPC connection — test basic Sui queries
- [ ] Walrus HTTP client — test store/retrieve blob
- [ ] OpenAI + Tavily integration — test search + summarize
- [ ] Basic chat UI

### Phase 2: Smart Contract (Day 4-5)
- [ ] Write Move smart contract (KnowledgeBase, MemoryEntry)
- [ ] Deploy to Sui Testnet via Tatum RPC
- [ ] Test create_kb, add_memory, publish_kb functions
- [ ] Integrate contract calls into backend

### Phase 3: Core Agent Logic (Day 6-8)
- [ ] Research flow: search → summarize → store with provenance
- [ ] Content snapshot: fetch page → store on Walrus → link to memory
- [ ] Provenance manager: hash content, compute trust score, record on-chain
- [ ] Recall flow: query MemWal → enrich with on-chain metadata
- [ ] Tatum MCP integration for autonomous blockchain interactions

### Phase 4: Frontend Polish (Day 9-11)
- [ ] Chat interface (streaming responses)
- [ ] Memory explorer (browse, search, filter by trust score)
- [ ] Verification page (public, shows provenance chain)
- [ ] Knowledge base publish flow
- [ ] Public knowledge base viewer
- [ ] Responsive design + dark mode

### Phase 5: Deploy & Demo (Day 12-14)
- [ ] Deploy smart contract to Sui Mainnet
- [ ] Deploy frontend to Vercel
- [ ] End-to-end testing on mainnet
- [ ] Record 2-3 min demo video
- [ ] Write README with setup instructions
- [ ] Share on X/LinkedIn tagging @Tatum_io @WalrusFoundation @SuiNetwork
- [ ] Submit via official form

---

## Trust Score Algorithm

```typescript
function calculateTrustScore(sourceUrl: string): number {
  const domain = new URL(sourceUrl).hostname;
  
  // Tier 1: Highest trust (score 9-10)
  if (domain.endsWith('.gov') || domain.endsWith('.edu')) return 10;
  if (['nature.com', 'science.org', 'arxiv.org'].includes(domain)) return 9;
  
  // Tier 2: High trust (score 7-8)
  if (['docs.sui.io', 'docs.wal.app', 'tatum.io'].includes(domain)) return 8;
  if (domain.endsWith('.org')) return 7;
  
  // Tier 3: Medium trust (score 5-6)
  if (['medium.com', 'dev.to', 'hackernoon.com'].includes(domain)) return 6;
  if (domain.includes('blog')) return 5;
  
  // Tier 4: Lower trust (score 3-4)
  if (['reddit.com', 'twitter.com', 'x.com'].includes(domain)) return 4;
  
  // Default
  return 5;
}
```

---

## Demo Script (2-3 min)

```
0:00 - 0:20  "The problem: AI agents forget everything. And when they 
              remember, you can't verify if what they say is true."

0:20 - 0:40  "WalrusKnow: an AI research agent with verifiable memory.
              Every fact it learns is stored on Walrus with cryptographic
              proof of its source."

0:40 - 1:30  LIVE DEMO:
              - Ask agent to research "Walrus protocol storage"
              - Show it searching, finding sources, storing memories
              - Show memories appearing in explorer with trust scores
              - Close session, reopen → agent still remembers

1:30 - 2:00  VERIFICATION DEMO:
              - Click "Verify" on a memory
              - Show: source URL, timestamp on Sui, content hash match
              - Show: original page snapshot stored on Walrus
              - "Anyone can verify this — it's all on-chain"

2:00 - 2:20  PUBLISH DEMO:
              - Publish knowledge base
              - Show public URL anyone can access and verify

2:20 - 2:45  TECH STACK:
              - "Built with MemWal for AI memory on Walrus"
              - "Tatum MCP for autonomous blockchain interactions"
              - "Custom Move smart contract for knowledge management"
              - "Deployed on Sui Mainnet"

2:45 - 3:00  "WalrusKnow: AI that doesn't just remember — it proves
              what it knows. Built on Walrus, powered by Tatum."
```

---

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "@mysten-incubation/memwal": "latest",
    "@mysten/sui": "latest",
    "@tatumio/blockchain-mcp": "latest",
    "ai": "^4.0.0",
    "@ai-sdk/openai": "latest",
    "tavily": "latest",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "latest"
  }
}
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| MemWal SDK beta issues | Fallback: use raw Walrus HTTP API + own memory indexing |
| Tatum MCP doesn't support Sui well | Fallback: use Tatum RPC directly (still counts) |
| Move contract bugs | Deploy to testnet first, mainnet last 2 days |
| Tavily free tier limit (1000 req) | Cache results, limit to 5 searches per research task |
| Demo breaks live | Pre-record backup video, have cached demo data |
| Mainnet costs | Budget ~$5-10 SUI for storage + gas |

---

## Submission Checklist

- [ ] GitHub repo with clean code + comprehensive README
- [ ] Tatum API key used (visible in code/config)
- [ ] Tatum Sui RPC endpoints used (not generic nodes)
- [ ] Walrus storage as core functionality (MemWal + snapshots)
- [ ] Move smart contract deployed on Sui Mainnet
- [ ] 2-3 min demo video (clear, professional)
- [ ] Shared on X/LinkedIn tagging @Tatum_io @WalrusFoundation @SuiNetwork
- [ ] Submitted via official form by June 6, 17:00 UTC
