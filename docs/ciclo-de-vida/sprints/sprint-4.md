# Sprint 4 · Proposta (v1.1)

[← Índice do ciclo de vida](../README.md) · [← Sprint 3](sprint-3.md) · [Sprints](README.md)

Período acadêmico: 19/10 a 23/10/2026. Os commits abaixo têm as datas reais registradas em [desenvolvimento e configuração](../06-desenvolvimento-e-configuracao.md).

## Objetivo
Gerar um modelo de proposta a partir do diagnóstico.

## Escopo
US-14 e RF-17, com RN-06 e RN-07.

## Entregáveis
- Aba Proposta: escopo, cronograma 30/60/90, faixa de investimento, retorno estimado, premissas, exclusões e lista do que o consultor preenche
- Download em Markdown
- 7 testes unitários, 2 testes E2E e o print 12 (`6e1651a`, `35782dd`)

## Critério de conclusão
Escopo igual ao que coube nos 90 dias; nenhuma regra de pontuação alterada; texto sem termos como "garantimos" ou "reduziu". Vale também a [Definition of Done](../02-planejamento-e-scrum.md#definition-of-done).

## Planejamento
Meta: evolução curta pedida na retrospectiva da v1.0. Risco R-5 (crescimento de escopo) limitou a v1.1 a uma evolução.

## Review
Registro em [PR da v1.1](../../06-pos-lancamento/pr-v1.1-proposta.md) e no [CHANGELOG](../../../CHANGELOG.md). Falha encontrada: o `beforeAll` da integração estourava os 10 s de hook quando rodava junto dos unitários, e o limite passou a 90 s.

## Retrospectiva
Os totais da proposta diferem dos do relatório (payback de 9,1 contra 15,3 meses) porque somam só o escopo agendado. A diferença ficou explícita na tela e na documentação, com o risco de alguém comparar os dois sem ler o escopo.
