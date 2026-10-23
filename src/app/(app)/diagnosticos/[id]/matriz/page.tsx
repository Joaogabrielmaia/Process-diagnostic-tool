import { MatrixChart } from "@/components/MatrixChart";
import { QuadrantBadge } from "@/components/Badges";
import { QUADRANTS } from "@/lib/scoring";
import { QUADRANT_HINT, QUADRANT_LABEL } from "@/lib/format";
import { Shell, getCtx } from "../ctx";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ v?: string }> };

export default async function MatrizPage({ params, searchParams }: Props) {
  const { ctx, editable } = await getCtx(params, searchParams);
  const { ranked, config } = ctx;

  return (
    <Shell ctx={ctx} tab="matriz" editable={editable}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="card">
          <MatrixChart ranked={ranked} config={config} />
          <p className="hint">
            Cortes: potencial ≥ {config.potentialThreshold} e esforço &lt; {config.effortThreshold}. Os números dos pontos
            seguem o ranking.
          </p>
        </div>
        <div className="space-y-4">
          {QUADRANTS.map((q) => {
            const items = ranked.map((p, i) => ({ p, i })).filter(({ p }) => p.quadrant === q);
            return (
              <section key={q} className="card">
                <div className="flex items-center gap-2">
                  <QuadrantBadge quadrant={q} />
                  <h2 className="text-base">{QUADRANT_LABEL[q]}</h2>
                </div>
                <p className="mt-1 text-xs text-slate-500">{QUADRANT_HINT[q]}</p>
                {items.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">Nenhum processo.</p>
                ) : (
                  <ol className="mt-2 space-y-1 text-sm">
                    {items.map(({ p, i }) => (
                      <li key={p.key}>
                        <span className="font-semibold">{i + 1}.</span> {p.name}
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
