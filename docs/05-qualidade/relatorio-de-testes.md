# Relatório de testes (execução real)

Tudo abaixo foi **executado** no meu computador (Windows 11, Node 24, PostgreSQL 16 em Docker). Os números são os que o terminal devolveu; não arredondei nem estimei.

## Resumo da v1.0.0

| Camada | Comando | Resultado |
|---|---|---|
| Tipos | `npm run typecheck` | sem erros |
| Lint | `npm run lint` | sem erros e sem avisos (`--max-warnings 0`) |
| Unitários | `npm test` | **78 testes, 3 arquivos, todos passaram** |
| Integração | `npm run test:integration` | **11 testes, 1 arquivo, todos passaram** |
| E2E | `npm run test:e2e` | **10 testes, todos passaram** (≈ 54 s) |
| Prints | `npm run screenshots` | 3 testes passaram; 13 imagens geradas |
| PDF | `npm run report:pdf` | 2 PDFs gerados (≈ 120 KB cada; 6 páginas o da v2) |

## Atualização da v1.1.0 (execução real)

| Camada | Resultado |
|---|---|
| Tipos e lint | sem erros e sem avisos |
| Vitest completo (`npx vitest run`) | **96 testes, 5 arquivos, todos passaram**: 85 unitários (inclui 7 da proposta) e 11 de integração |
| E2E (`flow.spec.ts` + `proposta.spec.ts`) | **12 testes, todos passaram** (≈ 1,8 min) |
| Prints | 14 arquivos em `docs/screenshots/` (incl. 12-proposta-v1-1) |

Falha encontrada na v1.1: ao rodar unitários e integração juntos, o `beforeAll` da integração (que executa `prisma db push`) estourou o limite padrão de 10 s de hook. Não era erro de lógica: aumentei `hookTimeout` para 90 s no projeto de integração e as duas execuções (junto e isolada) passaram. A tabela de resumo e as contagens acima da v1.0.0 abaixo refletem a v1.0.0; a v1.1.0 só acrescenta o que está nesta seção.

## Reexecução de 2026-10-24 (commit 1b09c61, Node v24.14.0)

Logs completos, com cabeçalho de data, commit, Node e comando: [unitários](execucao-test-1b09c61.txt), [integração](execucao-test-integration-1b09c61.txt) e [E2E](execucao-test-e2e-1b09c61.txt).

| Camada | Resultado |
|---|---|
| Unitários (`npm test`) | **85 testes, 4 arquivos, todos passaram** (55 em `scoring.test.ts`) |
| Integração (`npm run test:integration`) | **11 testes, 1 arquivo, todos passaram** |
| E2E (`npm run test:e2e`) | **15 testes: 14 passaram e 1 falhou** (12 de fluxo e proposta, com 11 aprovados, mais 3 de geração de prints) |

Falha registrada, não corrigida: `flow.spec.ts:116` (seed: v1 é retrato fechado e a comparação mostra o que mudou) não encontrou o título "Comparação entre versões" em 5 s. Causa não investigada.

Depois da execução rodei `npm run demo:clean` e restaurei os prints sobrescritos pelo E2E. Os prints 03 e 04 mostravam a aba Roteiro em vez do cadastro e do ranking; a captura de 03 passou a esperar a navegação e os dois foram regenerados e conferidos.

## Cobertura (medida, v1.0.0)

`npm run test:coverage` (`vitest run --project unit --coverage`), restrita a `src/lib/scoring/**`:

| Arquivo | Linhas | Ramos | Funções |
|---|---|---|---|
| compare.ts, config.ts, engine.ts, index.ts, roadmap.ts, summary.ts, types.ts | 100% | 100% | 100% |

**Como ler isso:** 100% do módulo de pontuação foi executado pelos testes, mas cobertura de linhas não prova que as **asserções** são boas. Por isso conferi valores à mão (ver [exemplos de cálculo](../03-metodologia/exemplos-de-calculo.md)) e reescrevi um teste que passava sem verificar nada (veja a [review da sprint 1](sprint-1-review.md)). **Não medi cobertura** do restante do código (telas, serviços, auth); o que não está no módulo de pontuação é coberto por integração e E2E, sem número de cobertura.

## O que cada camada garante

**Unitários (78):** frequência/volume/horas em todos os limites das tabelas; impacto, risco e integração; pontuação completa com valor exato calculado à mão; monotonicidade (mais tempo nunca reduz potencial; mais sensibilidade nunca reduz esforço; mais digitalização nunca aumenta esforço); dado faltante e seus efeitos na faixa; quadrantes nas fronteiras (49,9 / 50); ranking estável; validação de pesos; resumo e roteiro (capacidade, janelas, "planejar" nunca na primeira); comparação de versões; validação de formulários; resumo por IA e fallback; regras de risco do relatório.

**Integração (11, contra o banco `mapa_test`):** criar diagnóstico; adicionar/editar/remover processo recalculando o ranking; campos vazios como `null`; isolamento entre consultores; premissas mudando a economia; nova versão preserva a anterior; chave estável e comparação; link do cliente (válido, inexistente, expirado); sessão (assinatura, adulteração); hash de senha.

**E2E (10, navegador real):** rota protegida; senha errada; link inválido; fluxo completo (criar diagnóstico → processo com dado faltante → ranking → matriz → premissas → relatório com 8 seções → PDF real); PDF exige login; validação do servidor; v1 só leitura e comparação; formulário do cliente; nova versão; layout mobile sem rolagem horizontal.

## Falhas que aconteceram no caminho

| # | O que falhou | Causa | Correção |
|---|---|---|---|
| 1 | Integração: `prisma db push --force-reset` recusado | O Prisma bloqueia esse comando quando disparado por agente de IA | Troquei por `db push` não destrutivo + limpeza pelo cliente, só no banco `mapa_test` |
| 2 | E2E: 3 testes falharam | Seletor `role=alert` pegava também o anunciador de rotas do Next (erro do teste) | Seletor `p[role=alert]` |
| 3 | Prints 05 e 10 mostravam a tela errada | Print tirado antes da navegação terminar; **os testes passavam** | `waitForURL` e conferência visual dos arquivos |
| 4 | `tsc`: CSS sem tipo; Vitest: opção inválida | Configuração | Declaração de módulo; flag no script |

## O que NÃO foi testado

- Chamada real à **API da Anthropic** (sem chave). Só o `MockProvider` e o fallback.
- **Falha do Chromium** ao gerar PDF (o código de erro existe, mas não foi forçado).
- **Queda do banco** em meio a uma operação.
- Recusa do **servidor** a editar versão antiga com formulário forjado (a interface não oferece o botão; testei isso, mas não a recusa direta).
- Carga, muitos processos, e acessibilidade por ferramenta automática (ex.: axe).
- Navegadores além do Chromium; telas além de 1280 px e 390 px.

## Como reproduzir

```bash
npm install && npx playwright install chromium
cp .env.example .env
npm run db:up && npm run db:push && npm run db:seed
npm run typecheck && npm run lint
npm test && npm run test:integration
npm run dev          # em outro terminal
npm run test:e2e
```
