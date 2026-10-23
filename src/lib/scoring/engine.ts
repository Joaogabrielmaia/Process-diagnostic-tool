import { DEFAULT_CONFIG, DEFAULT_PREMISES, EXECUTIONS_PER_MONTH, MISSING_DEFAULTS } from "./config";
import type {
  CriteriaScores,
  ProcessInput,
  Premises,
  Quadrant,
  Range3,
  ScoredProcess,
  ScoringConfig,
} from "./types";

const round1 = (n: number) => Math.round(n * 10) / 10;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Converte uma nota 1-5 em 0-100. */
export const scaleFrom5 = (v: number) => ((clamp(v, 1, 5) - 1) / 4) * 100;

export function frequencyScore(executionsPerMonth: number): number {
  if (executionsPerMonth >= 20) return 100;
  if (executionsPerMonth >= 8) return 80;
  if (executionsPerMonth >= 4) return 60;
  if (executionsPerMonth >= 2) return 40;
  if (executionsPerMonth >= 1) return 25;
  return 10;
}

export function volumeScore(itemsPerMonth: number): number {
  if (itemsPerMonth >= 1000) return 100;
  if (itemsPerMonth >= 300) return 80;
  if (itemsPerMonth >= 100) return 60;
  if (itemsPerMonth >= 30) return 40;
  return 20;
}

export function hoursScore(hoursPerMonth: number): number {
  if (hoursPerMonth >= 100) return 100;
  if (hoursPerMonth >= 50) return 80;
  if (hoursPerMonth >= 20) return 60;
  if (hoursPerMonth >= 8) return 40;
  return 20;
}

export function impactScore(hoursPerMonth: number, errorRatePct: number): number {
  const errorScore = Math.min(errorRatePct * 4, 100);
  return 0.75 * hoursScore(hoursPerMonth) + 0.25 * errorScore;
}

const SENSITIVITY_RISK = { NENHUM: 0, PESSOAL: 40, SAUDE_FINANCEIRO: 70 } as const;

export function riskScore(sensitivity: keyof typeof SENSITIVITY_RISK, dependencies: number): number {
  return Math.min(100, SENSITIVITY_RISK[sensitivity] + Math.min(dependencies, 5) * 6);
}

export function integrationScore(
  tools: string[],
  config: ScoringConfig,
): { score: number; unknownTools: string[] } {
  if (tools.length === 0) return { score: scaleFrom5(config.unknownToolIntegration), unknownTools: [] };
  const unknownTools: string[] = [];
  const notes = tools.map((t) => {
    const known = config.toolIntegration[t.trim().toLowerCase()];
    if (known === undefined) unknownTools.push(t);
    return known ?? config.unknownToolIntegration;
  });
  const avg = notes.reduce((a, b) => a + b, 0) / notes.length;
  return { score: scaleFrom5(avg), unknownTools };
}

export function quadrantOf(potential: number, effort: number, config: ScoringConfig): Quadrant {
  const highPotential = potential >= config.potentialThreshold;
  const lowEffort = effort < config.effortThreshold;
  if (highPotential && lowEffort) return "COMECAR_JA";
  if (highPotential) return "PLANEJAR";
  if (lowEffort) return "OPORTUNISTA";
  return "EVITAR";
}

const OPTIONAL_FIELDS = [
  ["volumePerExecution", "volume por execução"],
  ["minutesPerExecution", "minutos por execução"],
  ["people", "nº de pessoas"],
  ["standardization", "padronização"],
  ["errorRatePct", "taxa de erro"],
  ["dataDigitization", "digitalização dos dados"],
  ["dependencies", "dependências"],
  ["sensitiveData", "dados sensíveis"],
] as const;

export function scoreProcess(
  input: ProcessInput,
  config: ScoringConfig = DEFAULT_CONFIG,
  premises: Premises = DEFAULT_PREMISES,
): ScoredProcess {
  const missingFields: string[] = OPTIONAL_FIELDS.filter(([k]) => input[k] === null).map(([, label]) => label);
  if (input.tools.length === 0) missingFields.push("ferramentas");
  const completeness = Math.round((1 - missingFields.length / (OPTIONAL_FIELDS.length + 1)) * 100) / 100;

  const volume = input.volumePerExecution ?? MISSING_DEFAULTS.volumePerExecution;
  const minutes = input.minutesPerExecution ?? MISSING_DEFAULTS.minutesPerExecution;
  const people = input.people ?? MISSING_DEFAULTS.people;
  const standardization = input.standardization ?? MISSING_DEFAULTS.standardization;
  const errorRate = input.errorRatePct ?? MISSING_DEFAULTS.errorRatePct;
  const digitization = input.dataDigitization ?? MISSING_DEFAULTS.dataDigitization;
  const dependencies = input.dependencies ?? MISSING_DEFAULTS.dependencies;
  const sensitivity = input.sensitiveData ?? MISSING_DEFAULTS.sensitiveData;

  const executionsPerMonth = EXECUTIONS_PER_MONTH[input.frequency];
  const hoursPerMonth = round1((executionsPerMonth * minutes * people) / 60);
  const integration = integrationScore(input.tools, config);

  const criteria: CriteriaScores = {
    frequency: frequencyScore(executionsPerMonth),
    volume: volumeScore(executionsPerMonth * volume),
    repetitiveness: scaleFrom5(standardization),
    digitization: scaleFrom5(digitization),
    integration: integration.score,
    risk: riskScore(sensitivity, dependencies),
    impact: impactScore(hoursPerMonth, errorRate),
  };

  const wp = config.weightsPotential;
  const we = config.weightsEffort;
  const potential = round1(
    criteria.frequency * wp.frequency +
      criteria.volume * wp.volume +
      criteria.repetitiveness * wp.repetitiveness +
      criteria.impact * wp.impact,
  );
  const effort = round1(
    (100 - criteria.digitization) * we.digitization +
      (100 - criteria.integration) * we.integration +
      criteria.risk * we.risk,
  );
  const priority = round1(
    potential * config.priorityPotentialWeight + (100 - effort) * (1 - config.priorityPotentialWeight),
  );

  const devHours = round1(premises.minDevHours + (effort / 100) * (premises.maxDevHours - premises.minDevHours));
  const baseSaving = hoursPerMonth * premises.hourlyCostBRL;
  const monthlySavingBRL: Range3 = {
    conservative: Math.round(baseSaving * premises.reductionConservative * (0.7 + 0.3 * completeness)),
    realistic: Math.round(baseSaving * premises.reductionRealistic * (0.85 + 0.15 * completeness)),
    optimistic: Math.round(baseSaving * premises.reductionOptimistic),
  };
  const base = devHours * premises.consultantRateBRL;
  const investmentBRL: Range3 = {
    conservative: Math.round(base * premises.investmentHighFactor),
    realistic: Math.round(base),
    optimistic: Math.round(base * premises.investmentLowFactor),
  };
  const payback = (inv: number, saving: number) => (saving > 0 ? round1(inv / saving) : null);
  const pc = payback(investmentBRL.conservative, monthlySavingBRL.conservative);
  const pr = payback(investmentBRL.realistic, monthlySavingBRL.realistic);
  const po = payback(investmentBRL.optimistic, monthlySavingBRL.optimistic);
  const paybackMonths: Range3 | null =
    pc !== null && pr !== null && po !== null ? { conservative: pc, realistic: pr, optimistic: po } : null;

  return {
    key: input.key,
    name: input.name,
    area: input.area,
    executionsPerMonth,
    hoursPerMonth,
    criteria,
    potential,
    effort,
    priority,
    quadrant: quadrantOf(potential, effort, config),
    completeness,
    missingFields,
    unknownTools: integration.unknownTools,
    devHours,
    monthlySavingBRL,
    investmentBRL,
    paybackMonths,
  };
}

/** Ranking por prioridade (desc); empate resolvido por horas/mês e depois pelo nome, para ser estável. */
export function rankProcesses(
  inputs: ProcessInput[],
  config: ScoringConfig = DEFAULT_CONFIG,
  premises: Premises = DEFAULT_PREMISES,
): ScoredProcess[] {
  return inputs
    .map((p) => scoreProcess(p, config, premises))
    .sort((a, b) => b.priority - a.priority || b.hoursPerMonth - a.hoursPerMonth || a.name.localeCompare(b.name));
}

export function validateConfig(config: ScoringConfig): string[] {
  const errors: string[] = [];
  const sum = (o: object) => Object.values(o as Record<string, number>).reduce((a, b) => a + b, 0);
  if (Math.abs(sum(config.weightsPotential) - 1) > 0.001) errors.push("Os pesos do potencial devem somar 1.");
  if (Math.abs(sum(config.weightsEffort) - 1) > 0.001) errors.push("Os pesos do esforço devem somar 1.");
  if (config.priorityPotentialWeight < 0 || config.priorityPotentialWeight > 1)
    errors.push("O peso do potencial na prioridade deve estar entre 0 e 1.");
  return errors;
}
