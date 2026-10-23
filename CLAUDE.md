# Mapa — instruções para o Claude neste repositório

Produto: ferramenta de diagnóstico de processos para consultorias de automação (estudo de caso fictício: "Atalho Automação" e "Clínica Vida Plena").

## Regras de integridade (não negociáveis)
- Pessoas, empresas e dados são fictícios. Nada de marcas ou pessoas reais.
- Reuniões e entrevistas são simulações e começam com: `> Simulação: o Claude interpretou o cliente nesta conversa.`
- Nunca afirmar cliente real, operação real ou produção. Nada de deploy, hospedagem ou link de demonstração. Tudo roda local.
- Retorno e economia são estimativas com fórmula visível e faixa de incerteza. Nunca "reduziu X%".
- Nunca inventar saída de teste ou cobertura: rodar e registrar o real.
- Nenhum segredo no repositório (`.env` fica fora do git).

## Convenções
- Documentos em português do Brasil, primeira pessoa, com contexto/alternativas/escolha/motivo/trade-off/quando mudaria de ideia.
- Código tipado, identificadores em inglês, textos de interface em português.
- Commits em Conventional Commits, citando IDs (RF-xx, RN-xx, US-xx).
- A pontuação (`src/lib/scoring`) é pura e determinística; nunca depende de IA nem de I/O.

## Comandos
`npm run db:up && npm run db:push && npm run db:seed && npm run dev` · `npm test` · `npm run test:integration` · `npm run test:e2e` · `npm run lint`
