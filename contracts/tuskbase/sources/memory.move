/// Memory — individual research findings with verifiable provenance.
/// Each memory links to a Walrus blob (content) and snapshot (source proof),
/// with on-chain metadata for trustless verification.
module tuskbase::memory {
    use std::string::String;
    use sui::event;
    use sui::clock::Clock;
    use tuskbase::knowledge_base::{Self, KnowledgeBase};

    // ========== Error codes ==========

    const ENotOwner: u64 = 0;
    const EInvalidTrustScore: u64 = 2;

    // ========== Structs ==========

    /// A single memory entry with full provenance metadata
    public struct MemoryEntry has key, store {
        id: UID,
        /// ID of the parent knowledge base
        kb_id: ID,
        /// Walrus blob ID where the memory content is stored
        blob_id: String,
        /// Walrus blob ID of the source page snapshot
        snapshot_blob_id: String,
        /// Original source URL
        source_url: String,
        /// Domain of the source (e.g., "docs.sui.io")
        source_domain: String,
        /// SHA-256 hash of the stored content (for integrity verification)
        content_hash: String,
        /// When this memory was created (from on-chain clock)
        created_at: u64,
        /// Trust score 1-10 based on source quality
        trust_score: u8,
        /// Who stored this memory
        stored_by: address,
    }

    // ========== Events ==========

    public struct MemoryStored has copy, drop {
        memory_id: ID,
        kb_id: ID,
        blob_id: String,
        source_url: String,
        content_hash: String,
        trust_score: u8,
    }

    // ========== Entry functions ==========

    /// Store a new memory with provenance in a knowledge base
    entry fun store(
        kb: &mut KnowledgeBase,
        blob_id: String,
        snapshot_blob_id: String,
        source_url: String,
        source_domain: String,
        content_hash: String,
        trust_score: u8,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        let sender = ctx.sender();
        assert!(knowledge_base::owner(kb) == sender, ENotOwner);
        assert!(trust_score >= 1 && trust_score <= 10, EInvalidTrustScore);

        let memory = MemoryEntry {
            id: object::new(ctx),
            kb_id: object::id(kb),
            blob_id,
            snapshot_blob_id,
            source_url,
            source_domain,
            content_hash,
            created_at: clock.timestamp_ms(),
            trust_score,
            stored_by: sender,
        };

        knowledge_base::increment_memory_count(kb);

        event::emit(MemoryStored {
            memory_id: object::id(&memory),
            kb_id: object::id(kb),
            blob_id: memory.blob_id,
            source_url: memory.source_url,
            content_hash: memory.content_hash,
            trust_score,
        });

        transfer::transfer(memory, sender);
    }

    // ========== View functions ==========

    public fun kb_id(m: &MemoryEntry): ID { m.kb_id }
    public fun blob_id(m: &MemoryEntry): String { m.blob_id }
    public fun snapshot_blob_id(m: &MemoryEntry): String { m.snapshot_blob_id }
    public fun source_url(m: &MemoryEntry): String { m.source_url }
    public fun source_domain(m: &MemoryEntry): String { m.source_domain }
    public fun content_hash(m: &MemoryEntry): String { m.content_hash }
    public fun created_at(m: &MemoryEntry): u64 { m.created_at }
    public fun trust_score(m: &MemoryEntry): u8 { m.trust_score }
    public fun stored_by(m: &MemoryEntry): address { m.stored_by }

    /// Check if a memory belongs to a specific knowledge base
    public fun belongs_to(m: &MemoryEntry, kb: &KnowledgeBase): bool {
        m.kb_id == object::id(kb)
    }
}
