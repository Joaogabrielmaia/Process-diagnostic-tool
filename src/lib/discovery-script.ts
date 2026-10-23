import type { Area } from "./scoring";

export interface DiscoveryQuestion {
  ask: string;
  why: string;
}

/** Perguntas-chave por área. A justificativa de cada uma está em docs/01-discovery/perguntas-chave.md. */
export const DISCOVERY_SCRIPT: Record<Area, DiscoveryQuestion[]> = {
  COMERCIAL: [
    { ask: "Como um contato novo chega e quem responde primeiro?", why: "Revela atraso de resposta e dependência de uma pessoa." },
    { ask: "O que acontece com quem pediu preço e não fechou?", why: "Mostra follow-up que depende de memória." },
    { ask: "Onde ficam os registros dos contatos?", why: "Define se os dados estão digitais e estruturados." },
  ],
  ATENDIMENTO: [
    { ask: "Qual mensagem vocês mais repetem no dia?", why: "Repetição alta com texto parecido é o melhor sinal de automação." },
    { ask: "Quantas vezes por semana alguém falta sem avisar?", why: "Liga o processo a um custo que o dono sente." },
    { ask: "Que dados do paciente passam pelo processo?", why: "Define o risco com a LGPD desde o começo." },
  ],
  FINANCEIRO: [
    { ask: "O que precisa ser conferido à mão todo fechamento?", why: "Conferência manual é tempo recorrente e fonte de erro." },
    { ask: "Quanto tempo leva até uma guia ou cobrança sair?", why: "Atraso vira caixa parado." },
    { ask: "De quais sistemas externos o processo depende?", why: "Dependência externa aumenta o esforço e o risco." },
  ],
  OPERACAO: [
    { ask: "Qual controle ainda é feito em papel ou planilha solta?", why: "Papel pesa na digitalização, que é parte do esforço." },
    { ask: "Quando foi a última vez que algo faltou ou deu conflito?", why: "Erro percebido, em exemplo concreto, é mais confiável que um percentual." },
    { ask: "Quantas pessoas fazem a mesma tarefa, cada uma do seu jeito?", why: "Mede padronização, que limita o que se automatiza." },
  ],
  RH: [
    { ask: "Quais tarefas se repetem todo mês na mesma data?", why: "Rotina previsível é fácil de planejar, mesmo com volume baixo." },
    { ask: "Que documentos e dados pessoais circulam?", why: "RH concentra dados pessoais e financeiros: o risco é alto." },
    { ask: "Quanto do processo depende de contador ou sistema externo?", why: "Define a dependência de fornecedor." },
  ],
};
