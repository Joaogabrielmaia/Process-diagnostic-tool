import { QuadrantBadge } from "@/components/Badges";
import { AREA_LABEL, brl, num } from "@/lib/format";
import { Shell, getCtx } from "../ctx";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ v?: string }> };

const CRITERIA_LABEL = {
  frequency: "Frequência",
  volume: "Volume",
  repetitiveness: "Repetitividade",
  impact: "Impacto",
  digitization: "Digitalização",
  integration: "Facilidade de integração",
  risk: "Risco",
} as const;

export default async function RankingPage({ params, searchParams }: Props) {
  const { ctx, editable } = await getCtx(params, searchParams);
  const { ranked, config } = ctx;

  return (
    <Shell ctx={ctx} tab="ranking" editable={editable}>
      <p className="text-sm text-slate-600">
        Prioridade = {Math.round(config.priorityPotentialWeight * 100)}% potencial +{" "}
        {Math.round((1 - config.priorityPotentialWeight) * 100)}% (100 − esforço). Abra uma linha para ver a nota de cada
        critério.
      </p>
      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="th">#</th>
              <th className="th">Processo</th>
              <th className="th">Quadrante</th>
              <th className="th text-right">Potencial</th>
              <th className="th text-right">Esforço</th>
              <th className="th text-right">Prioridade</th>
              <th className="th text-right">Horas/mês</th>
              <th className="th text-right">Economia realista</th>
            </tr>
          </thead>
          {ranked.map((p, i) => (
            <tbody key={p.key} className="border-b border-slate-100">
              <tr>
                <td className="td">{i + 1}</td>
                <td className="td">
                  <details>
                    <summary className="cursor-pointer font-medium">{p.name}</summary>
                    <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 rounded-lg bg-slate-50 p-3 text-xs sm:grid-cols-4">
                      {(Object.keys(CRITERIA_LABEL) as Array<keyof typeof CRITERIA_LABEL>).map((k) => (
                        <p key={k}>
                          {CRITERIA_LABEL[k]}: <strong>{num(p.criteria[k])}</strong>
                        </p>
                      ))}
                      <p className="col-span-2 sm:col-span-4 text-slate-600">
                        {AREA_LABEL[p.area]} · ~{num(p.devHours, 0)} h de implantação · completude {Math.round(p.completeness * 100)}%
                        {p.unknownTools.length > 0 && ` · ferramenta fora do catálogo: ${p.unknownTools.join(", ")}`}
                      </p>
                    </div>
                  </details>
                </td>
                <td className="td">
                  <QuadrantBadge quadrant={p.quadrant} />
                </td>
                <td className="td text-right">{num(p.potential)}</td>
                <td className="td text-right">{num(p.effort)}</td>
                <td className="td text-right font-semibold">{num(p.priority)}</td>
                <td className="td text-right">{num(p.hoursPerMonth)}</td>
                <td className="td text-right">{brl(p.monthlySavingBRL.realistic)}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </Shell>
  );
}
