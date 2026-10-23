import type { Quadrant, Range3, ScoredProcess } from "./types";

export interface PortfolioSummary {
  processCount: number;
  hoursPerMonth: number;
  byQuadrant: Record<Quadrant, number>;
  /** Considera apenas processos fora do quadrante "evitar". */
  monthlySavingBRL: Range3;
  investmentBRL: Range3;
  paybackMonths: Range3 | null;
  averageCompleteness: number;
}

const sumRange = (items: Range3[]): Range3 => ({
  conservative: items.reduce((a, r) => a + r.conservative, 0),
  realistic: items.reduce((a, r) => a + r.realistic, 0),
  optimistic: items.reduce((a, r) => a + r.optimistic, 0),
});

export function summarize(scored: ScoredProcess[]): PortfolioSummary {
  const byQuadrant: Record<Quadrant, number> = { COMECAR_JA: 0, PLANEJAR: 0, OPORTUNISTA: 0, EVITAR: 0 };
  for (const p of scored) byQuadrant[p.quadrant] += 1;
  const considered = scored.filter((p) => p.quadrant !== "EVITAR");
  const monthlySavingBRL = sumRange(considered.map((p) => p.monthlySavingBRL));
  const investmentBRL = sumRange(considered.map((p) => p.investmentBRL));
  const pay = (inv: number, s: number) => (s > 0 ? Math.round((inv / s) * 10) / 10 : null);
  const pc = pay(investmentBRL.conservative, monthlySavingBRL.conservative);
  const pr = pay(investmentBRL.realistic, monthlySavingBRL.realistic);
  const po = pay(investmentBRL.optimistic, monthlySavingBRL.optimistic);
  return {
    processCount: scored.length,
    hoursPerMonth: Math.round(scored.reduce((a, p) => a + p.hoursPerMonth, 0) * 10) / 10,
    byQuadrant,
    monthlySavingBRL,
    investmentBRL,
    paybackMonths:
      pc !== null && pr !== null && po !== null ? { conservative: pc, realistic: pr, optimistic: po } : null,
    averageCompleteness: scored.length
      ? Math.round((scored.reduce((a, p) => a + p.completeness, 0) / scored.length) * 100) / 100
      : 0,
  };
}
