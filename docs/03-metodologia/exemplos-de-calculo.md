# Exemplos de cálculo passo a passo

Os valores abaixo foram conferidos contra a saída real do código (`scoreProcess`); o exemplo 1 também é testado em [`tests/unit/scoring.test.ts`](../../tests/unit/scoring.test.ts) e [`portfolio.test.ts`](../../tests/unit/portfolio.test.ts). Premissas padrão: custo da hora R$ 42; reduções 40/60/80%; hora do consultor R$ 150; horas de implantação de 16 a 120; faixa do investimento de 85% a 140%.

## Exemplo 1: processo de referência (teste unitário)

Entrada: frequência diária; 10 itens por execução; 30 min; 2 pessoas; ferramenta Google Sheets; padronização 5; erro 10%; digitalização 5; 0 dependências; sem dado sensível.

| Passo | Conta | Resultado |
|---|---|---|
| Execuções/mês | diária | 22 |
| Horas/mês | 22 × 30 × 2 ÷ 60 | **22,0 h** |
| Frequência | 22 ≥ 20 | 100 |
| Volume | 22 × 10 = 220 itens → ≥ 100 | 60 |
| Repetitividade | (5 − 1) ÷ 4 × 100 | 100 |
| Nota de tempo | 22 h → ≥ 20 | 60 |
| Nota de erro | 10 × 4 | 40 |
| Impacto | 0,75 × 60 + 0,25 × 40 | 55 |
| Digitalização | (5 − 1) ÷ 4 × 100 | 100 |
| Integração | Google Sheets = 5 → 100 | 100 |
| Risco | nenhum 0 + 0 dependências | 0 |
| **Potencial** | 0,2×100 + 0,15×60 + 0,25×100 + 0,4×55 = 20 + 9 + 25 + 22 | **76** |
| **Esforço** | 0,35×(100−100) + 0,35×(100−100) + 0,3×0 | **0** |
| **Prioridade** | 0,6×76 + 0,4×(100−0) = 45,6 + 40 | **85,6** |
| Quadrante | 76 ≥ 50 e 0 < 50 | **Começar já** |
| Horas de implantação | 16 + 0 | 16 h |
| Economia realista | 22 × 42 = 924; 924 × 0,6 × (0,85 + 0,15×1) | **R$ 554** |
| Economia conserv. / otimista | 924 × 0,4 = 369,6 / 924 × 0,8 = 739,2 | R$ 370 / R$ 739 |
| Investimento | 16 × 150 = 2.400 (faixa 2.040 a 3.360) | R$ 2.400 |
| Payback realista | 2.400 ÷ 554 | **4,3 meses** |

## Exemplo 2: Confirmação de consultas por WhatsApp (Vida Plena, v2)

Entrada: diária; 25 itens; 40 min; 2 pessoas; WhatsApp (celular) e Sistema de agenda; padronização 4; erro 8%; digitalização 4; 1 dependência; dados pessoais.

| Passo | Conta | Resultado |
|---|---|---|
| Horas/mês | 22 × 40 × 2 ÷ 60 = 29,33 | **29,3 h** |
| Frequência | 22 ≥ 20 | 100 |
| Volume | 22 × 25 = 550 → ≥ 300 | 80 |
| Repetitividade | (4 − 1) ÷ 4 × 100 | 75 |
| Impacto | tempo 29,3 h → 60; erro 8×4 = 32; 0,75×60 + 0,25×32 = 45 + 8 | 53 |
| Digitalização | (4 − 1) ÷ 4 × 100 | 75 |
| Integração | média(2, 4) = 3 → (3 − 1) ÷ 4 × 100 | 50 |
| Risco | 40 (dados pessoais) + 1 × 6 | 46 |
| **Potencial** | 20 + 12 + 18,75 + 21,2 = 71,95 | **72** |
| **Esforço** | 0,35×25 + 0,35×50 + 0,3×46 = 8,75 + 17,5 + 13,8 | **40,1** |
| **Prioridade** | 0,6×72 + 0,4×59,9 | **67,2** |
| Quadrante | 72 ≥ 50 e 40,1 < 50 | **Começar já** |
| Horas de implantação | 16 + 0,401 × 104 | 57,7 h |
| Economia realista | 29,3 × 42 = 1.230,6; × 0,6 | **R$ 738** |
| Economia conserv. / otimista | × 0,4 / × 0,8 | R$ 492 / R$ 984 |
| Investimento | 57,7 × 150 = 8.655 (faixa 7.357 a 12.117) | R$ 8.655 |
| Payback | realista 8.655 ÷ 738 | **11,7 meses** (7,5 a 24,6) |

**Leitura honesta:** mesmo sendo a melhor oportunidade da clínica, o retorno é de cerca de **um ano** no cenário realista, e de **dois anos** no conservador. O Mapa mostra isso sem maquiar. Ganhos que ele **não** conta (menos faltas de pacientes, por exemplo) são hipóteses, não cálculo.

## Exemplo 3: o mesmo tipo de processo com dado faltante (Remarcações, v1)

Entrada na versão 1 (antes da validação): diária; 12 itens; 50 min; 2 pessoas; WhatsApp (celular) e Sistema de agenda; padronização 2; digitalização 4; **taxa de erro: não informada; dependências: não informadas**; dados pessoais.

| Passo | Conta | Resultado |
|---|---|---|
| Campos faltantes | taxa de erro e dependências: 2 de 9 | completude 1 − 2/9 = **0,78** |
| Valores cautelosos | erro 0%; dependências 2 | |
| Horas/mês | 22 × 50 × 2 ÷ 60 | 36,7 h |
| Volume | 22 × 12 = 264 → ≥ 100 | 60 |
| Repetitividade | (2 − 1) ÷ 4 × 100 | 25 |
| Impacto | tempo 36,7 h → 60; erro 0; 0,75 × 60 | 45 |
| Risco | 40 + 2 × 6 | 52 |
| **Potencial** | 20 + 9 + 6,25 + 18 = 53,25 | **53,3** |
| **Esforço** | 0,35×25 + 0,35×50 + 0,3×52 = 8,75 + 17,5 + 15,6 | **41,9** |
| **Prioridade** | 0,6×53,3 + 0,4×58,1 | **55,2** |
| Economia base | 36,7 × 42 | 1.541,4 |
| Realista | 1.541,4 × 0,6 × (0,85 + 0,15×0,78 = 0,967) | **R$ 894** |
| Conservador | 1.541,4 × 0,4 × (0,7 + 0,3×0,78 = 0,934) | R$ 576 |
| Otimista | 1.541,4 × 0,8 (sem ajuste) | R$ 1.233 |

O efeito do dado faltante é visível: o conservador cai 6,6% (fator 0,934) e o realista 3,3% (fator 0,967), enquanto o otimista não muda. Na versão 2, com os dados completos, o mesmo processo sobe de prioridade 55,2 para 58,3 porque a taxa de erro de 10% passou a contar no impacto e a dependência real (1, em vez do padrão 2) reduziu o risco (veja a [comparação de versões](../screenshots/09-comparacao-de-versoes.png)).

## Como você mesmo reproduz

```bash
npm run sensitivity      # tabelas de sensibilidade
npm test                 # confere a conta do exemplo 1 (os exemplos 2 e 3 foram conferidos contra a saída do código, sem teste dedicado)
```
