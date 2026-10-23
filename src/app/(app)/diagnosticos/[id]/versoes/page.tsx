import { QuadrantBadge } from "@/components/Badges";
import { brl, dateBR, num } from "@/lib/format";
import { compareDiagnosisVersions } from "@/lib/services/diagnoses";
import { newVersionAction } from "../../actions";
import { Shell, getCtx } from "../ctx";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ v?: string; a?: string; b?: string }>;
};

const signed = (n: number, fmt: (x: number) => string) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${fmt(Math.abs(n))}`;

export default async function VersoesPage({ params, searchParams }: Props) {
  const { ctx, user, editable } = await getCtx(params, searchParams);
  const sp = await searchParams;
  const versions = ctx.diagnosis.versions;
  const last = versions[versions.length - 1]!.number;
  const prev = versions.length > 1 ? versions[versions.length - 2]!.number : last;
  const a = Number.parseInt(sp.a ?? String(prev), 10);
  const b = Number.parseInt(sp.b ?? String(last), 10);
  const cmp = versions.length > 1 ? await compareDiagnosisVersions(ctx.diagnosis.id, user.id, a, b) : null;
  const base = `/diagnosticos/${ctx.diagnosis.id}`;
  const create = newVersionAction.bind(null, ctx.diagnosis.id);

  return (
    <Shell ctx={ctx} tab="versoes" editable={editable}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <div className="space-y-4">
          <section className="card">
            <h2>Histórico</h2>
            <ol className="mt-3 space-y-3">
              {versions.map((v) => (
                <li key={v.number} className="text-sm">
                  <p className="font-medium">
                    Versão {v.number} {v.number === last && <span className="badge bg-brand-100 text-brand-700">atual</span>}
                  </p>
                  <p className="text-slate-600">{v.label}</p>
                  <p className="text-xs text-slate-500">{dateBR(v.createdAt)}</p>
                </li>
              ))}
            </ol>
          </section>
          <form action={create} className="card space-y-3">
            <h2>Nova versão</h2>
            <p className="hint">
              Copia tudo da versão atual. As anteriores continuam intactas, para você mostrar ao cliente o que mudou.
            </p>
            <div>
              <label className="label" htmlFor="label">Motivo da nova versão</label>
              <input id="label" name="label" className="input" placeholder="Ex.: Ajustes após a reunião de validação" />
            </div>
            <button className="btn btn-primary" type="submit">Criar versão {last + 1}</button>
          </form>
        </div>

        <section className="card">
          <h2>Comparação entre versões</h2>
          {!cmp ? (
            <p className="mt-2 text-sm text-slate-600">Crie uma segunda versão para poder comparar.</p>
          ) : (
            <div className="mt-3 space-y-4">
              <form method="get" className="flex flex-wrap items-end gap-3">
                <input type="hidden" name="v" value={ctx.version.number} />
                <div>
                  <label className="label" htmlFor="a">De</label>
                  <select id="a" name="a" defaultValue={a} className="input">
                    {versions.map((v) => <option key={v.number} value={v.number}>v{v.number}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="b">Para</label>
                  <select id="b" name="b" defaultValue={b} className="input">
                    {versions.map((v) => <option key={v.number} value={v.number}>v{v.number}</option>)}
                  </select>
                </div>
                <button className="btn" type="submit">Comparar</button>
              </form>

              <dl className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 p-3">
                  <dt className="text-xs text-slate-500">Horas/mês mapeadas</dt>
                  <dd className="text-lg font-semibold">{signed(cmp.comparison.totals.hoursPerMonth, (x) => `${num(x)} h`)}</dd>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <dt className="text-xs text-slate-500">Economia realista/mês</dt>
                  <dd className="text-lg font-semibold">{signed(cmp.comparison.totals.savingRealistic, brl)}</dd>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <dt className="text-xs text-slate-500">Investimento realista</dt>
                  <dd className="text-lg font-semibold">{signed(cmp.comparison.totals.investmentRealistic, brl)}</dd>
                </div>
              </dl>

              {cmp.comparison.added.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold">Processos novos na v{b}</h3>
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {cmp.comparison.added.map((p) => <li key={p.key}>{p.name}</li>)}
                  </ul>
                </div>
              )}
              {cmp.comparison.removed.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold">Processos removidos na v{b}</h3>
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {cmp.comparison.removed.map((p) => <li key={p.key}>{p.name}</li>)}
                  </ul>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="th">Processo</th>
                      <th className="th">Quadrante</th>
                      <th className="th text-right">Prioridade</th>
                      <th className="th text-right">Economia realista</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cmp.comparison.changed.length === 0 && (
                      <tr><td className="td text-slate-500" colSpan={4}>Nenhum processo mudou entre essas versões.</td></tr>
                    )}
                    {cmp.comparison.changed.map((c) => (
                      <tr key={c.key} className="border-b border-slate-100">
                        <td className="td font-medium">{c.name}</td>
                        <td className="td">
                          <QuadrantBadge quadrant={c.quadrantBefore} />
                          {c.quadrantBefore !== c.quadrantAfter && (
                            <>
                              <span aria-label="para"> → </span>
                              <QuadrantBadge quadrant={c.quadrantAfter} />
                            </>
                          )}
                        </td>
                        <td className="td text-right">{num(c.priorityBefore)} → {num(c.priorityAfter)}</td>
                        <td className="td text-right">{brl(c.savingRealisticBefore)} → {brl(c.savingRealisticAfter)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500">
                A comparação usa a identidade do processo entre versões, então renomear um processo não o conta como novo.
              </p>
            </div>
          )}
        </section>
      </div>
      <Link href={`${base}?v=${ctx.version.number}`} className="sr-only">Voltar ao roteiro</Link>
    </Shell>
  );
}
