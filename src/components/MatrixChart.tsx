import type { ScoringConfig, ScoredProcess } from "@/lib/scoring";
import { QUADRANT_COLOR, QUADRANT_LABEL } from "@/lib/format";

const W = 560;
const H = 420;
const PAD = { l: 48, r: 16, t: 16, b: 44 };
const plotW = W - PAD.l - PAD.r;
const plotH = H - PAD.t - PAD.b;

/** Esforço no eixo X (0 a 100), potencial no Y. Os números dos pontos seguem a ordem do ranking. */
export function MatrixChart({
  ranked,
  config,
}: {
  ranked: ScoredProcess[];
  config: Pick<ScoringConfig, "potentialThreshold" | "effortThreshold">;
}) {
  const x = (effort: number) => PAD.l + (effort / 100) * plotW;
  const y = (potential: number) => PAD.t + (1 - potential / 100) * plotH;
  const cx = x(config.effortThreshold);
  const cy = y(config.potentialThreshold);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Matriz esforço por retorno. Cada ponto numerado é um processo, na ordem do ranking."
      className="h-auto w-full max-w-2xl"
    >
      <rect x={PAD.l} y={PAD.t} width={cx - PAD.l} height={cy - PAD.t} fill="#d5ece7" />
      <rect x={cx} y={PAD.t} width={PAD.l + plotW - cx} height={cy - PAD.t} fill="#fdf1d6" />
      <rect x={PAD.l} y={cy} width={cx - PAD.l} height={PAD.t + plotH - cy} fill="#e1eef7" />
      <rect x={cx} y={cy} width={PAD.l + plotW - cx} height={PAD.t + plotH - cy} fill="#eceff2" />
      <text x={PAD.l + 8} y={PAD.t + 18} fontSize="12" fontWeight="600" fill="#125a4d">
        {QUADRANT_LABEL.COMECAR_JA}
      </text>
      <text x={PAD.l + plotW - 8} y={PAD.t + 18} fontSize="12" fontWeight="600" fill="#8a5d00" textAnchor="end">
        {QUADRANT_LABEL.PLANEJAR}
      </text>
      <text x={PAD.l + 8} y={PAD.t + plotH - 8} fontSize="12" fontWeight="600" fill="#1d5a82">
        {QUADRANT_LABEL.OPORTUNISTA}
      </text>
      <text x={PAD.l + plotW - 8} y={PAD.t + plotH - 8} fontSize="12" fontWeight="600" fill="#52606d" textAnchor="end">
        {QUADRANT_LABEL.EVITAR}
      </text>
      <rect x={PAD.l} y={PAD.t} width={plotW} height={plotH} fill="none" stroke="#9aa5b1" />
      {[0, 25, 50, 75, 100].map((t) => (
        <g key={t} fontSize="11" fill="#52606d">
          <text x={x(t)} y={H - 24} textAnchor="middle">
            {t}
          </text>
          <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end">
            {t}
          </text>
        </g>
      ))}
      <text x={PAD.l + plotW / 2} y={H - 6} textAnchor="middle" fontSize="12" fontWeight="600" fill="#323f4b">
        Esforço estimado (0 a 100)
      </text>
      <text transform={`translate(12 ${PAD.t + plotH / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fontWeight="600" fill="#323f4b">
        Potencial de retorno (0 a 100)
      </text>
      {ranked.map((p, i) => (
        <g key={p.key}>
          <circle cx={x(p.effort)} cy={y(p.potential)} r={11} fill={QUADRANT_COLOR[p.quadrant]} stroke="#fff" strokeWidth="1.5" />
          <text x={x(p.effort)} y={y(p.potential) + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}
