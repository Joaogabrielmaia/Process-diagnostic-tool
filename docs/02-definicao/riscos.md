# Riscos, hipóteses de ganho e premissas

## Ganhos como hipóteses

Nenhum ganho do Mapa foi **medido**. Tudo abaixo é hipótese a validar com uso real (que este estudo não tem):

| ID | Hipótese | Como validaria |
|---|---|---|
| H-1 | Um roteiro padronizado reduz o tempo de preparação de um diagnóstico | Cronometrar 5 diagnósticos com e sem o Mapa |
| H-2 | Critérios e pesos explícitos tornam a priorização mais fácil de explicar ao cliente | Perguntar ao cliente, ao fim da reunião, se entendeu a ordem |
| H-3 | A faixa (em vez de um número) reduz propostas com valor fora da realidade | Comparar faixa estimada com custo final de projetos |
| H-4 | O formulário prévio encurta a reunião | Comparar duração com e sem formulário |

## Riscos do projeto

| ID | Risco | Prob. | Impacto | Resposta |
|---|---|---|---|---|
| R-1 | Pesos e cortes escolhidos por mim não refletem a realidade | Alta | Alto | Documentei o porquê de cada um, deixei configuráveis (ADR-002) e fiz análise de sensibilidade. Assumo: **não foram calibrados com dados reais** |
| R-2 | Cliente informa tempos errados e a ferramenta dá falsa precisão | Alta | Alto | Faixas, completude visível, valor cauteloso para dado faltante e seção "o que o relatório não sabe" |
| R-3 | Dado de saúde vazar | Média | Alto | Tudo local, IA só recebe números agregados, formulário avisa para não informar dados de pacientes, risco LGPD no esforço |
| R-4 | Geração de PDF falhar (Chromium ausente, memória) | Média | Médio | Modo de falha documentado: mensagem clara; o relatório web continua; impressão do navegador como alternativa |
| R-5 | Escopo crescer (CRM, proposta, cobrança) | Alta | Médio | Lista de "fora do escopo" explícita; v1.1 limitada a uma evolução |
| R-6 | Consultor confiar cegamente no número | Média | Alto | O número realista vem sempre ao lado da faixa; textos dizem "estimativa calculada, não resultado medido" |
| R-7 | A IA gerar texto com número inventado | Baixa | Alto | A IA só recebe números prontos, o prompt proíbe inventar, e a pontuação nunca depende dela; em falha cai no mock |

## Premissas do estudo

- A Atalho e a Vida Plena são fictícias; reuniões são simuladas.
- Custo da hora (R$ 42, com encargos) e hora do consultor (R$ 150) são valores plausíveis escolhidos por mim, editáveis.
- Redução esperada de 40/60/80% por cenário é premissa, não medição.
