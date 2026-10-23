# Sprint 1 · Motor e dados: review

**Meta:** a pontuação funciona, é testada e há dados para demonstrar. (Sobre o formato das sprints: [backlog](../02-definicao/backlog-sprints.md).)

## Entregue

| Item | Commit |
|---|---|
| Estrutura, Docker Compose, Vitest/Playwright configurados (RNF-04) | `chore: estrutura inicial do projeto` |
| Motor: critérios, potencial, esforço, quadrantes, ranking, retorno, payback, roteiro, comparação (RF-05 a RF-08, RN-01 a RN-09) | `feat(scoring): motor de pontuação determinístico...` |
| 74 testes unitários com valores calculados à mão | idem |
| Modelo Prisma, seed da Vida Plena em 2 versões (RF-16) | `feat(data): ...` |
| Script de sensibilidade | `feat(scoring)` |

## Resultado real

- 74 testes unitários passaram na primeira execução. Isso me deixou **desconfiado**, então reli os testes e achei um que não verificava nada (o da capacidade do roteiro tinha uma asserção do tipo "tamanho ≥ 0"). Reescrevi para checar o total de horas e que algo foi agendado. Lição: teste que passa de primeira merece revisão.
- Cobertura medida de `src/lib/scoring` (v8): 100% de linhas, ramos e funções. Cobertura alta não prova ausência de erro, mas mostra que nenhum ramo ficou sem execução.

## O que deu errado ou me surpreendeu

1. **Ajuste de premissas depois de ver o resultado.** Rodei o ranking do seed e o payback do portfólio deu cerca de 20 meses. Ajustei dois padrões (custo da hora de R$ 38 para R$ 42; hora do consultor de R$ 180 para R$ 150) para valores que considerei mais típicos. **Isso é um viés**: mexi nas premissas olhando o resultado. Registro aqui para você pesar. O resultado continuou modesto (payback realista de 15,3 meses) e eu **não** mexi em pesos nem cortes.
2. **Resultado modesto.** Uma clínica de 18 pessoas tem retorno de ordem de um ano. Preferi mostrar isso a inflar números; é uma característica honesta do produto.
3. **Cenários podem colapsar.** Com redução realista = conservadora, as duas faixas coincidem (descoberto na sensibilidade). Registrado como cuidado de uso.

## Decisão de escopo
Nada cortado.
