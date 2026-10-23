import { describe, expect, it } from "vitest";
import {
  DEFAULT_PREMISES,
  buildRoadmap,
  compareVersions,
  rankProcesses,
  summarize,
  type ProcessInput,
} from "@/lib/scoring";
import { PROCESSES_V1, PROCESSES_V2 } from "@/lib/seed-data";
import { MockProvider, generateSummarySafely, getSummaryProvider } from "@/lib/summary/provider";
import { premisesSchema, processFormSchema } from "@/lib/validation";

describe("resumo do portfólio", () => {
  it("soma só o que está fora de 'evitar' e conta por quadrante", () => {
    const ranked = rankProcesses(PROCESSES_V2);
    const s = summarize(ranked);
    const expected = ranked
      .filter((p) => p.quadrant !== "EVITAR")
      .reduce((a, p) => a + p.monthlySavingBRL.realistic, 0);
    expect(s.monthlySavingBRL.realistic).toBe(expected);
    expect(Object.values(s.byQuadrant).reduce((a, b) => a + b, 0)).toBe(s.processCount);
    expect(s.hoursPerMonth).toBeCloseTo(ranked.reduce((a, p) => a + p.hoursPerMonth, 0), 1);
  });

  it("lida com lista vazia", () => {
    const s = summarize([]);
    expect(s.processCount).toBe(0);
    expect(s.paybackMonths).toBeNull();
    expect(s.averageCompleteness).toBe(0);
  });
});

describe("roteiro 30/60/90 (RN-07)", () => {
  const ranked = rankProcesses(PROCESSES_V2);

  it("nunca agenda mais horas do que a capacidade total dos 90 dias", () => {
    const road = buildRoadmap(ranked, DEFAULT_PREMISES);
    const scheduled = Object.values(road.windows).flat();
    expect(scheduled.length).toBeGreaterThan(0);
    const totalHours = scheduled.reduce((a, i) => a + i.devHours, 0);
    expect(totalHours).toBeLessThanOrEqual(DEFAULT_PREMISES.capacityHoursPerWindow * 3 + 0.001);
  });

  it("'planejar' nunca começa na primeira janela e 'evitar' nunca entra", () => {
    const road = buildRoadmap(ranked, DEFAULT_PREMISES);
    expect(road.windows[1].every((i) => i.quadrant !== "PLANEJAR")).toBe(true);
    const keys = [...Object.values(road.windows).flat().map((i) => i.key), ...road.later.map((p) => p.key)];
    for (const p of ranked.filter((r) => r.quadrant === "EVITAR")) expect(keys).not.toContain(p.key);
  });

  it("'começar já' tem prioridade sobre 'planejar' na mesma capacidade", () => {
    const road = buildRoadmap(ranked, DEFAULT_PREMISES);
    expect(road.windows[1].map((i) => i.quadrant)).toContain("COMECAR_JA");
  });

  it("com capacidade zerada nada é agendado", () => {
    const road = buildRoadmap(ranked, { ...DEFAULT_PREMISES, capacityHoursPerWindow: 0 });
    expect(Object.values(road.windows).flat()).toHaveLength(0);
    expect(road.later.length).toBe(ranked.filter((p) => p.quadrant !== "EVITAR").length);
  });

  it("item maior que a janela ocupa janelas consecutivas", () => {
    const road = buildRoadmap(ranked, { ...DEFAULT_PREMISES, capacityHoursPerWindow: 30 });
    const multi = Object.values(road.windows)
      .flat()
      .filter((i) => i.endWindow > i.startWindow);
    expect(multi.length).toBeGreaterThan(0);
  });

  it("uma tarefa que não fecha em 90 dias vai para 'depois' sem consumir capacidade", () => {
    const one: ProcessInput = { ...PROCESSES_V2[0]! };
    const big = rankProcesses([one]);
    const road = buildRoadmap(big, { ...DEFAULT_PREMISES, capacityHoursPerWindow: 5 });
    expect(road.later).toHaveLength(1);
    const smallOne = rankProcesses([{ ...one, key: "x" }]);
    const road2 = buildRoadmap([...big, ...smallOne], { ...DEFAULT_PREMISES, capacityHoursPerWindow: 5 });
    expect(road2.later).toHaveLength(2);
  });
});

describe("comparação de versões (RF-12)", () => {
  const v1 = rankProcesses(PROCESSES_V1);
  const v2 = rankProcesses(PROCESSES_V2);
  const cmp = compareVersions(v1, v2, summarize(v1), summarize(v2));

  it("detecta processos adicionados na versão nova", () => {
    expect(cmp.added.map((p) => p.key).sort()).toEqual(["vp-admissao", "vp-folha"]);
    expect(cmp.removed).toEqual([]);
  });

  it("detecta processos que mudaram de prioridade ou quadrante", () => {
    expect(cmp.changed.length).toBeGreaterThan(0);
    for (const c of cmp.changed) {
      expect(
        c.priorityBefore !== c.priorityAfter ||
          c.quadrantBefore !== c.quadrantAfter ||
          c.savingRealisticBefore !== c.savingRealisticAfter,
      ).toBe(true);
    }
  });

  it("calcula a diferença dos totais", () => {
    expect(cmp.totals.hoursPerMonth).toBeCloseTo(summarize(v2).hoursPerMonth - summarize(v1).hoursPerMonth, 1);
  });

  it("comparar uma versão consigo mesma não acusa mudança", () => {
    const same = compareVersions(v2, v2, summarize(v2), summarize(v2));
    expect(same.added).toEqual([]);
    expect(same.removed).toEqual([]);
    expect(same.changed).toEqual([]);
    expect(same.totals).toEqual({ hoursPerMonth: 0, savingRealistic: 0, investmentRealistic: 0 });
  });

  it("a versão 1 tem dados faltantes e menor completude que a 2", () => {
    expect(summarize(v1).averageCompleteness).toBeLessThan(summarize(v2).averageCompleteness);
  });
});

describe("validação de formulário", () => {
  const base = { name: "Processo X", area: "RH", frequency: "MENSAL", tools: "Excel, Papel" };

  it("campo vazio vira null (dado faltante), não zero", () => {
    const r = processFormSchema.parse({ ...base, errorRatePct: "", people: "", sensitiveData: "" });
    expect(r.errorRatePct).toBeNull();
    expect(r.people).toBeNull();
    expect(r.sensitiveData).toBeNull();
    expect(r.tools).toEqual(["Excel", "Papel"]);
  });

  it("recusa valores fora de faixa", () => {
    expect(processFormSchema.safeParse({ ...base, standardization: 9 }).success).toBe(false);
    expect(processFormSchema.safeParse({ ...base, errorRatePct: 120 }).success).toBe(false);
    expect(processFormSchema.safeParse({ ...base, name: "ab" }).success).toBe(false);
    expect(processFormSchema.safeParse({ ...base, area: "OUTRA" }).success).toBe(false);
  });

  it("premissas exigem cenários em ordem crescente", () => {
    const ok = { ...DEFAULT_PREMISES };
    expect(premisesSchema.safeParse(ok).success).toBe(true);
    expect(premisesSchema.safeParse({ ...ok, reductionConservative: 0.9 }).success).toBe(false);
    expect(premisesSchema.safeParse({ ...ok, minDevHours: 500 }).success).toBe(false);
  });
});

describe("resumo por IA (ADR-001)", () => {
  const ranked = rankProcesses(PROCESSES_V2);
  const input = { clientName: "Clínica Vida Plena", sector: "Saúde", ranked, summary: summarize(ranked) };

  it("o MockProvider cita só números já calculados e avisa que são estimativas", async () => {
    const text = await new MockProvider().generate(input);
    expect(text).toContain("14 processos");
    expect(text).toContain("estimativas");
    expect(text).not.toMatch(/reduziu/i);
  });

  it("sem chave, usa o mock mesmo se pedirem anthropic", () => {
    expect(getSummaryProvider({ SUMMARY_PROVIDER: "anthropic" } as unknown as NodeJS.ProcessEnv).name).toBe("mock");
    expect(getSummaryProvider({} as unknown as NodeJS.ProcessEnv).name).toBe("mock");
  });

  it("se o provedor falhar, o relatório cai no mock", async () => {
    const broken = {
      name: "quebrado",
      generate: async () => {
        throw new Error("sem rede");
      },
    };
    const r = await generateSummarySafely(input, broken);
    expect(r.fellBack).toBe(true);
    expect(r.provider).toBe("mock");
    expect(r.text.length).toBeGreaterThan(20);
  });
});
