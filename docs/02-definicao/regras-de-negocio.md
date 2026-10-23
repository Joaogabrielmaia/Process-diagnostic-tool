# Regras de negócio

Cada regra tem ID, texto e onde está implementada. O detalhamento numérico (tabelas de corte, pesos, exemplos) está na [metodologia](../03-metodologia/README.md).

| ID | Regra | Implementação |
|---|---|---|
| RN-01 | Cada critério vira uma nota de 0 a 100 por tabela de corte (frequência, volume, tempo, impacto, risco) ou por escala (padronização, digitalização, integração) | `src/lib/scoring/engine.ts` |
| RN-02 | **Potencial** = 20% frequência + 15% volume + 25% repetitividade + 40% impacto | `scoreProcess` |
| RN-03 | **Esforço** = 35% (100 − digitalização) + 35% (100 − integração) + 30% risco | `scoreProcess` |
| RN-04 | **Quadrantes**: potencial ≥ 50 e esforço < 50 → *Começar já*; potencial ≥ 50 e esforço ≥ 50 → *Planejar*; potencial < 50 e esforço < 50 → *Oportunista*; senão → *Evitar* | `quadrantOf` |
| RN-05 | **Prioridade** = 60% potencial + 40% (100 − esforço); ranking decrescente, empate por horas/mês e depois por nome | `rankProcesses` |
| RN-06 | **Retorno** mensal = horas/mês × custo da hora × redução, em três cenários; **horas de implantação** = mín. + esforço/100 × (máx. − mín.); **investimento** = horas × hora do consultor, com faixa; **payback** = investimento ÷ economia | `scoreProcess` |
| RN-07 | **Roteiro 30/60/90**: janelas com capacidade em horas; *Começar já* pode começar na janela 1, *Planejar* só na 2, *Oportunista* só se sobrar capacidade, *Evitar* nunca entra; item maior que a janela ocupa janelas seguidas; o que não fecha em 90 dias fica "para depois" | `buildRoadmap` |
| RN-08 | **Dado faltante** nunca vira zero: usa valor cauteloso, é listado, reduz a completude e alarga a faixa (o cenário conservador cai mais que o realista; o otimista não muda) | `scoreProcess`, `MISSING_DEFAULTS` |
| RN-09 | Pesos do potencial somam 1, os do esforço somam 1, e o peso do potencial na prioridade fica entre 0 e 1 | `validateConfig` |
| RN-10 | **Riscos do relatório** são derivados por regra, só de processos fora de "evitar": LGPD (risco ≥ 70), fornecedor (ferramenta fora do catálogo ou integração ≤ 37,5), mudança de rotina (repetitividade ≤ 25), dados faltantes (completude < 80%) | `src/lib/report.ts` |
| RN-11 | **Versões**: só a mais recente é editável; nova versão copia tudo; anteriores nunca mudam | `ownLatestVersion`, `createNewVersion` |
| RN-12 | **Link do cliente**: vale 14 dias, só acrescenta processos (marcados "revisar"), não lê dados existentes | `submitClientProcess` |

## Significado de cada quadrante

| Quadrante | Condição | O que o consultor diz ao cliente | O que o roteiro faz |
|---|---|---|---|
| **Começar já** | alto potencial, baixo esforço | "Começamos por aqui: compensa e é fácil." | Entra na janela 1 |
| **Planejar** | alto potencial, alto esforço | "Vale a pena, mas precisa de desenho antes." | Entra a partir da janela 2 |
| **Oportunista** | baixo potencial, baixo esforço | "Se sobrar tempo, é barato de fazer." | Só se sobrar capacidade |
| **Evitar** | baixo potencial, alto esforço | "Hoje não compensa." | Não entra; vira nota no relatório |

## Como tratar dado faltante (RN-08, em uma tabela)

| Campo ausente | Valor usado na conta | Por que esse valor |
|---|---|---|
| Volume por execução | 1 | Não inventar escala |
| Minutos por execução | 30 | Valor modesto: não infla horas |
| Nº de pessoas | 1 | Idem |
| Padronização | 2 | Presume pouca padronização (pessimista) |
| Taxa de erro | 0% | Sem erro conhecido, sem crédito por erro |
| Digitalização | 2 | Presume dado pouco estruturado |
| Dependências | 2 | Presume alguma dependência |
| Dados sensíveis | Dados pessoais | Em saúde e serviços, presumir o pior é mais seguro |
| Ferramentas | Integração média (2,5) | Neutro |

A escolha é **cautelosa, nunca otimista**: é melhor o cliente ouvir "pode ser mais" do que "prometemos X e deu menos".
