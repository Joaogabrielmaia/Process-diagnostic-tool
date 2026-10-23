import type { Premises, Range3, Roadmap, ScoredProcess } from "./scoring";
import { QUADRANT_LABEL, brl, num } from "./format";

const WINDOW_LABEL = { 1: "Dias 1 a 30", 2: "Dias 31 a 60", 3: "Dias 61 a 90" } as const;

export interface ProposalScopeItem {
  name: string;
  quadrant: string;
  window: string;
  devHours: number;
  investmentBRL: Range3;
  monthlySavingBRL: Range3;
}

export interface Proposal {
  title: string;
  clientName: string;
  scope: ProposalScopeItem[];
  deferred: string[];
  investmentBRL: Range3;
  monthlySavingBRL: Range3;
  paybackRealisticMonths: number | null;
  assumptions: string[];
  exclusions: string[];
  toFill: string[];
}

const sum = (items: Range3[]): Range3 => ({
  conservative: items.reduce((a, r) => a + r.conservative, 0),
  realistic: items.reduce((a, r) => a + r.realistic, 0),
  optimistic: items.reduce((a, r) => a + r.optimistic, 0),
});

/**
 * RF-17: o escopo da proposta é exatamente o que o roteiro 30/60/90 conseguiu agendar.
 * Itens que não cabem nos 90 dias ficam como "fase seguinte", fora do valor. Função pura.
 */
export function buildProposal(input: {
  clientName: string;
  versionNumber: number;
  ranked: ScoredProcess[];
  roadmap: Roadmap;
  premises: Premises;
}): Proposal {
  const byKey = new Map(input.ranked.map((p) => [p.key, p]));
  const scope: ProposalScopeItem[] = [];
  for (const w of [1, 2, 3] as const) {
    for (const item of input.roadmap.windows[w]) {
      const p = byKey.get(item.key)!;
      scope.push({
        name: p.name,
        quadrant: QUADRANT_LABEL[p.quadrant],
        window: item.endWindow > item.startWindow ? `${WINDOW_LABEL[item.startWindow]} (segue até a janela ${item.endWindow})` : WINDOW_LABEL[item.startWindow],
        devHours: p.devHours,
        investmentBRL: p.investmentBRL,
        monthlySavingBRL: p.monthlySavingBRL,
      });
    }
  }
  const investmentBRL = sum(scope.map((s) => s.investmentBRL));
  const monthlySavingBRL = sum(scope.map((s) => s.monthlySavingBRL));
  const { premises: pr } = input;

  return {
    title: `Proposta de automação para ${input.clientName}`,
    clientName: input.clientName,
    scope,
    deferred: input.roadmap.later.map((p) => p.name),
    investmentBRL,
    monthlySavingBRL,
    paybackRealisticMonths:
      monthlySavingBRL.realistic > 0
        ? Math.round((investmentBRL.realistic / monthlySavingBRL.realistic) * 10) / 10
        : null,
    assumptions: [
      `Custo da hora do time: ${brl(pr.hourlyCostBRL)}.`,
      `Redução de tempo esperada: ${Math.round(pr.reductionConservative * 100)}% (conservador), ${Math.round(pr.reductionRealistic * 100)}% (realista) e ${Math.round(pr.reductionOptimistic * 100)}% (otimista).`,
      `Hora do consultor: ${brl(pr.consultantRateBRL)}; capacidade de ${num(pr.capacityHoursPerWindow, 0)} horas de implantação a cada 30 dias.`,
      "Os tempos e volumes vieram do levantamento com o cliente, não de medição; faixas já refletem dados faltantes.",
      `Base: diagnóstico, versão ${input.versionNumber}.`,
    ],
    exclusions: [
      "Licenças, hospedagem e manutenção recorrente das ferramentas.",
      "Treinamento além do necessário para a entrada em uso.",
      "Processos fora do escopo acima e itens listados como fase seguinte.",
      "Ganhos indiretos (menos faltas, maior satisfação) não compõem o cálculo.",
    ],
    toFill: [
      "Condições de pagamento",
      "Prazo de validade da proposta",
      "Responsáveis do cliente por cada entrega",
      "Cláusulas de proteção de dados (LGPD) e papel de operador",
    ],
  };
}

export function proposalToMarkdown(p: Proposal, dateLabel: string): string {
  const range = (r: Range3) => `${brl(r.optimistic)} a ${brl(r.conservative)}`;
  const savingRange = (r: Range3) => `${brl(r.conservative)} a ${brl(r.optimistic)}`;
  const lines: string[] = [
    `# ${p.title}`,
    "",
    `*Atalho Automação · ${dateLabel}*`,
    "",
    "> Estudo de caso fictício. Valores são estimativas calculadas a partir dos dados informados, não resultados medidos.",
    "",
    "## 1. Escopo",
    "",
  ];
  if (p.scope.length === 0) {
    lines.push("Nenhum processo coube no roteiro de 90 dias com as premissas atuais.", "");
  } else {
    lines.push("| Processo | Quadrante | Janela | Horas | Investimento (faixa) |", "|---|---|---|---|---|");
    for (const s of p.scope) {
      lines.push(`| ${s.name} | ${s.quadrant} | ${s.window} | ${num(s.devHours, 0)} | ${range(s.investmentBRL)} |`);
    }
    lines.push("");
  }
  if (p.deferred.length) {
    lines.push(`**Fase seguinte (fora do valor desta proposta):** ${p.deferred.join("; ")}.`, "");
  }
  lines.push(
    "## 2. Investimento e retorno estimado",
    "",
    `- **Investimento:** ${range(p.investmentBRL)} (valor-base: ${brl(p.investmentBRL.realistic)}).`,
    `- **Economia mensal estimada:** ${savingRange(p.monthlySavingBRL)} (cenário realista: ${brl(p.monthlySavingBRL.realistic)}).`,
    `- **Payback (cenário realista):** ${p.paybackRealisticMonths === null ? "não calculável" : `${num(p.paybackRealisticMonths)} meses`}.`,
    "",
    "## 3. Premissas",
    "",
    ...p.assumptions.map((a) => `- ${a}`),
    "",
    "## 4. O que não está incluído",
    "",
    ...p.exclusions.map((e) => `- ${e}`),
    "",
    "## 5. A preencher pelo consultor antes de enviar",
    "",
    ...p.toFill.map((t) => `- [ ] ${t}`),
    "",
  );
  return lines.join("\n");
}
