# 🏆 Tatum x Build on Sui with Walrus — Hackathon Research

## Competition Brief

| Field | Detail |
|-------|--------|
| **Name** | Tatum x Build on Sui with Walrus |
| **Organizer** | [Tatum](https://tatum.io) |
| **Partners** | Walrus Foundation, Sui Network |
| **Kickoff** | May 23, 2026 |
| **Deadline** | June 6, 2026, 17:00 UTC |
| **Results** | June 7, 2026 |
| **Build Period** | ~14 days |
| **Team Size** | 1–3 members |
| **Total Prizes** | $2,000 USD |
| **Submission** | GitHub repo + 2–3 min demo video |
| **URL** | https://tatum.io/tatum-x-walrus-hackathon |

---

## 💰 Prize Breakdown

| Place | Prize |
|-------|-------|
| 🥇 1st | $600 |
| 🥈 2nd | $400 |
| 🥉 3rd | $300 |
| 4th | $200 |
| 5th | $100 |
| 🌟 Best Walrus Integration | $200 (stackable) |
| ⚡ Best Use of Tatum Tools | $200 (stackable) |

**Max possible per team: $1,000** (1st + Best Walrus + Best Tatum)

All valid submissions get exclusive Tatum discount codes and credits.

---

## ⚖️ Judging Criteria

| Criteria | Weight | What They Want |
|----------|--------|----------------|
| **Walrus & Tatum Integration** | 30% | Meaningful, creative use of Walrus storage on Sui + building with Tatum RPCs or Data APIs |
| **Technical Quality** | 30% | Clean code, successful Tatum Sui RPC integration |
| **Creativity** | 20% | Novel idea, unique approach |
| **Presentation** | 20% | Clear docs, working demo video |
| **🌟 Bonus** | Extra | Share on X/LinkedIn tagging @Tatum_io, @WalrusFoundation, @SuiNetwork |

**Key Insight:** Integration quality (60% combined) dominates. The winning project must deeply use BOTH Walrus AND Tatum — not just a superficial wrapper.

---

## 🛠️ Technical Requirements

### Mandatory
1. **Tatum API key** (free via [dashboard.tatum.io](https://dashboard.tatum.io))
2. **Tatum's Sui RPC nodes** for blockchain interaction
3. **Walrus storage** integrated meaningfully (core functionality, not add-on)
4. **Build on Sui** — Mainnet preferred, Testnet/Devnet acceptable
5. **GitHub repo** + **2–3 min demo video**

### Optional (Encouraged)
- **Tatum MCP server** for AI features
- **Mainnet deployment** (bonus points)
- **Social sharing** tagging organizers

### Sui RPC Endpoints (Powered by Tatum)
```
Mainnet:  https://sui-mainnet.gateway.tatum.io
Testnet:  https://sui-testnet.gateway.tatum.io
Devnet:   https://sui-devnet.gateway.tatum.io
```

---

## 🧱 Technology Stack Deep Dive

### Walrus — Decentralized Storage on Sui

**What it is:** A decentralized blob storage protocol built on Sui. Stores large binary data (images, files, game state, metadata) in a trustless, cost-efficient way. Content-addressable — data is identified by a unique blob ID derived from the content itself.

**Key Features:**
- Highly available with cryptographic verifiability
- Programmable through Sui smart contracts
- Uses Red Stuff erasure coding (~4.5x replication factor)
- Self-healing of lost data without centralized coordination
- Launched mainnet March 2025, now stores 450TB+

**How to Store (HTTP API via Publisher):**
```bash
# Store a string for 1 epoch
curl -X PUT "$PUBLISHER/v1/blobs" -d "some string"

# Store a file for 5 epochs
curl -X PUT "$PUBLISHER/v1/blobs?epochs=5" --upload-file "some/file"

# Store as deletable
curl -X PUT "$PUBLISHER/v1/blobs?deletable=true" --upload-file "some/file"

# Store as permanent
curl -X PUT "$PUBLISHER/v1/blobs?permanent=true" --upload-file "some/file"
```

**How to Read (HTTP API via Aggregator):**
```bash
curl "$AGGREGATOR/v1/blobs/{blobId}"
```

**TypeScript SDK:**
```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { walrus } from '@mysten/walrus';

const client = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://sui-testnet.gateway.tatum.io', // Use Tatum RPC!
}).$extend(walrus());

// Read a file
const [file] = await client.walrus.getFiles({ ids: [blobId] });
const text = await file.text();
const json = await file.json();
const bytes = await file.bytes();
```

**SDKs Available:**
- TypeScript: `@mysten/walrus` + `@mysten/sui`
- Python: `walrus-python`
- Dart/Flutter: `dartus`

### Tatum — Blockchain Infrastructure

**What it provides:**
- Enterprise-grade Sui RPC endpoints (load-balanced, failovers, smart caching)
- Data APIs for on-chain data
- Webhooks for on-chain events
- MCP server for AI-powered blockchain interactions
- JavaScript SDK for building Web3 apps
- SOC2 and ISO certified infrastructure

**Tatum MCP Server:** Enables AI assistants to access blockchain data, generate code, and interact with 130+ networks. Encouraged for AI features in this hackathon.

---

## 🚀 Project Ideas (from hackathon page + analysis)

The hackathon suggests these categories:

| Category | Ideas |
|----------|-------|
| **On-chain Media** | NFT metadata on Walrus, decentralized image/video hosting |
| **DeFi + Data** | Store oracle data, trade history, portfolio snapshots |
| **AI + Walrus** | AI model weights on-chain, training data storage, AI agent memory |
| **Gaming Assets** | Game state persistence, asset metadata, replay storage |
| **Social Protocols** | Decentralized social content, user profiles, messaging |
| **Infra and Tooling** | Developer tools, explorers, SDKs, indexers |

---

## 🎯 Strategic Analysis

### What Wins This Hackathon

1. **Deep Integration (60% of score):** The project must use Walrus as CORE functionality AND use Tatum RPCs meaningfully. Surface-level "store one thing on Walrus" won't cut it.

2. **Technical Quality (30%):** Clean code, proper error handling, good architecture. Since it's only 14 days with 1–3 people, scope must be tight.

3. **Creativity + Presentation (40%):** Novel idea + polished demo video. The demo video is critical — 2–3 minutes to impress.

### Winning Strategy

- **Target all 3 prizes:** 1st place + Best Walrus Integration + Best Use of Tatum Tools = $1,000
- **Use Tatum MCP** for AI features (encouraged, differentiator)
- **Deploy to Mainnet** (preferred, bonus points)
- **Share on social** (free bonus points)
- **Keep scope small but deep** — better to have one feature working perfectly than five half-broken

### Competitive Advantages to Exploit

1. **AI + Walrus** is the most novel category — fewer competitors likely, high creativity score
2. **Tatum MCP integration** is "optional but encouraged" — doing it well wins the Best Tatum Tools prize
3. **Mainnet deployment** is "preferred" — many teams will stay on testnet, deploying to mainnet differentiates
4. **Demo video quality** — many devs neglect this. A polished 2-min video with clear problem→solution→demo flow wins Presentation (20%)

### Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Walrus mainnet costs | Start on testnet, deploy to mainnet last day |
| Tatum API rate limits | Free tier should be sufficient for hackathon |
| 14-day timeline | Scope to MVP in first 7 days, polish in last 7 |
| Small prize pool ($2K) | Low competition = higher win probability |
| Team size 1–3 | Solo is fine for focused project |

---

## 📚 Key Resources

| Resource | URL |
|----------|-----|
| Hackathon Page | https://tatum.io/tatum-x-walrus-hackathon |
| Tatum Dashboard (API Key) | https://dashboard.tatum.io |
| Tatum Docs | https://docs.tatum.io |
| Tatum MCP Docs | https://docs.tatum.io/docs/tatum-documentation-mcp |
| Tatum Blockchain MCP | https://tatum.io/mcp |
| Walrus Docs | https://docs.wal.app |
| Walrus HTTP API | https://docs.wal.app/usage/web-api.html |
| Walrus TypeScript SDK | https://sdk.mystenlabs.com/walrus |
| Walrus Python SDK | https://blog.walrus.xyz/getting-started-walrus-python-store-and-retrieve-data/ |
| Walrus GitHub | https://github.com/MystenLabs/walrus |
| Sui Docs | https://docs.sui.io |
| Tatum Discord (#hackathon) | Join via Tatum Discord |

---

## 💡 Top Project Recommendations

### 1. 🧠 AI Agent with Decentralized Memory (AI + Walrus + Tatum MCP)
**Concept:** An AI agent that stores its conversation history, learned preferences, and knowledge base on Walrus. Uses Tatum MCP for blockchain interactions and Tatum RPC for Sui transactions.

**Why it wins:**
- Deep Walrus integration (core storage for AI memory)
- Uses Tatum MCP (Best Tatum Tools prize)
- Novel (AI + decentralized storage is cutting-edge)
- Great demo potential ("watch the AI remember across sessions")

### 2. 📸 Decentralized Content Verification Platform (Social + AI)
**Concept:** Platform where creators upload content to Walrus with cryptographic proof of authenticity. AI (via Tatum MCP) analyzes and verifies content hasn't been tampered with. Timestamps and provenance stored on Sui.

**Why it wins:**
- Real-world problem (deepfakes, content authenticity)
- Deep Walrus usage (all content stored there)
- Tatum RPC for all Sui interactions
- Clear demo flow

### 3. 🎮 On-Chain Game State Engine (Gaming + Infra)
**Concept:** A game state persistence layer that stores game saves, replays, and assets on Walrus. Players own their game data. Uses Tatum RPC for all Sui interactions.

**Why it wins:**
- Gaming is hot in Web3
- Deep Walrus integration (all game data)
- Clear technical architecture
- Fun to demo

### 4. 📊 Decentralized Data Marketplace (DeFi + Data)
**Concept:** Marketplace where data providers store datasets on Walrus and sell access via Sui smart contracts. Tatum webhooks notify buyers when new data is available.

**Why it wins:**
- Uses multiple Tatum features (RPC + webhooks + Data APIs)
- Deep Walrus integration (all datasets stored there)
- Real business model
- DeFi angle adds complexity judges appreciate

---

## ⏰ Suggested Timeline (14 days)

| Days | Phase | Tasks |
|------|-------|-------|
| 1–2 | Setup | Get Tatum API key, set up dev environment, test Walrus storage, test Tatum RPC |
| 3–5 | Core Build | Implement core Walrus integration, smart contracts (if any), backend |
| 6–8 | Features | Complete main features, integrate Tatum MCP (if using AI) |
| 9–11 | Frontend + Polish | Build UI, connect everything, handle errors |
| 12–13 | Deploy + Test | Deploy to mainnet, end-to-end testing, fix bugs |
| 14 | Submit | Record demo video, write docs, submit GitHub repo |

---

## ✅ Submission Checklist

- [ ] Tatum API key used
- [ ] Tatum Sui RPC endpoints used (not generic Sui nodes)
- [ ] Walrus storage integrated as core functionality
- [ ] Deployed on Sui (Mainnet preferred)
- [ ] GitHub repo with clean code + README
- [ ] 2–3 min demo video
- [ ] Shared on X/LinkedIn tagging @Tatum_io, @WalrusFoundation, @SuiNetwork
- [ ] Submitted via official submission form by June 6, 17:00 UTC
