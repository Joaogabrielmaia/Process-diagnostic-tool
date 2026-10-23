import type { Quadrant } from "@/lib/scoring";
import { QUADRANT_LABEL, QUADRANT_STYLE } from "@/lib/format";

export function QuadrantBadge({ quadrant }: { quadrant: Quadrant }) {
  return <span className={`badge ${QUADRANT_STYLE[quadrant]}`}>{QUADRANT_LABEL[quadrant]}</span>;
}

export function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card avoid-break">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
