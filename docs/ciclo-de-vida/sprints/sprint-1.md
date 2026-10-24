# Sprint 1 · Motor e dados

[← Índice do ciclo de vida](../README.md) · [← Sprints](README.md) · [Sprint 2 →](sprint-2.md)

Período acadêmico: 07/09 a 18/09/2026. Os commits abaixo têm as datas reais registradas em [desenvolvimento e configuração](../06-desenvolvimento-e-configuracao.md).

## Objetivo
A pontuação funciona, é testada e há dados para demonstrar.

## Escopo
US-13 (dados) e a base de US-04, US-05 e US-06. Requisitos RF-05 a RF-08, RF-16, RNF-01, RNF-04 e RN-01 a RN-09.

## Entregáveis
- Estrutura do projeto, Docker Compose, Vitest e Playwright configurados (`4bb1719`)
- Motor de pontuação: critérios, potencial, esforço, quadrantes, ranking, retorno, payback, roteiro e comparação (`d827b84`)
- Modelo Prisma e seed da Clínica Vida Plena em duas versões (`4e89286`)
- Script de sensibilidade

## Critério de conclusão
Regras RN-01 a RN-09 cobertas por teste com valor calculado à mão; `tsc` e `eslint` sem avisos. Vale também a [Definition of Done](../02-planejamento-e-scrum.md#definition-of-done).

## Planejamento
Meta: motor puro e verificável antes de qualquer tela. Risco principal: R-1 (pesos sem calibração), tratado com pesos documentados e configuráveis (ADR-002).

## Review
74 testes unitários passaram na primeira execução. A revisão dos testes achou um sem asserção útil (capacidade do roteiro), reescrito. Cobertura de `src/lib/scoring` em 100% na época. Fonte: [sprint 1 review](../../05-qualidade/sprint-1-review.md).

## Retrospectiva
Ajustar premissas olhando o resultado é viés: custo da hora de R$ 38 para R$ 42 e hora do consultor de R$ 180 para R$ 150 foram alterados depois de ver o payback. O registro ficou nas lições. O retorno modesto da clínica foi mantido e não inflado. Cenários podem colapsar quando redução realista = conservadora.
