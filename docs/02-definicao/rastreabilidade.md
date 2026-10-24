# Rastreabilidade

Do requisito ao código e ao teste. Nomes de arquivos conferidos no repositório.

| Requisito | Regras | Código principal | Teste que cobre |
|---|---|---|---|
| RF-01 | — | `services/diagnoses.ts` (`createDiagnosis`), `diagnosticos/page.tsx` | integração: "cria o diagnóstico já com a versão 1"; E2E: fluxo do consultor |
| RF-02 | — | `discovery-script.ts`, `diagnosticos/[id]/page.tsx` | E2E (roteiro aparece nos prints); sem teste unitário do texto |
| RF-03, RF-04 | RN-08 | `validation.ts`, `processos/[pid]/page.tsx`, `engine.ts` | unit: "dado faltante"; integração: "campos vazios como null"; E2E: "falta: taxa de erro" e valor fora da faixa |
| RF-05, RF-06 | RN-01 a RN-05, RN-09 | `scoring/engine.ts` | `scoring.test.ts` (55 testes, na sprint 1) |
| RF-07 | RN-04 | `scoring/engine.ts` (`quadrantOf`), `MatrixChart.tsx` | unit: quadrantes; E2E: matriz visível |
| RF-08 | RN-06 | `scoring/engine.ts`, `scoring/summary.ts` | unit: retorno e payback; conta manual em [exemplos](../03-metodologia/exemplos-de-calculo.md) |
| RF-09 | RN-06, RN-09 | `premissas/page.tsx`, `actions.ts`, `premisesSchema` | integração: premissas mudam a economia; E2E: dobrar custo da hora e recusar redução inválida |
| RF-10 | RN-07, RN-10 | `ReportView.tsx`, `report.ts`, `scoring/roadmap.ts` | unit: roteiro e riscos; E2E: 8 seções do relatório |
| RF-11 | — | `lib/pdf.ts`, `api/diagnosticos/[id]/pdf/route.ts` | E2E: resposta `application/pdf`, começa com `%PDF-`, exige login |
| RF-12 | RN-11 | `services/diagnoses.ts`, `scoring/compare.ts`, `versoes/page.tsx` | unit: comparação; integração: versão anterior intacta e chave estável; E2E: v1 só leitura |
| RF-13 | — | `auth.ts`, `login/actions.ts` | integração: sessão e hash; E2E: login, senha errada, rota protegida |
| RF-14 | RN-12 | `cliente/[token]/*`, `services/diagnoses.ts` | integração: token válido, inválido e expirado; E2E: cliente responde e consultor vê "revisar" |
| RF-15 | — | `summary/provider.ts` | unit: mock, fallback e seleção de provedor. **A chamada real à API da Anthropic não foi testada** (sem chave) |
| RF-16 | — | `prisma/seed.ts`, `seed-data.ts` | Executado e usado em E2E e prints |
| RF-17 (v1.1) | RN-06 | ver [roadmap](../06-pos-lancamento/roadmap.md) | ver branch `feat/proposta` |
| RNF-01 | — | `src/lib/scoring/*` (sem imports de banco/rede) | unit (determinismo) |
| RNF-02 | — | Tailwind, tabelas com rolagem interna | E2E: sem rolagem horizontal em 390 px |
| RNF-03 | RN-11, RN-12 | `auth.ts`, `ownLatestVersion` | integração e E2E |
| RNF-05 | — | página `/imprimir/[id]` | E2E (PDF gerado da mesma página) |
| RNF-07 | — | tsconfig estrito | `tsc --noEmit`, `eslint --max-warnings 0` |
