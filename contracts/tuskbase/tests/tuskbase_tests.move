#[test_only]
module tuskbase::knowledge_base_tests {
    use std::string;
    use sui::test_scenario;
    use sui::clock;
    use tuskbase::knowledge_base::{Self, KnowledgeBase};

    const OWNER: address = @0xA;

    // ========== Knowledge Base Tests ==========

    #[test]
    fun test_create_knowledge_base() {
        let mut scenario = test_scenario::begin(OWNER);

        scenario.next_tx(OWNER);
        {
            let mut clock = clock::create_for_testing(scenario.ctx());
            clock.set_for_testing(1716624000000);

            knowledge_base::create(
                string::utf8(b"DeFi Research"),
                string::utf8(b"Research on DeFi protocols"),
                &clock,
                scenario.ctx(),
            );

            clock.destroy_for_testing();
        };

        scenario.next_tx(OWNER);
        {
            let kb = scenario.take_from_sender<KnowledgeBase>();

            assert!(knowledge_base::name(&kb) == string::utf8(b"DeFi Research"));
            assert!(knowledge_base::owner(&kb) == OWNER);
            assert!(knowledge_base::memory_count(&kb) == 0);
            assert!(!knowledge_base::is_public(&kb));

            scenario.return_to_sender(kb);
        };

        scenario.end();
    }

    #[test]
    fun test_publish_knowledge_base() {
        let mut scenario = test_scenario::begin(OWNER);

        scenario.next_tx(OWNER);
        {
            let mut clock = clock::create_for_testing(scenario.ctx());
            clock.set_for_testing(1716624000000);

            knowledge_base::create(
                string::utf8(b"Public KB"),
                string::utf8(b"Will be published"),
                &clock,
                scenario.ctx(),
            );

            clock.destroy_for_testing();
        };

        scenario.next_tx(OWNER);
        {
            let mut kb = scenario.take_from_sender<KnowledgeBase>();
            knowledge_base::publish(&mut kb, scenario.ctx());

            assert!(knowledge_base::is_public(&kb));

            scenario.return_to_sender(kb);
        };

        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = knowledge_base::EAlreadyPublic)]
    fun test_publish_twice_fails() {
        let mut scenario = test_scenario::begin(OWNER);

        scenario.next_tx(OWNER);
        {
            let mut clock = clock::create_for_testing(scenario.ctx());
            clock.set_for_testing(1716624000000);

            knowledge_base::create(
                string::utf8(b"KB"),
                string::utf8(b"Test"),
                &clock,
                scenario.ctx(),
            );

            clock.destroy_for_testing();
        };

        scenario.next_tx(OWNER);
        {
            let mut kb = scenario.take_from_sender<KnowledgeBase>();
            knowledge_base::publish(&mut kb, scenario.ctx());
            // Second publish should fail
            knowledge_base::publish(&mut kb, scenario.ctx());

            scenario.return_to_sender(kb);
        };

        scenario.end();
    }
}

#[test_only]
module tuskbase::memory_tests {
    use std::string;
    use sui::test_scenario;
    use sui::clock;
    use tuskbase::knowledge_base::{Self, KnowledgeBase};
    use tuskbase::memory::{Self, MemoryEntry};

    const OWNER: address = @0xA;
    const OTHER: address = @0xB;

    // ========== Helper ==========

    fun create_test_kb(scenario: &mut test_scenario::Scenario) {
        let mut clock = clock::create_for_testing(scenario.ctx());
        clock.set_for_testing(1716624000000);

        knowledge_base::create(
            string::utf8(b"Test KB"),
            string::utf8(b"For testing"),
            &clock,
            scenario.ctx(),
        );

        clock.destroy_for_testing();
    }

    // ========== Memory Tests ==========

    #[test]
    fun test_store_memory() {
        let mut scenario = test_scenario::begin(OWNER);

        scenario.next_tx(OWNER);
        create_test_kb(&mut scenario);

        scenario.next_tx(OWNER);
        {
            let mut kb = scenario.take_from_sender<KnowledgeBase>();
            let mut clock = clock::create_for_testing(scenario.ctx());
            clock.set_for_testing(1716624060000);

            memory::store(
                &mut kb,
                string::utf8(b"blob_abc123"),
                string::utf8(b"snap_xyz789"),
                string::utf8(b"https://docs.sui.io"),
                string::utf8(b"sui.io"),
                string::utf8(b"8f3a2b1c4d5e6f7a"),
                9,
                &clock,
                scenario.ctx(),
            );

            assert!(knowledge_base::memory_count(&kb) == 1);

            clock.destroy_for_testing();
            scenario.return_to_sender(kb);
        };

        scenario.next_tx(OWNER);
        {
            let mem = scenario.take_from_sender<MemoryEntry>();

            assert!(memory::blob_id(&mem) == string::utf8(b"blob_abc123"));
            assert!(memory::source_url(&mem) == string::utf8(b"https://docs.sui.io"));
            assert!(memory::source_domain(&mem) == string::utf8(b"sui.io"));
            assert!(memory::content_hash(&mem) == string::utf8(b"8f3a2b1c4d5e6f7a"));
            assert!(memory::trust_score(&mem) == 9);
            assert!(memory::stored_by(&mem) == OWNER);

            scenario.return_to_sender(mem);
        };

        scenario.end();
    }

    #[test]
    fun test_store_multiple_memories() {
        let mut scenario = test_scenario::begin(OWNER);

        scenario.next_tx(OWNER);
        create_test_kb(&mut scenario);

        scenario.next_tx(OWNER);
        {
            let mut kb = scenario.take_from_sender<KnowledgeBase>();
            let mut clock = clock::create_for_testing(scenario.ctx());
            clock.set_for_testing(1716624060000);

            memory::store(
                &mut kb,
                string::utf8(b"blob_1"),
                string::utf8(b"snap_1"),
                string::utf8(b"https://a.com"),
                string::utf8(b"a.com"),
                string::utf8(b"hash1"),
                7,
                &clock,
                scenario.ctx(),
            );

            memory::store(
                &mut kb,
                string::utf8(b"blob_2"),
                string::utf8(b"snap_2"),
                string::utf8(b"https://b.com"),
                string::utf8(b"b.com"),
                string::utf8(b"hash2"),
                10,
                &clock,
                scenario.ctx(),
            );

            assert!(knowledge_base::memory_count(&kb) == 2);

            clock.destroy_for_testing();
            scenario.return_to_sender(kb);
        };

        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = memory::ENotOwner)]
    fun test_store_memory_not_owner() {
        let mut scenario = test_scenario::begin(OWNER);

        scenario.next_tx(OWNER);
        create_test_kb(&mut scenario);

        // Try to store as OTHER — should fail
        scenario.next_tx(OTHER);
        {
            let mut kb = scenario.take_from_address<KnowledgeBase>(OWNER);
            let mut clock = clock::create_for_testing(scenario.ctx());
            clock.set_for_testing(1716624060000);

            memory::store(
                &mut kb,
                string::utf8(b"blob_hack"),
                string::utf8(b"snap_hack"),
                string::utf8(b"https://evil.com"),
                string::utf8(b"evil.com"),
                string::utf8(b"fakehash"),
                5,
                &clock,
                scenario.ctx(),
            );

            clock.destroy_for_testing();
            test_scenario::return_to_address(OWNER, kb);
        };

        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = memory::EInvalidTrustScore)]
    fun test_invalid_trust_score_zero() {
        let mut scenario = test_scenario::begin(OWNER);

        scenario.next_tx(OWNER);
        create_test_kb(&mut scenario);

        scenario.next_tx(OWNER);
        {
            let mut kb = scenario.take_from_sender<KnowledgeBase>();
            let mut clock = clock::create_for_testing(scenario.ctx());
            clock.set_for_testing(1716624060000);

            memory::store(
                &mut kb,
                string::utf8(b"blob_x"),
                string::utf8(b"snap_x"),
                string::utf8(b"https://test.com"),
                string::utf8(b"test.com"),
                string::utf8(b"hash"),
                0, // Invalid — min is 1
                &clock,
                scenario.ctx(),
            );

            clock.destroy_for_testing();
            scenario.return_to_sender(kb);
        };

        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = memory::EInvalidTrustScore)]
    fun test_invalid_trust_score_eleven() {
        let mut scenario = test_scenario::begin(OWNER);

        scenario.next_tx(OWNER);
        create_test_kb(&mut scenario);

        scenario.next_tx(OWNER);
        {
            let mut kb = scenario.take_from_sender<KnowledgeBase>();
            let mut clock = clock::create_for_testing(scenario.ctx());
            clock.set_for_testing(1716624060000);

            memory::store(
                &mut kb,
                string::utf8(b"blob_x"),
                string::utf8(b"snap_x"),
                string::utf8(b"https://test.com"),
                string::utf8(b"test.com"),
                string::utf8(b"hash"),
                11, // Invalid — max is 10
                &clock,
                scenario.ctx(),
            );

            clock.destroy_for_testing();
            scenario.return_to_sender(kb);
        };

        scenario.end();
    }
}
