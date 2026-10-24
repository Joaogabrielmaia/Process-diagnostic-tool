# 02 · Planejamento e Scrum

[← Índice do ciclo de vida](README.md) · Anterior: [01 · Visão e discovery](01-visao-e-discovery.md) · Próximo: [03 · Requisitos e rastreabilidade](03-requisitos-e-rastreabilidade.md)

Os registros de planejamento abaixo são artefatos do estudo de caso. As estimativas são de planejamento; nenhuma velocity, lead time ou burndown foi medido. Os commits que entregaram cada sprint estão nas [páginas das sprints](sprints/README.md).

## Product Goal

Permitir que uma consultoria pequena conduza o diagnóstico de processos de um cliente e entregue, na mesma semana, ranking, matriz, roteiro de 30/60/90 dias e relatório em PDF em que cada nota e cada valor possam ser conferidos.

## Product Backlog priorizado

Prioridade: valor para o fluxo central do consultor, depois dependência técnica, depois conforto. Os IDs vêm de [histórias](../02-definicao/historias.md).

| # | História | MoSCoW | Sprint | Justificativa da posição |
|---|---|---|---|---|
| 1 | US-13 Diagnóstico de exemplo completo | Must | 1 | Sem dados de demonstração não há como validar a pontuação |
| 2 | US-04 Ranking com nota por critério | Must | 1 e 2 | É o núcleo do valor: explicar a ordem |
| 3 | US-01, US-02, US-03 Criar diagnóstico, roteiro, cadastro com dado faltante | Must | 2 | Alimentam o motor; o dado faltante é a regra RN-08 |
| 4 | US-05, US-06 Matriz e premissas | Must | 1 e 2 | Tornam o retorno discutível na frente do cliente |
| 5 | US-10 Login | Must | 2 | Isolamento entre consultores |
| 6 | US-07, US-08 Relatório web e PDF | Must | 3 | Entregável da consultoria |
| 7 | US-09 Comparar versões | Should | 3 | Mostra o efeito do dado faltante entre v1 e v2 |
| 8 | US-11 Formulário do cliente | Should | 3 | Adianta o levantamento; depende da restrição de dados |
| 9 | US-12 Resumo executivo redigido | Could | 3 | Opcional; a pontuação não depende dele |
| 10 | US-14 Modelo de proposta | Could | 4 | Pedido da retrospectiva da v1.0 |

Ordem de corte definida de antemão: v1.1 → guias → E2E → resumo opcional → formulário do cliente → retrospectiva ([backlog](../02-definicao/backlog-sprints.md)).

## Plano de releases

| Release | Conteúdo | Sprints | Tag |
|---|---|---|---|
| v1.0.0 | MVP: motor, fluxo do consultor, relatório, versões, formulário do cliente | 1 a 3 | `v1.0.0` |
| v1.1.0 | Modelo de proposta a partir do diagnóstico (RF-17) | 4 | `v1.1.0` |

## Sprints

| Sprint | Período acadêmico | Objetivo | Página |
|---|---|---|---|
| 1 · Motor e dados | 07/09 a 18/09/2026 | A pontuação funciona, é testada e há dados para demonstrar | [Sprint 1](sprints/sprint-1.md) |
| 2 · Fluxo do consultor | 21/09 a 02/10/2026 | Do login ao ranking e à edição de premissas, com dado faltante | [Sprint 2](sprints/sprint-2.md) |
| 3 · Relatório, versões e cliente | 05/10 a 16/10/2026 | Relatório web e PDF, versões, formulário do cliente, evidências | [Sprint 3](sprints/sprint-3.md) |
| 4 · Proposta (v1.1) | 19/10 a 23/10/2026 | Evolução pedida na retrospectiva | [Sprint 4](sprints/sprint-4.md) |

## Definition of Ready

Uma história entra na sprint quando tem: critério de aceite escrito, requisito e regra de negócio associados, dependências identificadas e dado de teste definido.

## Definition of Done

Vale a definição do [backlog](../02-definicao/backlog-sprints.md): critérios de aceite verificados; regra de negócio com cálculo coberta por teste; `tsc` e `eslint` sem avisos; commit em Conventional Commits citando os IDs.

## Cerimônias

| Cerimônia | Registro |
|---|---|
| Discovery e validação com as partes interessadas | [reuniões simuladas](reunioes/README.md) |
| Sprint Planning, Review e Retrospectiva | uma seção por sprint em [sprints/](sprints/README.md) |
| Retrospectiva da v1.0 | [ata](../06-pos-lancamento/retrospectiva-reuniao.md) e [retrospectiva final](../06-pos-lancamento/retrospectiva-final.md) |
| Refinamento | feito nas reuniões de discovery e na [validação](../04-arquitetura/reuniao-validacao.md): 7 pedidos tratados e 1 recusa |

## Riscos, impedimentos e mudanças

Riscos R-1 a R-7 e hipóteses H-1 a H-4 em [riscos](../02-definicao/riscos.md). Impedimentos reais e como foram tratados estão nas seções "O que deu errado" das [reviews](../05-qualidade/sprint-1-review.md), por exemplo o bloqueio do Prisma a `db push --force-reset` na sprint 2. Mudanças pedidas e suas decisões estão no [registro de mudanças](03-requisitos-e-rastreabilidade.md#registro-de-mudanças).

## Critérios de repriorização

O backlog muda quando: uma regra de negócio não puder ser coberta por teste; uma restrição do cliente invalidar uma história (como o dado de paciente); o item cortado por último ficar em risco; ou a retrospectiva apontar uma evolução de maior valor que o restante do backlog.
