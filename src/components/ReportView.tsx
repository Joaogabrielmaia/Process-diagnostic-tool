import { MatrixChart } from "./MatrixChart";
import { QuadrantBadge } from "./Badges";
import {
  AREA_LABEL,
  QUADRANT_HINT,
  QUADRANT_LABEL,
  brl,
  dateBR,
  num,
  rangeBRL,
} from "@/lib/format";
import { LIMITATIONS, buildRisks } from "@/lib/report";
import { QUADRANTS } from "@/lib/scoring";
import { generateSummarySafely } from "@/lib/summary/provider";
import type { Ctx } from "@/app/(app)/diagnosticos/[id]/ctx";

const WINDOW_LABEL = { 1: "Dias 1 a 30", 2: "Dias 31 a 60", 3: "Dias 61 a 90" } as const;

export async function ReportView({ ctx }: { ctx: Ctx }) {
  const { diagnosis, version, ranked, summary, roadmap, premises, config } = ctx;
  const summaryText = await generateSummarySafely({
    clientName: diagnosis.clientName,
    sector: diagnosis.sector,
    ranked,
    summary,
  });
  const risks = buildRisks(ranked);
  const rankOf = new Map(ranked.map((p, i) => [p.key, i + 1]));
  const scope = ranked.filter((p) => p.quadrant === "COMECAR_JA" || p.quadrant === "PLANEJAR");
  const scopeInv = {
    conservative: scope.reduce((a, p) => a + p.investmentBRL.conservative, 0),
    realistic: scope.reduce((a, p) => a + p.investmentBRL.realistic, 0),
    optimistic: scope.reduce((a, p) => a + p.investmentBRL.optimistic, 0),
  };
  const scopeSaving = {
    conservative: scope.reduce((a, p) => a + p.monthlySavingBRL.conservative, 0),
    realistic: scope.reduce((a, p) => a + p.monthlySavingBRL.realistic, 0),
    optimistic: scope.reduce((a, p) => a + p.monthlySavingBRL.optimistic, 0),
  };

  return (
    <article className="space-y-8 text-[15px] leading-relaxed" data-testid="report">
      <header className="avoid-break border-b-2 border-brand-600 pb-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Diagnóstico de processos</p>
        <h1 className="mt-1 text-3xl">{diagnosis.clientName}</h1>
        <p className="text-slate-600">
          {diagnosis.sector} · {diagnosis.headcount} pessoas · versão {version.number} ({version.label}) ·{" "}
          {dateBR(version.createdAt)}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Atalho Automação. Relatório de um estudo de caso fictício: todos os números são estimativas calculadas a partir
          de dados criados para o estudo.
        </p>
      </header>

      <section className="avoid-break">
        <h2 className="mb-2 text-xl">1. Resumo executivo</h2>
        <p>{summaryText.text}</p>
        <p className="mt-1 text-xs text-slate-500">
          Texto gerado por: {summaryText.provider === "mock" ? "modelo local (sem IA)" : "IA, a partir dos números abaixo"}.
          A pontuação não depende da IA.
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Processos mapeados", String(summary.processCount)],
            ["Horas/mês no total", `${num(summary.hoursPerMonth)} h`],
            ["Começar já", String(summary.byQuadrant.COMECAR_JA)],
            ["Completude média dos dados", `${Math.round(summary.averageCompleteness * 100)}%`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-slate-200 p-3">
              <dt className="text-xs text-slate-500">{k}</dt>
              <dd className="text-xl font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="mb-2 text-xl">2. Ranking de oportunidades</h2>
        <p className="mb-3 text-sm text-slate-600">
          Prioridade = {Math.round(config.priorityPotentialWeight * 100)}% do potencial + {Math.round((1 - config.priorityPotentialWeight) * 100)}% de (100 − esforço).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="th">#</th>
                <th className="th">Processo</th>
                <th className="th">Área</th>
                <th className="th">Quadrante</th>
                <th className="th text-right">Potencial</th>
                <th className="th text-right">Esforço</th>
                <th className="th text-right">Prioridade</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((p, i) => (
                <tr key={p.key} className="avoid-break border-b border-slate-100">
                  <td className="td">{i + 1}</td>
                  <td className="td font-medium">{p.name}</td>
                  <td className="td">{AREA_LABEL[p.area]}</td>
                  <td className="td">
                    <QuadrantBadge quadrant={p.quadrant} />
                  </td>
                  <td className="td text-right">{num(p.potential)}</td>
                  <td className="td text-right">{num(p.effort)}</td>
                  <td className="td text-right font-semibold">{num(p.priority)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="avoid-break">
        <h2 className="mb-2 text-xl">3. Matriz esforço × retorno</h2>
        <MatrixChart ranked={ranked} config={config} />
        <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
          {QUADRANTS.map((q) => (
            <li key={q}>
              <strong>{QUADRANT_LABEL[q]}:</strong> {QUADRANT_HINT[q]}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-xl">4. Retorno estimado, com a conta à vista</h2>
        <p className="mb-3 text-sm">
          Economia mensal = <strong>horas por mês × custo da hora ({brl(premises.hourlyCostBRL)}) × redução esperada</strong>.
          Cenários de redução: conservador {Math.round(premises.reductionConservative * 100)}%, realista{" "}
          {Math.round(premises.reductionRealistic * 100)}% e otimista {Math.round(premises.reductionOptimistic * 100)}%.
          Onde faltam dados, o cenário conservador é reduzido para refletir a incerteza.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="th">Processo</th>
                <th className="th text-right">Horas/mês</th>
                <th className="th text-right">Conservador</th>
                <th className="th text-right">Realista</th>
                <th className="th text-right">Otimista</th>
                <th className="th text-right">Payback realista</th>
              </tr>
            </thead>
            <tbody>
              {ranked
                .filter((p) => p.quadrant !== "EVITAR")
                .map((p) => (
                  <tr key={p.key} className="avoid-break border-b border-slate-100">
                    <td className="td">
                      {rankOf.get(p.key)}. {p.name}
                    </td>
                    <td className="td text-right">{num(p.hoursPerMonth)}</td>
                    <td className="td text-right">{brl(p.monthlySavingBRL.conservative)}</td>
                    <td className="td text-right font-semibold">{brl(p.monthlySavingBRL.realistic)}</td>
                    <td className="td text-right">{brl(p.monthlySavingBRL.optimistic)}</td>
                    <td className="td text-right">{p.paybackMonths ? `${num(p.paybackMonths.realistic)} meses` : "n/d"}</td>
                  </tr>
                ))}
              <tr className="font-semibold">
                <td className="td">Total (fora de “evitar”)</td>
                <td className="td text-right">
                  {num(ranked.filter((p) => p.quadrant !== "EVITAR").reduce((a, p) => a + p.hoursPerMonth, 0))}
                </td>
                <td className="td text-right">{brl(summary.monthlySavingBRL.conservative)}</td>
                <td className="td text-right">{brl(summary.monthlySavingBRL.realistic)}</td>
                <td className="td text-right">{brl(summary.monthlySavingBRL.optimistic)}</td>
                <td className="td text-right">
                  {summary.paybackMonths ? `${num(summary.paybackMonths.realistic)} meses` : "n/d"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="page-break">
        <h2 className="mb-2 text-xl">5. Roteiro de 30/60/90 dias</h2>
        <p className="mb-3 text-sm text-slate-600">
          Capacidade assumida: {num(roadmap.capacityHoursPerWindow, 0)} horas de implantação por janela de 30 dias. Itens de
          “planejar” só começam na segunda janela, depois de desenhados.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {([1, 2, 3] as const).map((w) => (
            <div key={w} className="avoid-break rounded-lg border border-slate-200 p-3">
              <h3 className="font-semibold">{WINDOW_LABEL[w]}</h3>
              {roadmap.windows[w].length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">Nada novo inicia nesta janela.</p>
              ) : (
                <ul className="mt-2 space-y-2 text-sm">
                  {roadmap.windows[w].map((i) => (
                    <li key={i.key}>
                      <span className="font-medium">{i.name}</span>
                      <br />
                      <span className="text-slate-600">
                        ~{num(i.devHours, 0)} h · {QUADRANT_LABEL[i.quadrant]}
                        {i.endWindow > i.startWindow ? ` · termina na janela ${i.endWindow}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        {roadmap.later.length > 0 && (
          <p className="mt-3 text-sm text-slate-600">
            Ficam para depois dos 90 dias por falta de capacidade: {roadmap.later.map((p) => p.name).join("; ")}.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-xl">6. Riscos</h2>
        {risks.length === 0 ? (
          <p className="text-sm">Nenhum risco acionou as regras de alerta.</p>
        ) : (
          <ul className="space-y-3">
            {risks.map((r) => (
              <li key={r.id} className="avoid-break rounded-lg border border-slate-200 p-3">
                <p className="font-semibold">{r.title}</p>
                <p className="text-sm">{r.detail}</p>
                <p className="mt-1 text-xs text-slate-600">Processos: {r.processes.join("; ")}.</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="avoid-break">
        <h2 className="mb-2 text-xl">7. Pré-escopo e faixa de investimento</h2>
        {scope.length === 0 ? (
          <p className="text-sm">Nenhum processo em “começar já” ou “planejar” com as premissas atuais.</p>
        ) : (
          <>
            <p className="mb-2 text-sm">
              Escopo sugerido: {scope.map((p) => p.name).join("; ")}.
            </p>
            <dl className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 p-3">
                <dt className="text-xs text-slate-500">Investimento estimado (faixa)</dt>
                <dd className="text-lg font-semibold">{rangeBRL({ conservative: scopeInv.optimistic, realistic: scopeInv.realistic, optimistic: scopeInv.conservative })}</dd>
                <dd className="text-xs text-slate-500">Realista: {brl(scopeInv.realistic)}</dd>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <dt className="text-xs text-slate-500">Economia mensal estimada (faixa)</dt>
                <dd className="text-lg font-semibold">{rangeBRL(scopeSaving)}</dd>
                <dd className="text-xs text-slate-500">Realista: {brl(scopeSaving.realistic)}</dd>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <dt className="text-xs text-slate-500">Payback (realista)</dt>
                <dd className="text-lg font-semibold">
                  {scopeSaving.realistic > 0 ? `${num(scopeInv.realistic / scopeSaving.realistic)} meses` : "n/d"}
                </dd>
                <dd className="text-xs text-slate-500">Investimento realista ÷ economia realista</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-slate-500">
              Investimento = horas de implantação × {brl(premises.consultantRateBRL)}/h, com faixa de{" "}
              {Math.round(premises.investmentLowFactor * 100)}% a {Math.round(premises.investmentHighFactor * 100)}% do valor-base.
            </p>
          </>
        )}
      </section>

      <section className="avoid-break">
        <h2 className="mb-2 text-xl">8. O que este relatório não sabe</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {LIMITATIONS.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
