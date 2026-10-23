import { describe, expect, it } from "vitest";
import { buildRisks } from "@/lib/report";
import { rankProcesses } from "@/lib/scoring";
import { PROCESSES_V1, PROCESSES_V2 } from "@/lib/seed-data";

describe("riscos do relatório (RN-10)", () => {
  it("dispara LGPD só por processos candidatos com dado de saúde ou financeiro", () => {
    const ranked = rankProcesses(PROCESSES_V2);
    const lgpd = buildRisks(ranked).find((r) => r.id === "LGPD");
    expect(lgpd).toBeDefined();
    const candidates = new Set(ranked.filter((p) => p.quadrant !== "EVITAR").map((p) => p.name));
    for (const name of lgpd!.processes) expect(candidates.has(name)).toBe(true);
    expect(lgpd!.processes).toContain("Registro de evolução no prontuário");
  });

  it("ignora processos em 'evitar'", () => {
    const ranked = rankProcesses(PROCESSES_V2);
    const all = buildRisks(ranked).flatMap((r) => r.processes);
    expect(all).not.toContain("Coleta de ponto e variáveis da folha");
  });

  it("sem processos, sem riscos", () => {
    expect(buildRisks([])).toEqual([]);
  });

  it("dados faltantes geram o risco DADOS na versão 1 e não na 2", () => {
    const v1 = buildRisks(rankProcesses(PROCESSES_V1)).map((r) => r.id);
    const v2 = buildRisks(rankProcesses(PROCESSES_V2)).map((r) => r.id);
    expect(v2).not.toContain("DADOS");
    expect(v1.length).toBeGreaterThan(0);
  });
});
