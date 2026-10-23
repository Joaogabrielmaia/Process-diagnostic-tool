import Link from "next/link";
import { AREAS } from "@/lib/scoring";
import { AREA_LABEL, FREQUENCY_LABEL, num } from "@/lib/format";
import { DISCOVERY_SCRIPT } from "@/lib/discovery-script";
import { Shell, getCtx } from "./ctx";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ v?: string }> };

export default async function RoteiroPage({ params, searchParams }: Props) {
  const { ctx, editable } = await getCtx(params, searchParams);
  const scored = new Map(ctx.ranked.map((p) => [p.key, p]));
  const base = `/diagnosticos/${ctx.diagnosis.id}`;

  return (
    <Shell ctx={ctx} tab="" editable={editable}>
      <p className="text-sm text-slate-600">
        Conduza a conversa por área. Em cada uma, as perguntas-chave abrem o assunto; depois registre cada processo
        citado. Campo em branco vira “dado faltante” (nunca zero) e reduz a completude.
      </p>
      <div className="space-y-5">
        {AREAS.map((area) => {
          const procs = ctx.version.processes.filter((p) => p.area === area);
          return (
            <section key={area} className="card" aria-labelledby={`area-${area}`}>
              <div className="flex items-center justify-between gap-3">
                <h2 id={`area-${area}`}>
                  {AREA_LABEL[area]} <span className="text-sm font-normal text-slate-500">({procs.length})</span>
                </h2>
                {editable && (
                  <Link
                    href={`${base}/processos/novo?area=${area}&v=${ctx.version.number}`}
                    className="btn btn-primary"
                  >
                    Adicionar processo
                  </Link>
                )}
              </div>

              <details className="mt-3 rounded-lg bg-brand-50 p-3 text-sm">
                <summary className="cursor-pointer font-medium text-brand-700">Perguntas-chave desta área</summary>
                <ul className="mt-2 space-y-2">
                  {DISCOVERY_SCRIPT[area].map((q) => (
                    <li key={q.ask}>
                      <p className="font-medium">{q.ask}</p>
                      <p className="text-slate-600">Por quê: {q.why}</p>
                    </li>
                  ))}
                </ul>
              </details>

              {procs.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">Nenhum processo registrado nesta área.</p>
              ) : (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="th">Processo</th>
                        <th className="th">Frequência</th>
                        <th className="th text-right">Horas/mês</th>
                        <th className="th">Completude</th>
                        <th className="th" />
                      </tr>
                    </thead>
                    <tbody>
                      {procs.map((p) => {
                        const s = scored.get(p.key)!;
                        return (
                          <tr key={p.id} className="border-b border-slate-100">
                            <td className="td font-medium">
                              {p.name}
                              {p.needsReview && (
                                <span className="badge ml-2 bg-violet-100 text-violet-800">veio do cliente: revisar</span>
                              )}
                            </td>
                            <td className="td">{FREQUENCY_LABEL[p.frequency]}</td>
                            <td className="td text-right">{num(s.hoursPerMonth)}</td>
                            <td className="td">
                              <span className={s.completeness < 0.8 ? "text-amber-700" : "text-slate-700"}>
                                {Math.round(s.completeness * 100)}%
                              </span>
                              {s.missingFields.length > 0 && (
                                <span className="block text-xs text-slate-500">falta: {s.missingFields.join(", ")}</span>
                              )}
                            </td>
                            <td className="td text-right">
                              {editable && (
                                <Link
                                  href={`${base}/processos/${p.id}?v=${ctx.version.number}`}
                                  className="btn"
                                  aria-label={`Editar ${p.name}`}
                                >
                                  Editar
                                </Link>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </Shell>
  );
}
