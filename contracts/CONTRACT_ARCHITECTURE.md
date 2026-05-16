# Smart Contract Architecture

## Language: Move (Sui)

## Package: `tuskbase`

Deployed on Sui Devnet.  
Package ID: `0x5dbd1fb5ae571ab8b495655468ec4371582c879c189d92c109a5b41010ac041a`

## Folder Structure

```
contracts/tuskbase/
├── Move.toml                        # Package config
├── sources/
│   ├── knowledge_base.move          # KB lifecycle (create, publish)
│   └── memory.move                  # Memory storage + provenance
└── tests/
    └── tuskbase_tests.move          # 8 unit tests
```

## Modules

### `knowledge_base.move`
Container for research memories.

**Structs:**
- `KnowledgeBase` (key, store) — owned object with name, description, memory count, public flag

**Entry functions:**
- `create(name, description, clock, ctx)` — create new KB, transfer to sender
- `publish(kb, ctx)` — make KB publicly viewable

**Package functions:**
- `increment_memory_count(kb)` — called by memory module when storing

**Events:**
- `KnowledgeBaseCreated { kb_id, name, owner }`
- `KnowledgeBasePublished { kb_id, owner }`

### `memory.move`
Individual research findings with provenance.

**Structs:**
- `MemoryEntry` (key, store) — links to KB, stores blob IDs, source info, hash, trust score

**Entry functions:**
- `store(kb, blob_id, snapshot_blob_id, source_url, source_domain, content_hash, trust_score, clock, ctx)` — store memory, increment KB count, emit event

**Events:**
- `MemoryStored { memory_id, kb_id, blob_id, source_url, content_hash, trust_score }`

## Access Control

- Only KB owner can store memories in their KB (`ENotOwner`)
- Only KB owner can publish (`ENotOwner`)
- Trust score validated 1-10 (`EInvalidTrustScore`)
- Can't publish twice (`EAlreadyPublic`)

## Testing

8 unit tests covering:
- KB creation and publishing
- Memory storage and multiple memories
- Access control (non-owner rejected)
- Trust score validation (0 and 11 rejected)

```bash
sui move test --build-env testnet
```

## How Backend Calls Contract

Backend uses `@mysten/sui` SDK with Tatum RPC as endpoint:
1. Build `Transaction` with `tx.moveCall()`
2. Sign with `Ed25519Keypair` (from `SUI_PRIVATE_KEY`)
3. Execute via `SuiJsonRpcClient` pointed at Tatum gateway
4. Wait for confirmation, return tx digest
