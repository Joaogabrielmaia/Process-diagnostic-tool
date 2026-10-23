import { describe, expect, it } from "vitest";
import {
  DEFAULT_CONFIG,
  DEFAULT_PREMISES,
  frequencyScore,
  hoursScore,
  impactScore,
  integrationScore,
  quadrantOf,
  rankProcesses,
  riskScore,
  scaleFrom5,
  scoreProcess,
  validateConfig,
  volumeScore,
  type ProcessInput,
  type ScoringConfig,
} from "@/lib/scoring";

/** Processo de referência cujas contas estão feitas à mão em docs/03-metodologia/exemplos-de-calculo.md. */
const reference: ProcessInput = {
  key: "ref",
  name: "Processo de referência",
  area: "OPERACAO",
  frequency: "DIARIA",
  volumePerExecution: 10,
  minutesPerExecution: 30,
  people: 2,
  tools: ["Google Sheets"],
  standardization: 5,
  errorRatePct: 10,
  dataDigitization: 5,
  dependencies: 0,
  sensitiveData: "NENHUM",
};

const hardCase: ProcessInput = {
  ...reference,
  key: "hard",
  name: "Caso difícil",
  frequency: "EVENTUAL",
  volumePerExecution: 1,
  minutesPerExecution: 20,
  people: 1,
  tools: ["Papel"],
  standardization: 1,
  errorRatePct: 0,
  dataDigitization: 1,
  dependencies: 5,
  sensitiveData: "SAUDE_FINANCEIRO",
};

describe("critérios individuais (RN-01)", () => {
  it.each([
    [30, 100],
    [20, 100],
    [19.99, 80],
    [8, 80],
    [4.33, 60],
    [4, 60],
    [2, 40],
    [1, 25],
    [0.5, 10],
  ])("frequência de %s execuções/mês vale %s", (n, expected) => {
    expect(frequencyScore(n)).toBe(expected);
  });

  it.each([
    [5000, 100],
    [1000, 100],
    [999, 80],
    [300, 80],
    [100, 60],
    [30, 40],
    [29, 20],
    [0, 20],
  ])("volume de %s itens/mês vale %s", (n, expected) => {
    expect(volumeScore(n)).toBe(expected);
  });

  it.each([
    [150, 100],
    [100, 100],
    [50, 80],
    [20, 60],
    [8, 40],
    [7.9, 20],
  ])("%s horas/mês valem %s de impacto-tempo", (n, expected) => {
    expect(hoursScore(n)).toBe(expected);
  });

  it("impacto mistura 75% tempo e 25% erro, com erro saturando em 25%", () => {
    expect(impactScore(20, 10)).toBe(0.75 * 60 + 0.25 * 40);
    expect(impactScore(20, 25)).toBe(0.75 * 60 + 25);
    expect(impactScore(20, 80)).toBe(0.75 * 60 + 25);
    expect(impactScore(0, 0)).toBe(0.75 * 20);
  });

  it("converte nota 1-5 em 0-100 e trava valores fora da faixa", () => {
    expect(scaleFrom5(1)).toBe(0);
    expect(scaleFrom5(3)).toBe(50);
    expect(scaleFrom5(5)).toBe(100);
    expect(scaleFrom5(9)).toBe(100);
    expect(scaleFrom5(-2)).toBe(0);
  });

  it("risco soma dado sensível e dependências (máx. 5), limitado a 100", () => {
    expect(riskScore("NENHUM", 0)).toBe(0);
    expect(riskScore("PESSOAL", 2)).toBe(52);
    expect(riskScore("SAUDE_FINANCEIRO", 5)).toBe(100);
    expect(riskScore("SAUDE_FINANCEIRO", 40)).toBe(100);
    expect(riskScore("NENHUM", 40)).toBe(30);
  });

  it("integração: média das ferramentas, desconhecida vira 2,5 e é sinalizada", () => {
    const known = integrationScore(["Google Sheets", "Papel"], DEFAULT_CONFIG);
    expect(known.score).toBe(scaleFrom5(3));
    expect(known.unknownTools).toEqual([]);
    const unknown = integrationScore(["Ferramenta X"], DEFAULT_CONFIG);
    expect(unknown.score).toBe(scaleFrom5(2.5));
    expect(unknown.unknownTools).toEqual(["Ferramenta X"]);
  });

  it("integração ignora maiúsculas e espaços nas pontas", () => {
    expect(integrationScore(["  GOOGLE SHEETS "], DEFAULT_CONFIG).score).toBe(100);
  });
});

describe("pontuação completa de um processo", () => {
  const r = scoreProcess(reference);

  it("calcula horas por mês: execuções × minutos × pessoas / 60", () => {
    expect(r.executionsPerMonth).toBe(22);
    expect(r.hoursPerMonth).toBe(22);
  });

  it("calcula potencial, esforço e prioridade como no exemplo manual", () => {
    expect(r.criteria).toEqual({
      frequency: 100,
      volume: 60,
      repetitiveness: 100,
      digitization: 100,
      integration: 100,
      risk: 0,
      impact: 55,
    });
    expect(r.potential).toBe(76);
    expect(r.effort).toBe(0);
    expect(r.priority).toBe(85.6);
    expect(r.quadrant).toBe("COMECAR_JA");
  });

  it("calcula retorno nos três cenários e o investimento", () => {
    expect(r.devHours).toBe(16);
    expect(r.monthlySavingBRL).toEqual({ conservative: 370, realistic: 554, optimistic: 739 });
    expect(r.investmentBRL).toEqual({ conservative: 3360, realistic: 2400, optimistic: 2040 });
    expect(r.paybackMonths).toEqual({ conservative: 9.1, realistic: 4.3, optimistic: 2.8 });
  });

  it("caso difícil cai em 'evitar' e tem esforço máximo de risco", () => {
    const h = scoreProcess(hardCase);
    expect(h.criteria.risk).toBe(100);
    expect(h.effort).toBe(100 * 0.35 + 100 * 0.35 + 100 * 0.3);
    expect(h.devHours).toBe(DEFAULT_PREMISES.maxDevHours);
    expect(h.quadrant).toBe("EVITAR");
  });

  it("é determinística: mesma entrada, mesma saída", () => {
    expect(scoreProcess(reference)).toEqual(scoreProcess({ ...reference }));
  });

  it("o resultado completo está em faixas válidas para entradas variadas", () => {
    const freqs = ["DIARIA", "SEMANAL", "QUINZENAL", "MENSAL", "EVENTUAL"] as const;
    for (const frequency of freqs) {
      for (const std of [1, 3, 5]) {
        for (const sens of ["NENHUM", "PESSOAL", "SAUDE_FINANCEIRO"] as const) {
          const s = scoreProcess({ ...reference, frequency, standardization: std, sensitiveData: sens });
          for (const v of [s.potential, s.effort, s.priority, ...Object.values(s.criteria)]) {
            expect(v).toBeGreaterThanOrEqual(0);
            expect(v).toBeLessThanOrEqual(100);
          }
          expect(s.monthlySavingBRL.conservative).toBeLessThanOrEqual(s.monthlySavingBRL.realistic);
          expect(s.monthlySavingBRL.realistic).toBeLessThanOrEqual(s.monthlySavingBRL.optimistic);
          expect(s.investmentBRL.optimistic).toBeLessThanOrEqual(s.investmentBRL.realistic);
          expect(s.investmentBRL.realistic).toBeLessThanOrEqual(s.investmentBRL.conservative);
        }
      }
    }
  });
});

describe("monotonicidade", () => {
  it("mais tempo gasto nunca reduz o potencial nem a economia", () => {
    let prev = scoreProcess({ ...reference, minutesPerExecution: 1 });
    for (const minutes of [5, 15, 30, 60, 120, 240]) {
      const cur = scoreProcess({ ...reference, minutesPerExecution: minutes });
      expect(cur.potential).toBeGreaterThanOrEqual(prev.potential);
      expect(cur.monthlySavingBRL.realistic).toBeGreaterThanOrEqual(prev.monthlySavingBRL.realistic);
      prev = cur;
    }
  });

  it("dado mais sensível nunca reduz o esforço", () => {
    const efforts = (["NENHUM", "PESSOAL", "SAUDE_FINANCEIRO"] as const).map(
      (sensitiveData) => scoreProcess({ ...reference, sensitiveData }).effort,
    );
    expect(efforts).toEqual([...efforts].sort((a, b) => a - b));
    expect(new Set(efforts).size).toBe(3);
  });

  it("dados mais digitalizados nunca aumentam o esforço", () => {
    const efforts = [1, 2, 3, 4, 5].map((dataDigitization) => scoreProcess({ ...reference, dataDigitization }).effort);
    expect(efforts).toEqual([...efforts].sort((a, b) => b - a));
  });
});

describe("dado faltante (RN-08)", () => {
  const blank: ProcessInput = {
    ...reference,
    volumePerExecution: null,
    minutesPerExecution: null,
    people: null,
    tools: [],
    standardization: null,
    errorRatePct: null,
    dataDigitization: null,
    dependencies: null,
    sensitiveData: null,
  };

  it("lista os campos faltantes e reduz a completude", () => {
    const s = scoreProcess(blank);
    expect(s.missingFields).toHaveLength(9);
    expect(s.completeness).toBe(0);
    expect(scoreProcess(reference).completeness).toBe(1);
    expect(scoreProcess({ ...reference, errorRatePct: null }).completeness).toBe(0.89);
  });

  it("usa padrões cautelosos: 30 min, 1 pessoa, dado pessoal", () => {
    const s = scoreProcess(blank);
    expect(s.hoursPerMonth).toBe(11);
    expect(s.criteria.risk).toBe(40 + 2 * 6);
  });

  it("alarga a faixa de retorno: o conservador cai mais do que o realista", () => {
    const full = scoreProcess({ ...reference, errorRatePct: null });
    const ref = scoreProcess(reference);
    expect(full.monthlySavingBRL.optimistic).toBe(ref.monthlySavingBRL.optimistic);
    expect(full.monthlySavingBRL.conservative).toBeLessThan(ref.monthlySavingBRL.conservative);
    const cut = (a: number, b: number) => (b - a) / b;
    expect(cut(full.monthlySavingBRL.conservative, ref.monthlySavingBRL.conservative)).toBeGreaterThan(
      cut(full.monthlySavingBRL.realistic, ref.monthlySavingBRL.realistic),
    );
  });

  it("dependências = 0 é um dado válido, não faltante", () => {
    expect(scoreProcess({ ...reference, dependencies: 0 }).missingFields).not.toContain("dependências");
  });
});

describe("payback", () => {
  it("é nulo quando não há economia", () => {
    const s = scoreProcess({ ...reference, minutesPerExecution: 0 });
    expect(s.hoursPerMonth).toBe(0);
    expect(s.paybackMonths).toBeNull();
  });
});

describe("quadrantes (RN-04)", () => {
  const cfg = DEFAULT_CONFIG;
  it.each([
    [50, 49.9, "COMECAR_JA"],
    [80, 10, "COMECAR_JA"],
    [50, 50, "PLANEJAR"],
    [90, 90, "PLANEJAR"],
    [49.9, 49.9, "OPORTUNISTA"],
    [49.9, 50, "EVITAR"],
    [0, 100, "EVITAR"],
  ] as const)("potencial %s e esforço %s => %s", (p, e, q) => {
    expect(quadrantOf(p, e, cfg)).toBe(q);
  });

  it("respeita limiares configurados", () => {
    const cfg2: ScoringConfig = { ...cfg, potentialThreshold: 80 };
    expect(quadrantOf(76, 0, cfg2)).toBe("OPORTUNISTA");
  });
});

describe("ranking (RN-05)", () => {
  it("ordena por prioridade e é estável nos empates", () => {
    const a = { ...reference, key: "a", name: "A" };
    const b = { ...reference, key: "b", name: "B" };
    const c = { ...hardCase, key: "c", name: "C" };
    const ranked = rankProcesses([c, b, a]);
    expect(ranked.map((p) => p.name)).toEqual(["A", "B", "C"]);
  });

  it("não altera o array de entrada", () => {
    const input = [hardCase, reference];
    const copy = structuredClone(input);
    rankProcesses(input);
    expect(input).toEqual(copy);
  });
});

describe("configuração (RN-09)", () => {
  it("a configuração padrão é válida", () => {
    expect(validateConfig(DEFAULT_CONFIG)).toEqual([]);
  });

  it("recusa pesos que não somam 1", () => {
    const bad: ScoringConfig = {
      ...DEFAULT_CONFIG,
      weightsPotential: { ...DEFAULT_CONFIG.weightsPotential, impact: 0.9 },
    };
    expect(validateConfig(bad)).toContain("Os pesos do potencial devem somar 1.");
    const bad2: ScoringConfig = { ...DEFAULT_CONFIG, weightsEffort: { digitization: 0.5, integration: 0.5, risk: 0.5 } };
    expect(validateConfig(bad2)).toContain("Os pesos do esforço devem somar 1.");
    expect(validateConfig({ ...DEFAULT_CONFIG, priorityPotentialWeight: 1.2 })).toHaveLength(1);
  });

  it("mudar um peso muda o resultado de forma previsível", () => {
    const heavy: ScoringConfig = {
      ...DEFAULT_CONFIG,
      weightsPotential: { frequency: 0.1, volume: 0.1, repetitiveness: 0.1, impact: 0.7 },
    };
    // referência: 100*.1 + 60*.1 + 100*.1 + 55*.7 = 10 + 6 + 10 + 38.5
    expect(scoreProcess(reference, heavy).potential).toBe(64.5);
  });
});
