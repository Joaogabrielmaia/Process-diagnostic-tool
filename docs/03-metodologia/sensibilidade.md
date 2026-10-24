# Análise de sensibilidade

**Pergunta:** o que muda se uma premissa que eu escolhi estiver errada? Variei **uma premissa por vez** sobre o diagnóstico completo da Clínica Vida Plena (v2, 14 processos) e registrei a saída real do script [`scripts/sensitivity.ts`](../../scripts/sensitivity.ts) (`npm run sensitivity`). Nada abaixo foi calculado à mão nem arredondado por mim.

**Base** (premissas padrão): economia realista **R$ 4.967/mês**, investimento realista **R$ 75.870**, payback **15,3 meses**, somados sobre os processos fora do quadrante "evitar".

## 1. Custo da hora

| Custo da hora | Economia mensal (conserv. / realista / otimista) | Payback realista (meses) | 1º do ranking |
|---|---|---|---|
| R$ 28 | R$ 2.208 / R$ 3.311 / R$ 4.415 | 22,9 | Confirmação de consultas por WhatsApp |
| R$ 35 | R$ 2.759 / R$ 4.140 / R$ 5.519 | 18,3 | Confirmação de consultas por WhatsApp |
| **R$ 42** | R$ 3.311 / R$ 4.967 / R$ 6.622 | **15,3** | Confirmação de consultas por WhatsApp |
| R$ 50 | R$ 3.942 / R$ 5.913 / R$ 7.884 | 12,8 | Confirmação de consultas por WhatsApp |
| R$ 60 | R$ 4.730 / R$ 7.096 / R$ 9.461 | 10,7 | Confirmação de consultas por WhatsApp |

**Elasticidade (±20% sobre R$ 42):** economia realista R$ 3.975 (−20%) → R$ 4.967 → R$ 5.960 (+20%). A economia varia na mesma proporção (relação linear, como a fórmula manda).

**O ranking muda?** Não. A ordem foi idêntica em R$ 28, R$ 42 e R$ 60. Motivo: o custo da hora multiplica a economia em reais, mas a prioridade usa só potencial e esforço, que não dependem dele. **Consequência prática:** errar o custo da hora **não muda o que fazer primeiro**; muda apenas **quanto** dizer que se economiza e o payback.

## 2. Redução esperada (cenário realista)

| Redução realista | Economia mensal (conserv. / realista / otimista) | Payback realista (meses) |
|---|---|---|
| 40% | R$ 3.311 / R$ 3.311 / R$ 6.622 | 22,9 |
| 50% | R$ 3.311 / R$ 4.140 / R$ 6.622 | 18,3 |
| **60%** | R$ 3.311 / R$ 4.967 / R$ 6.622 | **15,3** |
| 70% | R$ 3.311 / R$ 5.794 / R$ 6.622 | 13,1 |

**Achado que me incomodou:** com redução realista de 40%, o cenário realista **coincide** com o conservador (R$ 3.311 nos dois), e a faixa fica menos informativa. O sistema permite (exige só ordem não decrescente), mas o consultor deve perceber que, ao igualar cenários, está dizendo que não há incerteza. Não bloqueei porque há casos legítimos; deixo registrado como cuidado de uso.

## 3. Hora do consultor

| Hora do consultor | Economia (igual nas três linhas) | Payback realista (meses) |
|---|---|---|
| R$ 100 | R$ 3.311 / R$ 4.967 / R$ 6.622 | 10,2 |
| R$ 150 | idem | 15,3 |
| R$ 200 | idem | 20,4 |
| R$ 250 | idem | 25,5 |

O payback é **proporcional** à hora do consultor (a economia não muda). É a premissa que mais mexe no payback por unidade de erro, e a mais sob controle do próprio consultor.

## 4. Corte de potencial dos quadrantes

| Limiar de potencial | Começar já | Planejar | Oportunista | Evitar |
|---|---|---|---|---|
| 40 | 2 | 5 | 1 | 6 |
| 45 | 2 | 5 | 1 | 6 |
| **50** | 2 | 4 | 1 | 7 |
| 55 | 2 | 4 | 1 | 7 |
| 60 | 1 | 3 | 2 | 8 |

A classificação é **estável entre 40 e 55** para "começar já" (2 processos). O resultado só muda com corte alto (60): um processo sai de "começar já". Isso me dá alguma confiança de que o corte em 50 não é frágil neste conjunto de dados, **mas é um conjunto só, e fictício**.

## 5. Dado faltante (versão 1 × versão 2)

A v1 tem 12 processos com completude média de 87%; a v2 tem 14 processos com 100%. Resumo real:

| | v1 (dados faltando) | v2 (completa) |
|---|---|---|
| Processos | 12 | 14 |
| Horas/mês | 224,2 | 245,3 |
| Economia (conserv. / realista / otimista) | R$ 3.082 / 4.687 / 6.333 | R$ 3.311 / 4.967 / 6.622 |
| Payback realista | 15,9 meses | 15,3 meses |
| 1º do ranking | Registro de evolução no prontuário | Confirmação de consultas por WhatsApp |

**Leitura:** o dado faltante **mudou o primeiro colocado**. Na v1, a confirmação de consultas (completude 89%, sem a taxa de erro) ficou em 2º; com a taxa de erro de 8% informada, ela passou para 1º. É a melhor justificativa para o Mapa mostrar completude: uma decisão tomada sobre dado faltante é uma decisão mais frágil.

## Conclusões

1. A **ordem das oportunidades** é robusta ao custo da hora e aos cortes testados; é sensível a **dado faltante**.
2. **Valores em reais e payback** dependem linearmente das premissas de custo e redução: tratar sempre como faixa.
3. Não testei variação **dos pesos** do potencial e do esforço (só do corte de potencial). É uma lacuna; está no [roadmap](../06-pos-lancamento/roadmap.md).

Saída bruta do script: [.sensitivity-output.md](.sensitivity-output.md)
