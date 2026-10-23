import type { Premises, ScoringConfig } from "./types";

export const DEFAULT_CONFIG: ScoringConfig = {
  weightsPotential: { frequency: 0.2, volume: 0.15, repetitiveness: 0.25, impact: 0.4 },
  weightsEffort: { digitization: 0.35, integration: 0.35, risk: 0.3 },
  priorityPotentialWeight: 0.6,
  potentialThreshold: 50,
  effortThreshold: 50,
  toolIntegration: {
    "google sheets": 5,
    "planilha online": 5,
    crm: 4,
    "e-mail": 4,
    "whatsapp business": 4,
    "sistema de agenda": 4,
    erp: 3,
    excel: 3,
    "sistema de prontuário": 3,
    "whatsapp (celular)": 2,
    "sistema legado": 1,
    papel: 1,
  },
  unknownToolIntegration: 2.5,
};

export const DEFAULT_PREMISES: Premises = {
  hourlyCostBRL: 42,
  reductionConservative: 0.4,
  reductionRealistic: 0.6,
  reductionOptimistic: 0.8,
  consultantRateBRL: 150,
  minDevHours: 16,
  maxDevHours: 120,
  investmentLowFactor: 0.85,
  investmentHighFactor: 1.4,
  capacityHoursPerWindow: 80,
};

export const EXECUTIONS_PER_MONTH = {
  DIARIA: 22,
  SEMANAL: 4.33,
  QUINZENAL: 2,
  MENSAL: 1,
  EVENTUAL: 0.5,
} as const;

/** Valores usados quando o dado falta. Escolhidos para ser cautelosos, nunca otimistas (RN-08). */
export const MISSING_DEFAULTS = {
  volumePerExecution: 1,
  minutesPerExecution: 30,
  people: 1,
  standardization: 2,
  errorRatePct: 0,
  dataDigitization: 2,
  dependencies: 2,
  sensitiveData: "PESSOAL",
} as const;
