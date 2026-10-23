export const AREAS = ["COMERCIAL", "ATENDIMENTO", "FINANCEIRO", "OPERACAO", "RH"] as const;
export type Area = (typeof AREAS)[number];

export const FREQUENCIES = ["DIARIA", "SEMANAL", "QUINZENAL", "MENSAL", "EVENTUAL"] as const;
export type Frequency = (typeof FREQUENCIES)[number];

export const SENSITIVITIES = ["NENHUM", "PESSOAL", "SAUDE_FINANCEIRO"] as const;
export type Sensitivity = (typeof SENSITIVITIES)[number];

export const QUADRANTS = ["COMECAR_JA", "PLANEJAR", "OPORTUNISTA", "EVITAR"] as const;
export type Quadrant = (typeof QUADRANTS)[number];

/** Um processo levantado no discovery. Campos `null` são dados faltantes (RN-08). */
export interface ProcessInput {
  key: string;
  name: string;
  area: Area;
  frequency: Frequency;
  /** Itens tratados por execução (ex.: confirmações enviadas). */
  volumePerExecution: number | null;
  /** Minutos que UMA pessoa gasta por execução. */
  minutesPerExecution: number | null;
  /** Pessoas que executam o processo. */
  people: number | null;
  tools: string[];
  /** 1 (cada um faz de um jeito) a 5 (roteiro único e seguido). */
  standardization: number | null;
  /** Erro percebido, em % das execuções. */
  errorRatePct: number | null;
  /** 1 (papel/memória) a 5 (dado estruturado em sistema). */
  dataDigitization: number | null;
  /** Nº de sistemas ou pessoas externas de que o processo depende. */
  dependencies: number | null;
  sensitiveData: Sensitivity | null;
}

export interface WeightsPotential {
  frequency: number;
  volume: number;
  repetitiveness: number;
  impact: number;
}
export interface WeightsEffort {
  digitization: number;
  integration: number;
  risk: number;
}

export interface ScoringConfig {
  weightsPotential: WeightsPotential;
  weightsEffort: WeightsEffort;
  /** Peso do potencial na prioridade; o restante vai para (100 - esforço). */
  priorityPotentialWeight: number;
  potentialThreshold: number;
  effortThreshold: number;
  /** Nota de integração (1-5) por ferramenta, em minúsculas. */
  toolIntegration: Record<string, number>;
  unknownToolIntegration: number;
}

export interface Premises {
  hourlyCostBRL: number;
  reductionConservative: number;
  reductionRealistic: number;
  reductionOptimistic: number;
  consultantRateBRL: number;
  minDevHours: number;
  maxDevHours: number;
  investmentLowFactor: number;
  investmentHighFactor: number;
  /** Horas de implantação disponíveis por janela de 30 dias. */
  capacityHoursPerWindow: number;
}

export interface CriteriaScores {
  frequency: number;
  volume: number;
  repetitiveness: number;
  digitization: number;
  integration: number;
  risk: number;
  impact: number;
}

export interface Range3 {
  conservative: number;
  realistic: number;
  optimistic: number;
}

export interface ScoredProcess {
  key: string;
  name: string;
  area: Area;
  executionsPerMonth: number;
  hoursPerMonth: number;
  criteria: CriteriaScores;
  potential: number;
  effort: number;
  priority: number;
  quadrant: Quadrant;
  completeness: number;
  missingFields: string[];
  unknownTools: string[];
  devHours: number;
  monthlySavingBRL: Range3;
  investmentBRL: Range3;
  paybackMonths: Range3 | null;
}
