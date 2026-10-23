import type { ScoredProcess } from "./scoring";

export interface ReportRisk {
  id: "LGPD" | "FORNECEDOR" | "ROTINA" | "DADOS";
  title: string;
  detail: string;
  processes: string[];
}

/**
 * RN-10: riscos do relatório derivados por regra, só dos processos candidatos (fora de "evitar").
 * Nada aqui é opinião do modelo: cada risco lista os processos que o dispararam.
 */
export function buildRisks(ranked: ScoredProcess[]): ReportRisk[] {
  const candidates = ranked.filter((p) => p.quadrant !== "EVITAR");
  const risks: ReportRisk[] = [];

  const lgpd = candidates.filter((p) => p.criteria.risk >= 70);
  if (lgpd.length) {
    risks.push({
      id: "LGPD",
      title: "LGPD: dados de saúde ou financeiros",
      detail:
        "Estes processos tratam dado sensível. Antes de automatizar: base legal, acesso mínimo, registro de quem acessa e contrato com operadores.",
      processes: lgpd.map((p) => p.name),
    });
  }

  const vendor = candidates.filter((p) => p.unknownTools.length > 0 || p.criteria.integration <= 37.5);
  if (vendor.length) {
    risks.push({
      id: "FORNECEDOR",
      title: "Dependência de fornecedor ou ferramenta sem integração",
      detail:
        "Ferramentas com pouca integração (ou fora do catálogo) travam a automação se o fornecedor mudar regras, preço ou acesso. Confirmar API e plano antes de prometer prazo.",
      processes: vendor.map((p) => p.name),
    });
  }

  const routine = candidates.filter((p) => p.criteria.repetitiveness <= 25);
  if (routine.length) {
    risks.push({
      id: "ROTINA",
      title: "Mudança de rotina: processo pouco padronizado",
      detail:
        "Cada pessoa faz de um jeito. Automatizar exige antes combinar um jeito único, e isso depende de adesão da equipe.",
      processes: routine.map((p) => p.name),
    });
  }

  const lowData = candidates.filter((p) => p.completeness < 0.8);
  if (lowData.length) {
    risks.push({
      id: "DADOS",
      title: "Estimativa com dados faltantes",
      detail: "Faltam informações nestes processos; a faixa de retorno foi alargada para refletir a incerteza.",
      processes: lowData.map((p) => p.name),
    });
  }
  return risks;
}

export const LIMITATIONS = [
  "A ferramenta não mede o tempo real: usa o que o cliente informou. Tempo estimado de memória costuma errar para mais ou para menos.",
  "Ganhos indiretos (menos faltas, mais satisfação, menos retrabalho de terceiros) não entram no cálculo; são hipóteses a validar.",
  "A redução esperada é uma premissa por cenário, não uma medição. Foi usada a mesma para todos os processos.",
  "O esforço é uma estimativa por regra (digitalização, integração e risco); só uma análise técnica do processo confirma.",
  "Não há custo recorrente de licenças, hospedagem ou manutenção no cálculo do investimento.",
];
