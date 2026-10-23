import type { PortfolioSummary, ScoredProcess } from "../scoring";

export interface SummaryInput {
  clientName: string;
  sector: string;
  ranked: ScoredProcess[];
  summary: PortfolioSummary;
}

/** ADR-001: a IA só redige texto a partir de números já calculados; nunca pontua. */
export interface SummaryProvider {
  readonly name: string;
  generate(input: SummaryInput): Promise<string>;
}

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export class MockProvider implements SummaryProvider {
  readonly name = "mock";

  async generate({ clientName, ranked, summary }: SummaryInput): Promise<string> {
    const top = ranked.filter((p) => p.quadrant === "COMECAR_JA").slice(0, 3);
    const q = summary.byQuadrant;
    const lines = [
      `Mapeamos ${summary.processCount} processos de ${clientName}, que somam cerca de ${summary.hoursPerMonth} horas de trabalho por mês.`,
      `${q.COMECAR_JA} processo(s) caem em "começar já", ${q.PLANEJAR} em "planejar", ${q.OPORTUNISTA} em "oportunista" e ${q.EVITAR} em "evitar".`,
      top.length
        ? `Os melhores pontos de partida são: ${top.map((p) => p.name).join("; ")}.`
        : `Nenhum processo ficou em "começar já" com as premissas atuais.`,
      `Estimativa de economia mensal entre ${brl(summary.monthlySavingBRL.conservative)} e ${brl(summary.monthlySavingBRL.optimistic)} (realista: ${brl(summary.monthlySavingBRL.realistic)}), para um investimento de ${brl(summary.investmentBRL.optimistic)} a ${brl(summary.investmentBRL.conservative)}.`,
      `São estimativas calculadas a partir dos dados informados, não resultados medidos.`,
    ];
    return lines.join(" ");
  }
}

export class AnthropicProvider implements SummaryProvider {
  readonly name = "anthropic";
  constructor(
    private readonly apiKey: string,
    private readonly model: string,
  ) {}

  async generate({ clientName, sector, ranked, summary }: SummaryInput): Promise<string> {
    const facts = {
      client: clientName,
      sector,
      summary,
      top: ranked.slice(0, 5).map((p) => ({ name: p.name, quadrant: p.quadrant, priority: p.priority })),
    };
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 500,
        system:
          "Você redige o resumo executivo de um diagnóstico de processos, em português do Brasil. Use SOMENTE os números fornecidos. Trate retorno e economia como estimativas, nunca como resultados medidos. Sem promessas de percentual de redução.",
        messages: [{ role: "user", content: JSON.stringify(facts) }],
      }),
    });
    if (!res.ok) throw new Error(`Falha na API da Anthropic (HTTP ${res.status}).`);
    const body = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
    const text = body.content?.find((c) => c.type === "text")?.text;
    if (!text) throw new Error("Resposta vazia da API da Anthropic.");
    return text.trim();
  }
}

/** Qualquer falha cai no MockProvider: o relatório nunca depende da IA estar disponível. */
export function getSummaryProvider(env: NodeJS.ProcessEnv = process.env): SummaryProvider {
  if (env.SUMMARY_PROVIDER === "anthropic" && env.ANTHROPIC_API_KEY) {
    return new AnthropicProvider(env.ANTHROPIC_API_KEY, env.ANTHROPIC_MODEL || "claude-sonnet-5-5");
  }
  return new MockProvider();
}

export async function generateSummarySafely(input: SummaryInput, provider = getSummaryProvider()) {
  try {
    return { text: await provider.generate(input), provider: provider.name, fellBack: false };
  } catch {
    return { text: await new MockProvider().generate(input), provider: "mock", fellBack: true };
  }
}
