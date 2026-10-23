import type { Area, Frequency, Quadrant, Range3, Sensitivity } from "./scoring";

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const num = (n: number, digits = 1) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: digits });

export const rangeBRL = (r: Range3) => `${brl(r.conservative)} a ${brl(r.optimistic)}`;

export const AREA_LABEL: Record<Area, string> = {
  COMERCIAL: "Comercial",
  ATENDIMENTO: "Atendimento",
  FINANCEIRO: "Financeiro",
  OPERACAO: "Operação",
  RH: "RH",
};

export const FREQUENCY_LABEL: Record<Frequency, string> = {
  DIARIA: "Diária",
  SEMANAL: "Semanal",
  QUINZENAL: "Quinzenal",
  MENSAL: "Mensal",
  EVENTUAL: "Eventual",
};

export const SENSITIVITY_LABEL: Record<Sensitivity, string> = {
  NENHUM: "Nenhum",
  PESSOAL: "Dados pessoais",
  SAUDE_FINANCEIRO: "Saúde ou financeiro",
};

export const QUADRANT_LABEL: Record<Quadrant, string> = {
  COMECAR_JA: "Começar já",
  PLANEJAR: "Planejar",
  OPORTUNISTA: "Oportunista",
  EVITAR: "Evitar",
};

export const QUADRANT_HINT: Record<Quadrant, string> = {
  COMECAR_JA: "Alto potencial e baixo esforço: primeira fila de implantação.",
  PLANEJAR: "Alto potencial, mas exige esforço: vale, com desenho prévio.",
  OPORTUNISTA: "Potencial menor e esforço baixo: encaixar quando sobrar capacidade.",
  EVITAR: "Potencial baixo e esforço alto: não compensa agora.",
};

export const QUADRANT_STYLE: Record<Quadrant, string> = {
  COMECAR_JA: "bg-emerald-100 text-emerald-800",
  PLANEJAR: "bg-amber-100 text-amber-800",
  OPORTUNISTA: "bg-sky-100 text-sky-800",
  EVITAR: "bg-slate-200 text-slate-700",
};

export const QUADRANT_COLOR: Record<Quadrant, string> = {
  COMECAR_JA: "#1f8a78",
  PLANEJAR: "#c98a12",
  OPORTUNISTA: "#2f7fb5",
  EVITAR: "#7b8794",
};

export const dateBR = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
