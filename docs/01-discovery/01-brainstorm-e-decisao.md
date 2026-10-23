# 01 · Brainstorm de ferramentas e decisão

**Contexto.** Preciso de um projeto que sirva a uma consultoria pequena de automação e que, ao mesmo tempo, mostre meu raciocínio de consultor, não só de programador. Levantei cinco ideias.

## As cinco ideias

| # | Ideia | O que faz |
|---|---|---|
| A | **Diagnóstico de processos** | Conduz um roteiro, pontua cada processo e gera ranking, matriz e relatório. |
| B | Calculadora de ROI | Recebe horas, custo e redução esperada; devolve retorno. |
| C | Gerador de proposta | Monta o documento comercial a partir de escopo e preço. |
| D | Checklist de maturidade | Questionário que dá uma nota de "prontidão para automação". |
| E | Mapeador de processos | Desenha fluxos (AS-IS e TO-BE) de cada processo. |

## Matriz de decisão

Critérios e pesos (somam 100%): **valor para a consultoria** 30% · **diferencial / mostra raciocínio** 25% · **encaixe com meu portfólio** 20% · **facilidade de construir** 15% · **baixo risco** 10%. Notas de 1 a 5.

| Ideia | Valor (30) | Diferencial (25) | Portfólio (20) | Facilidade (15) | Baixo risco (10) | **Total** |
|---|---|---|---|---|---|---|
| **A · Diagnóstico** | 5 | 5 | 5 | 3 | 4 | **4,60** |
| E · Mapeador | 4 | 4 | 4 | 2 | 3 | 3,60 |
| C · Proposta | 4 | 2 | 3 | 4 | 4 | 3,30 |
| B · Calculadora de ROI | 3 | 2 | 3 | 5 | 5 | 3,25 |
| D · Checklist | 3 | 2 | 2 | 5 | 5 | 3,05 |

Conta da A: 5×0,30 + 5×0,25 + 5×0,20 + 3×0,15 + 4×0,10 = 1,50 + 1,25 + 1,00 + 0,45 + 0,40 = 4,60.

## Decisão

- **Escolha:** A, o diagnóstico de processos, chamado **Mapa**.
- **Por quê:** é o que mais separa um consultor de um implementador. Diagnosticar bem exige critério, e critério é exatamente o que quero demonstrar. Também absorve as outras ideias: a calculadora de ROI (B) vira o módulo de retorno do diagnóstico; o checklist (D) vira o roteiro de perguntas; a proposta (C) vira a evolução natural, o que de fato fiz na [v1.1](../06-pos-lancamento/roadmap.md).
- **Trade-off:** é a ideia mais difícil de construir (nota 3 em facilidade). Aceito, porque a dificuldade está justamente nas decisões de metodologia que quero mostrar.
- **Alternativas descartadas:** o mapeador (E) é o segundo colocado, mas gera diagramas, e diagrama bonito não ajuda a decidir *o que* automatizar. A calculadora (B) e o checklist (D) são pequenos demais para sustentar um caso completo.
- **Quando eu mudaria de ideia:** se a consultoria já tivesse um bom método de diagnóstico e o gargalo fosse fechar propostas, eu escolheria C. A matriz mostra isso: se o peso de "valor" caísse e o de "facilidade" subisse, C e B ganhariam terreno.

Próximo: [o negócio Atalho Automação](02-negocio-atalho.md).
