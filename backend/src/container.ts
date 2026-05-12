/**
 * Dependency Injection Container — wires all services and use cases together.
 * Single source of truth for object creation and dependency resolution.
 */

import { SearchService } from "./services/search.service.js";
import { AIService } from "./services/ai.service.js";
import { WalrusService } from "./services/walrus.service.js";
import { MemwalService } from "./services/memwal.service.js";
import { TatumService } from "./services/tatum.service.js";
import { ProvenanceService } from "./services/provenance.service.js";
import { ResearchUseCase } from "./usecases/research.usecase.js";
import { VerifyUseCase } from "./usecases/verify.usecase.js";
import { RecallUseCase } from "./usecases/recall.usecase.js";

export interface Container {
  // Services
  search: SearchService;
  ai: AIService;
  walrus: WalrusService;
  memwal: MemwalService;
  tatum: TatumService;
  provenance: ProvenanceService;

  // Use cases
  researchUseCase: ResearchUseCase;
  verifyUseCase: VerifyUseCase;
  recallUseCase: RecallUseCase;
}

/** Create and wire all dependencies */
export function createContainer(): Container {
  // Services (leaf dependencies — no deps on each other)
  const search = new SearchService();
  const ai = new AIService();
  const walrus = new WalrusService();
  const memwal = new MemwalService();
  const tatum = new TatumService();
  const provenance = new ProvenanceService();

  // Use cases (depend on services)
  const researchUseCase = new ResearchUseCase({
    search,
    ai,
    walrus,
    memwal,
    provenance,
    tatum,
  });

  const verifyUseCase = new VerifyUseCase({
    walrus,
    provenance,
    tatum,
  });

  const recallUseCase = new RecallUseCase({
    memwal,
  });

  return {
    search,
    ai,
    walrus,
    memwal,
    tatum,
    provenance,
    researchUseCase,
    verifyUseCase,
    recallUseCase,
  };
}
