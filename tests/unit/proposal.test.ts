import { describe, expect, it } from "vitest";
import { DEFAULT_PREMISES, buildRoadmap, rankProcesses } from "@/lib/scoring";
import { PROCESSES_V2 } from "@/lib/seed-data";
import { buildProposal, proposalToMarkdown } from "@/lib/proposal";

const ranked = rankProcesses(PROCESSES_V2);
const roadmap = buildRoadmap(ranked, DEFAULT_PREMISES);
const proposal = buildProposal({
  clientName: "Clínica Vida Plena",
  versionNumber: 2,
  ranked,
  roadmap,
  premises: DEFAULT_PREMISES,
});

describe("proposta (RF-17)", () => {
  it("o escopo é exatamente o que foi agendado no roteiro de 90 dias", () => {
    const scheduled = Object.values(roadmap.windows).flat().map((i) => i.name);
    expect(proposal.scope.map((s) => s.name).sort()).toEqual([...scheduled].sort());
    expect(proposal.scope.length).toBeGreaterThan(0);
  });

  it("itens fora dos 90 dias ficam como fase seguinte e não entram no valor", () => {
    expect(proposal.deferred).toEqual(roadmap.later.map((p) => p.name));
    const expected = proposal.scope.reduce((a, s) => a + s.investmentBRL.realistic, 0);
    expect(proposal.investmentBRL.realistic).toBe(expected);
  });

  it("processos em 'evitar' nunca entram no escopo nem na fase seguinte", () => {
    const avoid = ranked.filter((p) => p.quadrant === "EVITAR").map((p) => p.name);
    for (const name of avoid) {
      expect(proposal.scope.map((s) => s.name)).not.toContain(name);
      expect(proposal.deferred).not.toContain(name);
    }
  });

  it("a faixa de investimento é coerente: otimista ≤ realista ≤ conservador", () => {
    const { investmentBRL: i, monthlySavingBRL: s } = proposal;
    expect(i.optimistic).toBeLessThanOrEqual(i.realistic);
    expect(i.realistic).toBeLessThanOrEqual(i.conservative);
    expect(s.conservative).toBeLessThanOrEqual(s.realistic);
    expect(s.realistic).toBeLessThanOrEqual(s.optimistic);
  });

  it("payback é investimento ÷ economia, ambos realistas", () => {
    const expected = Math.round((proposal.investmentBRL.realistic / proposal.monthlySavingBRL.realistic) * 10) / 10;
    expect(proposal.paybackRealisticMonths).toBe(expected);
  });

  it("sem escopo, o payback não é calculável e o texto avisa", () => {
    const empty = buildProposal({
      clientName: "X",
      versionNumber: 1,
      ranked: [],
      roadmap: buildRoadmap([], DEFAULT_PREMISES),
      premises: DEFAULT_PREMISES,
    });
    expect(empty.paybackRealisticMonths).toBeNull();
    expect(proposalToMarkdown(empty, "hoje")).toContain("Nenhum processo coube");
  });

  it("o Markdown traz as seções, a lista a preencher e o aviso de estimativa, sem promessa de resultado", () => {
    const md = proposalToMarkdown(proposal, "23 de outubro de 2026");
    for (const h of ["## 1. Escopo", "## 2. Investimento e retorno estimado", "## 3. Premissas", "## 4. O que não está incluído", "## 5. A preencher pelo consultor antes de enviar"]) {
      expect(md).toContain(h);
    }
    expect(md).toContain("- [ ] Condições de pagamento");
    expect(md).toContain("estimativas calculadas");
    expect(md).not.toMatch(/reduziu|garantimos|garantido/i);
  });
});
