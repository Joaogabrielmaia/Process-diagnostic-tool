/**
 * Análise de sensibilidade (docs/03-metodologia/sensibilidade.md).
 * Varia UMA premissa por vez sobre o diagnóstico completo da Clínica Vida Plena e imprime tabelas em Markdown.
 * Uso: npm run sensitivity
 */
import { DEFAULT_PREMISES, rankProcesses, summarize, type Premises } from "../src/lib/scoring";
import { PROCESSES_V2 } from "../src/lib/seed-data";

const brl = (n: number) => `R$ ${n.toLocaleString("pt-BR")}`;

function run(overrides: Partial<Premises>) {
  const premises = { ...DEFAULT_PREMISES, ...overrides };
  const ranked = rankProcesses(PROCESSES_V2, undefined, premises);
  return { ranked, summary: summarize(ranked) };
}

function table(title: string, label: string, values: number[], key: keyof Premises, fmt: (v: number) => string) {
  console.log(`\n### ${title}\n`);
  console.log(`| ${label} | Economia mensal (conserv. / realista / otimista) | Payback realista (meses) | 1º do ranking |`);
  console.log("|---|---|---|---|");
  for (const v of values) {
    const { ranked, summary } = run({ [key]: v });
    const s = summary.monthlySavingBRL;
    console.log(
      `| ${fmt(v)} | ${brl(s.conservative)} / ${brl(s.realistic)} / ${brl(s.optimistic)} | ${summary.paybackMonths?.realistic ?? "n/d"} | ${ranked[0]?.name} |`,
    );
  }
}

console.log("# Saída bruta do script de sensibilidade\n");
const base = run({});
console.log(
  `Base: economia realista ${brl(base.summary.monthlySavingBRL.realistic)}/mês, investimento realista ${brl(base.summary.investmentBRL.realistic)}, payback ${base.summary.paybackMonths?.realistic} meses.`,
);

table("Custo da hora", "Custo da hora", [28, 35, 42, 50, 60], "hourlyCostBRL", (v) => brl(v));
table("Redução esperada (cenário realista)", "Redução realista", [0.4, 0.5, 0.6, 0.7], "reductionRealistic", (v) => `${v * 100}%`);
table("Hora do consultor", "Hora do consultor", [100, 150, 200, 250], "consultantRateBRL", (v) => brl(v));

console.log("\n### Elasticidade do custo da hora (variação de ±20% sobre R$ 42)\n");
const lo = run({ hourlyCostBRL: 42 * 0.8 }).summary.monthlySavingBRL.realistic;
const hi = run({ hourlyCostBRL: 42 * 1.2 }).summary.monthlySavingBRL.realistic;
console.log(`Economia realista: ${brl(lo)} (−20%) → ${brl(base.summary.monthlySavingBRL.realistic)} (base) → ${brl(hi)} (+20%).`);

console.log("\n### O ranking muda quando o custo da hora muda?\n");
const orders = [28, 42, 60].map((c) => run({ hourlyCostBRL: c }).ranked.map((p) => p.key).join(","));
console.log(orders.every((o) => o === orders[0]) ? "Não: a ordem é idêntica em R$ 28, R$ 42 e R$ 60." : "Sim: a ordem muda.");
console.log("(Motivo: o custo da hora multiplica a economia em R$, mas a prioridade usa apenas potencial e esforço.)");

console.log("\n### Quadrante muda se o limiar de potencial variar? (quantidade por quadrante)\n");
console.log("| Limiar de potencial | Começar já | Planejar | Oportunista | Evitar |");
console.log("|---|---|---|---|---|");
import { DEFAULT_CONFIG } from "../src/lib/scoring";
for (const t of [40, 45, 50, 55, 60]) {
  const ranked = rankProcesses(PROCESSES_V2, { ...DEFAULT_CONFIG, potentialThreshold: t });
  const q = summarize(ranked).byQuadrant;
  console.log(`| ${t} | ${q.COMECAR_JA} | ${q.PLANEJAR} | ${q.OPORTUNISTA} | ${q.EVITAR} |`);
}
