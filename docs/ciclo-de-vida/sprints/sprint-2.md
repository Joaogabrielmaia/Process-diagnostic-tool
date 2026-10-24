# Sprint 2 · Fluxo do consultor

[← Índice do ciclo de vida](../README.md) · [← Sprint 1](sprint-1.md) · [Sprint 3 →](sprint-3.md)

Período acadêmico: 21/09 a 02/10/2026. Os commits abaixo têm as datas reais registradas em [desenvolvimento e configuração](../06-desenvolvimento-e-configuracao.md).

## Objetivo
Do login ao ranking e à edição de premissas, com dado faltante.

## Escopo
US-01 a US-06 e US-10. Requisitos RF-01 a RF-04, RF-09, RF-13, RNF-02 e RNF-03.

## Entregáveis
- Login por e-mail e senha, sessão assinada em cookie httpOnly (RF-13)
- Lista e criação de diagnósticos (RF-01)
- Roteiro por área com perguntas-chave (RF-02)
- Cadastro, edição e exclusão de processo com campos opcionais e lacunas sinalizadas (RF-03, RF-04)
- Ranking com notas por critério, matriz esforço × retorno e premissas editáveis (RF-06, RF-07, RF-09)
- 11 testes de integração no banco `mapa_test` (`4e89286`, `1b90766`)

## Critério de conclusão
Critérios de aceite das histórias verificados; integração cobrindo isolamento entre consultores e campos vazios como `null`. Vale também a [Definition of Done](../02-planejamento-e-scrum.md#definition-of-done).

## Planejamento
Meta: o consultor percorrer o fluxo central sem tocar em código. Dependência: seed e motor da sprint 1.

## Review
11 testes de integração passaram depois de um impedimento: o Prisma recusou `db push --force-reset` disparado por agente automatizado, e o teste passou a usar `db push` não destrutivo com limpeza pelo cliente. Tipos e lint ficaram limpos depois de duas correções de configuração. Fonte: [sprint 2 review](../../05-qualidade/sprint-2-review.md).

## Retrospectiva
Uma trava de segurança do Prisma é informação, e a resposta foi redesenhar o teste, sem contornar. `npm run db:reset` ficou para uso manual em banco de desenvolvimento.
