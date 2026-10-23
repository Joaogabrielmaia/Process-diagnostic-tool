import { brl, dateBR, num } from "@/lib/format";
import { buildProposal } from "@/lib/proposal";
import { Shell, getCtx } from "../ctx";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ v?: string }> };

export default async function PropostaPage({ params, searchParams }: Props) {
  const { ctx, editable } = await getCtx(params, searchParams);
  const p = buildProposal({
    clientName: ctx.diagnosis.clientName,
    versionNumber: ctx.version.number,
    ranked: ctx.ranked,
    roadmap: ctx.roadmap,
    premises: ctx.premises,
  });

  return (
    <Shell ctx={ctx} tab="proposta" editable={editable}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-slate-600">
          Modelo gerado a partir do diagnóstico. O escopo é exatamente o que coube no roteiro de 90 dias; o que ficou de
          fora aparece como fase seguinte e não entra no valor. Revise e complete antes de enviar.
        </p>
        <a className="btn btn-primary" href={`/api/diagnosticos/${ctx.diagnosis.id}/proposta?v=${ctx.version.number}`} download>
          Baixar em Markdown
        </a>
      </div>

      <article className="card space-y-6" data-testid="proposal">
        <header>
          <h2 className="text-xl">{p.title}</h2>
          <p className="text-sm text-slate-600">Atalho Automação · {dateBR(new Date())}</p>
        </header>

        <section>
          <h3 className="mb-2 font-semibold">1. Escopo</h3>
          {p.scope.length === 0 ? (
            <p className="text-sm">Nenhum processo coube no roteiro de 90 dias com as premissas atuais.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="th">Processo</th>
                    <th className="th">Quadrante</th>
                    <th className="th">Janela</th>
                    <th className="th text-right">Horas</th>
                    <th className="th text-right">Investimento (faixa)</th>
                  </tr>
                </thead>
                <tbody>
                  {p.scope.map((s) => (
                    <tr key={s.name} className="border-b border-slate-100">
                      <td className="td font-medium">{s.name}</td>
                      <td className="td">{s.quadrant}</td>
                      <td className="td">{s.window}</td>
                      <td className="td text-right">{num(s.devHours, 0)}</td>
                      <td className="td text-right">
                        {brl(s.investmentBRL.optimistic)} a {brl(s.investmentBRL.conservative)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {p.deferred.length > 0 && (
            <p className="mt-2 text-sm text-slate-600">Fase seguinte (fora do valor): {p.deferred.join("; ")}.</p>
          )}
        </section>

        <section>
          <h3 className="mb-2 font-semibold">2. Investimento e retorno estimado</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>
              Investimento: <strong>{brl(p.investmentBRL.optimistic)} a {brl(p.investmentBRL.conservative)}</strong> (valor-base {brl(p.investmentBRL.realistic)}).
            </li>
            <li>
              Economia mensal estimada: <strong>{brl(p.monthlySavingBRL.conservative)} a {brl(p.monthlySavingBRL.optimistic)}</strong> (realista: {brl(p.monthlySavingBRL.realistic)}).
            </li>
            <li>
              Payback (realista): {p.paybackRealisticMonths === null ? "não calculável" : `${num(p.paybackRealisticMonths)} meses`}.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold">3. Premissas</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm">{p.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold">4. O que não está incluído</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm">{p.exclusions.map((e) => <li key={e}>{e}</li>)}</ul>
        </section>

        <section className="rounded-lg bg-amber-50 p-3">
          <h3 className="mb-2 font-semibold text-amber-900">5. A preencher antes de enviar</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-amber-900">{p.toFill.map((t) => <li key={t}>{t}</li>)}</ul>
        </section>
      </article>
    </Shell>
  );
}
