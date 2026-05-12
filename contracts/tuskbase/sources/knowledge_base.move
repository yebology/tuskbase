/// Knowledge Base — container for verified research memories.
/// Handles creation, publishing, and metadata queries for knowledge bases.
module tuskbase::knowledge_base {
    use std::string::String;
    use sui::event;
    use sui::clock::Clock;

    // ========== Error codes ==========

    const ENotOwner: u64 = 0;
    const EAlreadyPublic: u64 = 1;

    // ========== Structs ==========

    /// A Knowledge Base owned by a user — container for memories
    public struct KnowledgeBase has key, store {
        id: UID,
        name: String,
        description: String,
        owner: address,
        created_at: u64,
        memory_count: u64,
        is_public: bool,
    }

    // ========== Events ==========

    public struct KnowledgeBaseCreated has copy, drop {
        kb_id: ID,
        name: String,
        owner: address,
    }

    public struct KnowledgeBasePublished has copy, drop {
        kb_id: ID,
        owner: address,
    }

    // ========== Entry functions ==========

    /// Create a new knowledge base owned by the caller
    entry fun create(
        name: String,
        description: String,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        let owner = ctx.sender();
        let kb = KnowledgeBase {
            id: object::new(ctx),
            name,
            description,
            owner,
            created_at: clock.timestamp_ms(),
            memory_count: 0,
            is_public: false,
        };

        event::emit(KnowledgeBaseCreated {
            kb_id: object::id(&kb),
            name: kb.name,
            owner,
        });

        transfer::transfer(kb, owner);
    }

    /// Make a knowledge base publicly viewable
    entry fun publish(
        kb: &mut KnowledgeBase,
        ctx: &TxContext,
    ) {
        assert!(kb.owner == ctx.sender(), ENotOwner);
        assert!(!kb.is_public, EAlreadyPublic);

        kb.is_public = true;

        event::emit(KnowledgeBasePublished {
            kb_id: object::id(kb),
            owner: kb.owner,
        });
    }

    // ========== Package functions (called by memory module) ==========

    /// Increment memory count — only callable within this package
    public(package) fun increment_memory_count(kb: &mut KnowledgeBase) {
        kb.memory_count = kb.memory_count + 1;
    }

    // ========== View functions ==========

    public fun owner(kb: &KnowledgeBase): address { kb.owner }
    public fun name(kb: &KnowledgeBase): String { kb.name }
    public fun description(kb: &KnowledgeBase): String { kb.description }
    public fun created_at(kb: &KnowledgeBase): u64 { kb.created_at }
    public fun memory_count(kb: &KnowledgeBase): u64 { kb.memory_count }
    public fun is_public(kb: &KnowledgeBase): bool { kb.is_public }
}
