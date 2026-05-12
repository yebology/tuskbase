# 💡 Idea Research — Tatum x Walrus Hackathon

## Phase 1: ENGAGE — Problem Framing

### Step 0: Competition Intelligence Recap

**Judging Criteria (from hackathon page):**
| Criteria | Weight |
|----------|--------|
| Walrus & Tatum Integration | 30% |
| Technical Quality | 30% |
| Creativity | 20% |
| Presentation | 20% |

**Special Prizes (stackable):**
- 🌟 Best Walrus Integration — $200
- ⚡ Best Use of Tatum Tools — $200

**Key Insight:** 60% of the score is about HOW WELL you integrate Walrus + Tatum. The winning project must demonstrate deep, meaningful use of both — not a thin wrapper.

**What "meaningful Walrus integration" means:** Walrus must be core functionality. The hackathon page explicitly states: "your project must use Walrus as part of its core functionality, not just as an add-on."

**What "Best Use of Tatum Tools" means:** Effectively leveraging Tatum's RPC endpoints, Data APIs, OR MCP server.

**Organizer Alignment:**
- Tatum = enterprise-grade blockchain infrastructure company (RPC, APIs, webhooks)
- Walrus Foundation = decentralized storage protocol on Sui
- Sui Network = L1 blockchain with object-centric model

**What they want to see:** Real applications that prove Walrus + Tatum are production-ready infrastructure for building dApps.

---

### Step 1: Big Idea & Essential Questions

**Big Idea:** *Verifiable, persistent data ownership in the AI agent era*

**Essential Questions:**
1. How can AI agents maintain trustworthy memory without centralized databases?
2. How can users own and control their data while still benefiting from AI services?
3. How can decentralized storage become the backbone of autonomous systems?
4. What happens when AI agents need to prove what they know and where they learned it?
5. How can we make decentralized storage feel as seamless as centralized alternatives?

**Challenge Statement:** Build an application that uses Walrus as a verifiable, decentralized data layer — powered by Tatum's Sui infrastructure — to solve a real problem in AI, content, or data ownership.

---

### Step 2: Problem Discovery

**Key trends discovered in research:**

1. **AI Agent Memory Crisis** — AI agents process 18% of all on-chain stablecoin volume (up from 4% in Q1 2025). 17,000+ on-chain agents hold balances on Virtuals Protocol alone. But they have NO persistent memory. Every session starts from scratch. [Source: [archyde.com](https://www.archyde.com/ai-agents-and-the-rise-of-agentic-finance-use-cases-risks-and-expert-insights-on-crypto-as-the-financial-backbone/)]

2. **MemWal Already Exists** — Walrus shipped MemWal (AI memory SDK) on March 25, 2026. This is DIRECTLY relevant to the hackathon. It provides persistent, verifiable memory for AI agents on Walrus. [Source: [docs.memwal.ai](https://docs.memwal.ai), [blog.walrus.xyz](https://blog.walrus.xyz/memwal-long-term-memory-for-ai-agents/)]

3. **Creator Trust Declining in SEA** — Influencer marketing drives $46B in SEA ecommerce, but trust is declining. 76% of Indonesians shop through creators despite declining trust (7% drop YoY for mega influencers). [Source: [marketing-interactive.com](https://www.marketing-interactive.com/study-76-of-indonesians-shop-through-creators-despite-declining-trust)]

4. **Seal + Walrus = Encrypted Access Control** — Seal (launched mainnet 2025) provides decentralized encryption + access control for data stored on Walrus. This enables private data sharing with programmable permissions. [Source: [seal.mystenlabs.com](https://seal.mystenlabs.com)]

5. **Content Provenance Problem** — Deepfakes and AI-generated content make authenticity verification critical. Blockchain-backed perceptual hashing registries are being researched. [Source: [arxiv.org](https://arxiv.org/html/2602.02412v1)]

6. **Decentralized Credentials** — 95% of employers say microcredentials benefit candidates. Blockchain verifiable credentials (W3C VCs + DIDs) are gaining traction for portable proof of skills. [Source: [upscend.com](https://www.upscend.com/blogs/why-2026-will-unlock-verifiable-skills-via-blockchain)]

---

## Phase 2: INVESTIGATE — Ideation

### Step 4: Technology Fit Analysis

**Available Tech Stack:**
- **Walrus** — Decentralized blob storage (HTTP API + TypeScript SDK)
- **MemWal** — AI memory SDK built on Walrus (TypeScript SDK, relayer, smart contract, indexer)
- **Seal** — Encryption + access control for Walrus data
- **Tatum RPC** — Sui blockchain access (mainnet/testnet/devnet)
- **Tatum Data APIs** — On-chain data queries
- **Tatum MCP** — AI-powered blockchain interactions
- **Sui** — L1 blockchain with Move smart contracts, object-centric model

---

### Step 5: Idea Generation & Scoring

**Judging Criteria Weights:**
- Walrus & Tatum Integration: 30%
- Technical Quality: 30%
- Creativity: 20%
- Presentation: 20%

---

## 💡 Idea 1: AI Research Agent with Verifiable Memory (MemWal + Tatum MCP)

**Concept:** An AI research assistant that stores its findings, sources, and reasoning chains on Walrus via MemWal. Users can verify what the AI "knows," where it learned it, and share knowledge bases between agents. Uses Tatum MCP for blockchain interactions.

**How it works:**
1. User asks AI agent to research a topic
2. Agent searches, synthesizes, and stores findings as structured memory blobs on Walrus
3. Each memory has provenance (source URLs, timestamps, confidence scores)
4. Users can query the agent's memory, verify sources, and export knowledge
5. Memory persists across sessions — agent gets smarter over time
6. Multiple agents can share a knowledge base via Walrus

**Walrus Integration (Deep):**
- All agent memory stored as blobs on Walrus
- MemWal SDK for structured memory operations
- Knowledge base = collection of Walrus blobs with metadata
- Provenance chain stored on-chain via Sui objects

**Tatum Integration (Deep):**
- Tatum MCP server for AI ↔ blockchain interactions
- Tatum RPC for all Sui transactions (storing memory, reading state)
- Tatum Data APIs for querying on-chain memory metadata

**Scoring:**

| Criteria | Score (1-10) | Weight | Weighted |
|----------|-------------|--------|----------|
| Walrus & Tatum Integration | 9 | 30% | 2.7 |
| Technical Quality | 8 | 30% | 2.4 |
| Creativity | 9 | 20% | 1.8 |
| Presentation | 9 | 20% | 1.8 |
| **Total** | | | **8.7** |

**Pros:**
- Uses MemWal (Walrus's own AI memory product) — judges will love this alignment
- Tatum MCP is "encouraged" — using it well wins Best Tatum Tools prize
- Extremely demo-friendly ("watch the AI remember and cite sources")
- Novel — few projects combine AI memory + decentralized storage + provenance
- Aligns with Walrus's strategic direction (they literally built MemWal for this)

**Cons:**
- MemWal is in beta — potential SDK issues
- Requires AI/LLM integration (API costs, complexity)
- May feel "too aligned" with existing Walrus product (less original?)

---

## 💡 Idea 2: Decentralized Content Vault with AI Verification

**Concept:** A platform where creators store their original content (images, videos, documents) on Walrus with cryptographic timestamps. An AI agent (via Tatum MCP) can verify content authenticity by comparing against the stored originals. Seal provides encrypted access control.

**How it works:**
1. Creator uploads content → stored on Walrus with timestamp + hash
2. Content gets a "proof of originality" certificate (Sui object)
3. Anyone can verify if content is authentic by checking against Walrus-stored original
4. AI agent can detect modifications/deepfakes by comparing perceptual hashes
5. Creators control access via Seal (some content public, some gated)

**Walrus Integration (Deep):**
- All original content stored as Walrus blobs
- Perceptual hashes stored alongside for comparison
- Seal encryption for private/gated content
- Content metadata as Sui objects

**Tatum Integration (Deep):**
- Tatum RPC for all Sui transactions
- Tatum MCP for AI-powered verification
- Tatum Data APIs for querying content certificates

**Scoring:**

| Criteria | Score (1-10) | Weight | Weighted |
|----------|-------------|--------|----------|
| Walrus & Tatum Integration | 9 | 30% | 2.7 |
| Technical Quality | 7 | 30% | 2.1 |
| Creativity | 8 | 20% | 1.6 |
| Presentation | 8 | 20% | 1.6 |
| **Total** | | | **8.0** |

**Pros:**
- Real-world problem (deepfakes, content theft)
- Deep Walrus usage (content IS the storage)
- Seal integration shows mastery of Sui stack
- Good demo: upload → verify → show tamper detection

**Cons:**
- AI verification of images/video is complex to build in 14 days
- Seal adds complexity (another SDK to learn)
- Content verification is a crowded space conceptually

---

## 💡 Idea 3: Decentralized Knowledge Marketplace

**Concept:** A marketplace where experts create and sell knowledge packages (tutorials, datasets, research) stored on Walrus. Buyers pay via Sui, and access is controlled by Seal. AI agent helps curate and recommend content.

**How it works:**
1. Expert creates knowledge package → encrypted, stored on Walrus via Seal
2. Listing created as Sui object with price, description, preview
3. Buyer pays SUI → gets decryption access via Seal policy
4. AI agent (Tatum MCP) helps buyers find relevant content
5. Reviews and ratings stored on Walrus for transparency

**Walrus Integration (Deep):**
- All knowledge content stored on Walrus
- Encrypted via Seal with purchase-based access control
- Reviews/ratings as Walrus blobs
- Preview content (unencrypted) on Walrus

**Tatum Integration (Deep):**
- Tatum RPC for all Sui transactions (payments, listings)
- Tatum MCP for AI-powered content discovery
- Tatum Data APIs for marketplace analytics

**Scoring:**

| Criteria | Score (1-10) | Weight | Weighted |
|----------|-------------|--------|----------|
| Walrus & Tatum Integration | 8 | 30% | 2.4 |
| Technical Quality | 7 | 30% | 2.1 |
| Creativity | 7 | 20% | 1.4 |
| Presentation | 7 | 20% | 1.4 |
| **Total** | | | **7.3** |

**Pros:**
- Clear business model
- Uses Seal + Walrus together (impressive stack usage)
- Marketplace is easy to demo

**Cons:**
- Marketplace concept is not very novel
- Requires smart contract for payments (Move development)
- Seal integration adds significant complexity
- Less "wow factor" for judges

---

## 💡 Idea 4: On-Chain Game Save Cloud (Gaming + Walrus)

**Concept:** A decentralized "cloud save" system for games. Players own their game saves, stored on Walrus. Games can read/write save data via a simple SDK. Players can transfer saves between games, sell rare save states as NFTs.

**How it works:**
1. Game integrates SDK → saves game state to Walrus
2. Each save = Walrus blob owned by player's Sui address
3. Players can load saves from any device (decentralized)
4. Rare/impressive save states can be minted as NFTs
5. Cross-game compatibility for shared universes

**Walrus Integration (Deep):**
- All game saves stored as Walrus blobs
- Save metadata as Sui objects (owned by player)
- Version history via multiple blobs

**Tatum Integration (Moderate):**
- Tatum RPC for Sui transactions
- Tatum Data APIs for querying save metadata

**Scoring:**

| Criteria | Score (1-10) | Weight | Weighted |
|----------|-------------|--------|----------|
| Walrus & Tatum Integration | 7 | 30% | 2.1 |
| Technical Quality | 7 | 30% | 2.1 |
| Creativity | 8 | 20% | 1.6 |
| Presentation | 7 | 20% | 1.4 |
| **Total** | | | **7.2** |

**Pros:**
- Fun concept, easy to understand
- Gaming is hot in Sui ecosystem (EVE Frontier on Sui)
- Clear Walrus usage

**Cons:**
- Needs a game to demo (extra work)
- Tatum integration is shallow (just RPC)
- No AI angle (misses Tatum MCP bonus)
- Less impressive technically

---

## 💡 Idea 5: Decentralized Document Notary + AI Summarizer

**Concept:** Upload any document (contracts, agreements, certificates) → stored permanently on Walrus with timestamp proof. AI agent summarizes the document and extracts key terms. The notarized document + AI summary become a verifiable Sui object.

**How it works:**
1. User uploads document → stored on Walrus (permanent blob)
2. SHA-256 hash recorded on Sui as proof of existence at timestamp
3. AI agent (Tatum MCP) reads document, generates summary + key terms
4. Summary stored on Walrus alongside original
5. Anyone can verify: "this document existed at this time with this content"
6. Useful for: contracts, IP claims, academic papers, legal documents

**Walrus Integration (Deep):**
- Original documents stored permanently on Walrus
- AI summaries stored as companion blobs
- Document metadata (hash, timestamp, owner) as Sui objects
- Optional: Seal encryption for private documents

**Tatum Integration (Deep):**
- Tatum RPC for all Sui transactions
- Tatum MCP for AI document analysis
- Tatum Data APIs for querying notarized documents

**Scoring:**

| Criteria | Score (1-10) | Weight | Weighted |
|----------|-------------|--------|----------|
| Walrus & Tatum Integration | 9 | 30% | 2.7 |
| Technical Quality | 8 | 30% | 2.4 |
| Creativity | 7 | 20% | 1.4 |
| Presentation | 9 | 20% | 1.8 |
| **Total** | | | **8.3** |

**Pros:**
- Extremely clear value proposition (everyone understands notarization)
- Deep Walrus usage (documents ARE the storage)
- Tatum MCP for AI summarization (Best Tatum Tools prize)
- Easy to demo: upload → notarize → verify → show AI summary
- Real-world utility (legal, IP, academic)
- Technically achievable in 14 days

**Cons:**
- Notarization concept isn't super novel (exists in other chains)
- AI summarization is the creative differentiator — needs to be impressive
- Less "cutting edge" than AI agent memory

---

## 💡 Idea 6: Multi-Agent Collaboration Hub (MemWal + Tatum MCP)

**Concept:** A platform where multiple AI agents collaborate on tasks by sharing a decentralized knowledge base on Walrus. Each agent has its own memory (via MemWal) but can publish findings to a shared workspace. Users orchestrate agents and see their collaborative reasoning.

**How it works:**
1. User defines a research task (e.g., "analyze this DeFi protocol")
2. Multiple specialized agents are spawned (security agent, economics agent, code agent)
3. Each agent stores its findings in its own MemWal memory
4. Agents publish key findings to shared Walrus workspace
5. Agents can read each other's findings and build on them
6. User sees the collaborative reasoning chain with full provenance

**Walrus Integration (Deep):**
- MemWal for individual agent memory
- Shared workspace as Walrus blob collection
- Provenance chain for every finding
- Cross-agent knowledge sharing via Walrus

**Tatum Integration (Deep):**
- Tatum MCP for agent ↔ blockchain interactions
- Tatum RPC for all Sui transactions
- Tatum Data APIs for querying agent state

**Scoring:**

| Criteria | Score (1-10) | Weight | Weighted |
|----------|-------------|--------|----------|
| Walrus & Tatum Integration | 10 | 30% | 3.0 |
| Technical Quality | 7 | 30% | 2.1 |
| Creativity | 10 | 20% | 2.0 |
| Presentation | 8 | 20% | 1.6 |
| **Total** | | | **8.7** |

**Pros:**
- Maximum creativity score — multi-agent collaboration is bleeding edge
- Deepest possible Walrus integration (MemWal + shared storage)
- Deepest possible Tatum integration (MCP for every agent)
- Aligns perfectly with Walrus's MemWal vision
- Impressive to judges who understand AI trends

**Cons:**
- Most complex to build — risk of not finishing
- Multi-agent orchestration is hard to get right in 14 days
- Demo might be confusing if not presented clearly
- Depends on MemWal beta stability

---

## 📊 Final Ranking

| Rank | Idea | Score | Feasibility (14 days) | Prize Potential |
|------|------|-------|----------------------|-----------------|
| 🥇 | **#1: AI Research Agent with Verifiable Memory** | 8.7 | ⭐⭐⭐⭐ High | 1st + Best Walrus + Best Tatum |
| 🥇 | **#6: Multi-Agent Collaboration Hub** | 8.7 | ⭐⭐ Medium-Low | 1st + Best Walrus + Best Tatum |
| 🥉 | **#5: Document Notary + AI Summarizer** | 8.3 | ⭐⭐⭐⭐⭐ Very High | 1st + Best Walrus + Best Tatum |
| 4th | **#2: Content Vault with AI Verification** | 8.0 | ⭐⭐⭐ Medium | 1st + Best Walrus |
| 5th | **#3: Knowledge Marketplace** | 7.3 | ⭐⭐⭐ Medium | Top 3 |
| 6th | **#4: Game Save Cloud** | 7.2 | ⭐⭐⭐⭐ High | Top 5 |

---

## 🏆 RECOMMENDED: Idea #1 — AI Research Agent with Verifiable Memory

### Why This Wins

1. **Perfect alignment with Walrus's own product direction** — They literally built MemWal for this use case. Using their own SDK to build something impressive validates their product and makes judges happy.

2. **Uses ALL required/encouraged tech deeply:**
   - Walrus (via MemWal) = core storage for all agent memory
   - Tatum RPC = all Sui transactions
   - Tatum MCP = AI ↔ blockchain bridge (encouraged, wins special prize)

3. **Feasible in 14 days** — MemWal provides the heavy lifting (SDK, relayer, smart contract). You're building the AI agent logic and UI on top of existing infrastructure.

4. **Incredible demo potential:**
   - "Ask the agent to research X"
   - "Watch it store findings on Walrus with sources"
   - "Close the session, come back, agent remembers everything"
   - "Verify any memory — see the Walrus blob, the timestamp, the source"
   - "Share knowledge base with another agent"

5. **Targets all 3 prizes:** 1st place ($600) + Best Walrus Integration ($200) + Best Use of Tatum Tools ($200) = $1,000

### Backup: Idea #5 — Document Notary + AI Summarizer

If MemWal proves too unstable or complex, pivot to the Document Notary. It's:
- Simpler to build (direct Walrus HTTP API, no MemWal dependency)
- Still uses Tatum MCP for AI features
- Very clear demo flow
- Achievable by a solo developer in 7 days

---

## 🏗️ Architecture Preview (Idea #1)

```
┌─────────────────────────────────────────────────┐
│                   Frontend (Next.js)              │
│  Chat UI │ Memory Explorer │ Knowledge Graph     │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│              Backend (Node.js/TypeScript)         │
│  AI Agent Logic │ Memory Manager │ API Routes    │
└──────┬──────────────┬───────────────┬───────────┘
       │              │               │
┌──────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
│  LLM API    │ │  MemWal   │ │  Tatum MCP  │
│ (OpenAI/    │ │  SDK      │ │  Server     │
│  Anthropic) │ │           │ │             │
└─────────────┘ └─────┬─────┘ └──────┬──────┘
                      │               │
                ┌─────▼─────┐  ┌──────▼──────┐
                │  Walrus   │  │  Tatum RPC  │
                │  Storage  │  │  (Sui)      │
                └───────────┘  └─────────────┘
```

**Tech Stack:**
- Frontend: Next.js + Tailwind + shadcn/ui
- Backend: Node.js + TypeScript
- AI: OpenAI/Anthropic API (or local model)
- Storage: MemWal SDK (@memwal/sdk)
- Blockchain: @mysten/sui + Tatum RPC endpoints
- AI-Blockchain Bridge: Tatum MCP server

---

## ⏭️ Next Steps

1. **Validate MemWal SDK** — Test the beta SDK, ensure it works with Tatum RPC
2. **Get Tatum API key** — Sign up at dashboard.tatum.io
3. **Prototype** — Build minimal "store memory → retrieve memory" flow
4. **Design AI agent logic** — Define what the research agent does
5. **Build UI** — Chat interface + memory explorer
6. **Deploy to mainnet** — Last 2 days
7. **Record demo video** — Clear problem → solution → live demo flow
