import type { Quadrant, ScoredProcess } from "./types";
import type { PortfolioSummary } from "./summary";

export interface ProcessChange {
  key: string;
  name: string;
  priorityBefore: number;
  priorityAfter: number;
  quadrantBefore: Quadrant;
  quadrantAfter: Quadrant;
  savingRealisticBefore: number;
  savingRealisticAfter: number;
}

export interface VersionComparison {
  added: ScoredProcess[];
  removed: ScoredProcess[];
  changed: ProcessChange[];
  totals: {
    hoursPerMonth: number;
    savingRealistic: number;
    investmentRealistic: number;
  };
}

/** RF-12: compara duas versões pelo `key` estável do processo. */
export function compareVersions(
  before: ScoredProcess[],
  after: ScoredProcess[],
  summaryBefore: PortfolioSummary,
  summaryAfter: PortfolioSummary,
): VersionComparison {
  const b = new Map(before.map((p) => [p.key, p]));
  const a = new Map(after.map((p) => [p.key, p]));
  const changed: ProcessChange[] = [];
  for (const [key, pa] of a) {
    const pb = b.get(key);
    if (!pb) continue;
    if (
      pb.priority !== pa.priority ||
      pb.quadrant !== pa.quadrant ||
      pb.monthlySavingBRL.realistic !== pa.monthlySavingBRL.realistic
    ) {
      changed.push({
        key,
        name: pa.name,
        priorityBefore: pb.priority,
        priorityAfter: pa.priority,
        quadrantBefore: pb.quadrant,
        quadrantAfter: pa.quadrant,
        savingRealisticBefore: pb.monthlySavingBRL.realistic,
        savingRealisticAfter: pa.monthlySavingBRL.realistic,
      });
    }
  }
  return {
    added: after.filter((p) => !b.has(p.key)),
    removed: before.filter((p) => !a.has(p.key)),
    changed,
    totals: {
      hoursPerMonth: Math.round((summaryAfter.hoursPerMonth - summaryBefore.hoursPerMonth) * 10) / 10,
      savingRealistic: summaryAfter.monthlySavingBRL.realistic - summaryBefore.monthlySavingBRL.realistic,
      investmentRealistic: summaryAfter.investmentBRL.realistic - summaryBefore.investmentBRL.realistic,
    },
  };
}
