# 07 · Testes e qualidade

[← Índice do ciclo de vida](README.md) · Anterior: [06 · Desenvolvimento e configuração](06-desenvolvimento-e-configuracao.md) · Próximo: [08 · Implantação e operação](08-implantacao-e-operacao.md)

Integra o [relatório de testes](../05-qualidade/relatorio-de-testes.md). Todo número desta página vem de um log arquivado em [docs/05-qualidade](../05-qualidade/README.md), com data e commit.

## Estratégia e pirâmide

| Camada | Alvo | Ferramenta | Banco |
|---|---|---|---|
| Unitária | Pontuação, retorno, roteiro, comparação, validação, provedor de resumo, proposta | Vitest | nenhum |
| Integração | Serviços de diagnóstico, versões, convites, sessão | Vitest | PostgreSQL `mapa_test`, separado do de desenvolvimento |
| Ponta a ponta | Fluxos do consultor e do cliente, PDF, layout mobile, geração dos prints | Playwright | PostgreSQL de desenvolvimento com o seed |
| Estática | Tipos e lint | `tsc --noEmit`, `eslint --max-warnings 0` | — |

A base é larga por desenho: o módulo de pontuação é puro e concentra as regras de negócio, então a maior parte dos casos roda sem banco nem navegador.

## Resultados registrados

| Execução | Commit | Data | Resultado | Log |
|---|---|---|---|---|
| Unitários | `1f4473f` | 2026-10-24 | 89 testes, 5 arquivos, todos passaram | [log](../05-qualidade/execucao-test-1f4473f.txt) |
| Cobertura de `src/lib/scoring` | `1f4473f` | 2026-10-24 | 100% de instruções, ramos, funções e linhas | [log](../05-qualidade/execucao-coverage-1f4473f.txt) |
| Integração | `bd3169b` | 2026-10-24 | 11 testes, todos passaram | [log](../05-qualidade/execucao-test-integration-bd3169b.txt) |
| E2E | `bd3169b` | 2026-10-24 | 15 testes, todos passaram | [log](../05-qualidade/execucao-test-e2e-bd3169b.txt) |
| E2E anterior | `1b09c61` | 2026-10-24 | 14 de 15 passaram; 1 falhou | [log](../05-qualidade/execucao-test-e2e-1b09c61.txt) |

Sem CI configurada: as execuções são locais. Tipos, lint e build passaram na mesma data, no commit `bd3169b`. O número de unitários subiu de 85 para 89 com os testes de `tests/unit/robustness.test.ts`.

## Casos por tipo

| Tipo | Exemplos cobertos |
|---|---|
| Positivo | Pontuação completa com valor exato calculado à mão; fluxo criar diagnóstico → processo → ranking → premissas → relatório → PDF |
| Negativo | Senha errada; rota protegida sem login; PDF sem login; link do cliente inválido ou expirado; premissas inconsistentes recusadas |
| Limites | Todos os cortes das tabelas de frequência, volume e tempo; campo numérico fora da faixa recusado pelo servidor; 500 processos sintéticos com notas entre 0 e 100 |
| Dado faltante | Campo vazio vira `null`, entra valor cauteloso e a completude cai (RN-08) |
| Propriedades | Mais tempo nunca reduz o potencial; mais sensibilidade nunca reduz o esforço; ordem de entrada não altera o ranking |
| Segurança | Hash não guarda a senha; sessão adulterada é recusada; isolamento entre consultores; `SESSION_SECRET` ausente ou curto recusado |
| Requisitos | Cada RF aparece em [rastreabilidade](../02-definicao/rastreabilidade.md) com o teste que o cobre |

## Registro de defeitos e causa raiz

| # | Defeito | Causa raiz | Correção | Regressão |
|---|---|---|---|---|
| 1 | Integração: `db push --force-reset` recusado | O Prisma bloqueia o comando quando disparado por agente automatizado | `db push` não destrutivo e limpeza pelo cliente, só no banco de teste | Teste de integração |
| 2 | E2E: 3 falhas | Seletor `role=alert` também pegava o anunciador de rotas do Next | Seletor `p[role=alert]` | E2E |
| 3 | Prints 05 e 10 com a tela errada, testes passando | Captura antes de a navegação terminar | `waitForURL` e conferência visual | Prints regenerados |
| 4 | Prints 03 e 04 mostravam o Roteiro | A captura 03 não esperava a navegação do clique em "Editar" | Espera por URL; prints regenerados e conferidos | `npm run screenshots` |
| 5 | E2E `flow.spec.ts:116` falhava na primeira visita a uma rota | Compilação sob demanda do servidor de desenvolvimento acima de 5 s | Espera de `expect` em 15 s; cinco partidas a frio passaram | Suíte E2E |
| 6 | PDF com a tabela do ranking cortada | `min-width` e `overflow-x` da tela valiam na impressão | CSS de impressão zera os dois; PDFs regenerados | Páginas 1, 3 e 4 conferidas |
| 7 | Integração rodando junto dos unitários: o `beforeAll` estourava os 10 s de hook | O `prisma db push` do `beforeAll` demora mais que o padrão | `hookTimeout` de 90 s no projeto de integração | Vitest completo |

## Regressão

A suíte completa roda a cada mudança de regra: unitários e integração no Vitest, mais o E2E. Mudança de CSS de impressão tem verificação manual das páginas do PDF.

## Limites da estratégia

- Cobertura medida só em `src/lib/scoring`; o resto não tem número.
- Sem CI, a regressão depende de execução manual.
- Não foram executados: chamada real ao provedor externo do resumo, falha do Chromium, queda do banco, recusa do servidor a editar versão antiga por formulário forjado, carga com milhares de processos e acessibilidade automatizada.

## Casos propostos, ainda não executados

| Caso | Alvo | Modo de falha |
|---|---|---|
| Forçar falha do Chromium e verificar o 502 com mensagem | `api/diagnosticos/[id]/pdf` | F-1 |
| Enviar formulário forjado para uma versão antiga | `services/diagnoses.ts` | F-7 |
| Derrubar o banco no meio de uma gravação | serviços | F-4 |
| Auditoria de acessibilidade com axe nos E2E | telas principais | RNF-06 |
| Teste de carga com milhares de processos | motor e relatório | F-13 |
