import type { Premises, ScoredProcess } from "./types";

export type Window = 1 | 2 | 3;

export interface RoadmapItem {
  key: string;
  name: string;
  quadrant: ScoredProcess["quadrant"];
  devHours: number;
  startWindow: Window;
  endWindow: Window;
}

export interface Roadmap {
  windows: Record<Window, RoadmapItem[]>;
  /** Itens que não cabem nos 90 dias. */
  later: ScoredProcess[];
  capacityHoursPerWindow: number;
}

const ORDER: Record<string, number> = { COMECAR_JA: 0, PLANEJAR: 1, OPORTUNISTA: 2 };

/**
 * RN-07: preenche janelas de 30 dias com a capacidade informada.
 * "Começar já" pode iniciar na janela 1; "Planejar" só na 2 (precisa de desenho antes);
 * "Oportunista" só entra se sobrar capacidade; "Evitar" nunca entra.
 * Item maior que a capacidade ocupa janelas consecutivas. Se não fecha em 90 dias, vai para "later"
 * sem consumir capacidade.
 */
export function buildRoadmap(ranked: ScoredProcess[], premises: Premises): Roadmap {
  const capacity = premises.capacityHoursPerWindow;
  const left: Record<Window, number> = { 1: capacity, 2: capacity, 3: capacity };
  const windows: Roadmap["windows"] = { 1: [], 2: [], 3: [] };
  const later: ScoredProcess[] = [];

  const queue = ranked
    .filter((p) => p.quadrant !== "EVITAR")
    .sort((a, b) => ORDER[a.quadrant]! - ORDER[b.quadrant]! || b.priority - a.priority);

  for (const p of queue) {
    const earliest: Window = p.quadrant === "PLANEJAR" ? 2 : 1;
    const trial: Record<Window, number> = { ...left };
    let remaining = p.devHours;
    let start: Window | null = null;
    let end: Window = earliest;
    for (const w of [1, 2, 3] as Window[]) {
      if (w < earliest || remaining <= 0 || trial[w] <= 0) continue;
      if (start === null) start = w;
      const used = Math.min(trial[w], remaining);
      trial[w] -= used;
      remaining -= used;
      end = w;
    }
    if (remaining > 0 || start === null) {
      later.push(p);
      continue;
    }
    left[1] = trial[1];
    left[2] = trial[2];
    left[3] = trial[3];
    windows[start].push({
      key: p.key,
      name: p.name,
      quadrant: p.quadrant,
      devHours: p.devHours,
      startWindow: start,
      endWindow: end,
    });
  }
  return { windows, later, capacityHoursPerWindow: capacity };
}
