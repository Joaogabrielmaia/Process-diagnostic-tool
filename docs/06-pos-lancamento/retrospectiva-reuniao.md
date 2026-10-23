# Reunião de retrospectiva

> Simulação: o Claude interpretou o cliente nesta conversa.

**Participantes:** Marcos Ribeiro, Camila Duarte e eu, depois da [aceitação](../05-qualidade/reuniao-aceitacao.md) da v1.0.

## O que funcionou
- **Marcos:** "O relatório com a faixa e a conta à vista dá confiança. Posso mostrar o critério."
- **Camila:** "A comparação de versões mostrou que o dado faltante mudou o primeiro lugar. Isso eu não conseguia mostrar com planilha."
- **Eu:** documentar as limitações cedo evitou promessa que o produto não cumpre.

## O que não funcionou
- **Marcos:** "Depois do relatório, eu ainda tenho que redigir a proposta no Word, copiando os números na mão."
- **Camila:** "Os pesos continuam no código; quando discordo de um, tenho que pedir para você."
- **Eu:** os pesos e cortes **não foram calibrados**; sem dados reais de projetos, estou no escuro. E ajustei duas premissas olhando o resultado (viés registrado na [review da sprint 1](../05-qualidade/sprint-1-review.md)).

## Três melhorias decididas

| # | Melhoria | Dono da dor | Decisão |
|---|---|---|---|
| 1 | **Modelo de proposta gerado a partir do diagnóstico** (escopo, cronograma 30/60/90, faixa de investimento, premissas, exclusões), para baixar em Markdown | Marcos | **Implementar agora** (v1.1.0) |
| 2 | **Editar pesos pela tela** e incluir a variação dos pesos na análise de sensibilidade | Camila | Roadmap (v1.2) |
| 3 | **Ciclo de calibração:** registrar, depois de cada projeto real, as horas estimadas × realizadas e ajustar premissas | Eu | Roadmap (depende de projetos reais, que este estudo não tem) |

## Por que a #1 e não a #2

**Contexto:** só caberia uma evolução. **Alternativas:** a #2 (pesos) e a #3 (calibração). **Escolha:** a #1. **Motivo:** é a única que remove um retrabalho visível no fluxo do consultor sem exigir decisões de método que eu ainda não sei tomar; a #2 sem calibração só daria ao consultor mais botões sem uma base melhor para escolher valores, e a #3 depende de dados que não existem neste estudo. **Trade-off:** adiar a #2 mantém a dependência da Camila de mim para trocar pesos. **Quando eu mudaria de ideia:** se mais de um consultor passasse a usar o Mapa, a #2 viria primeiro.

## Itens de higiene (não são melhorias de produto)
Tabelas legíveis no celular; limite de tentativas de login e de envios do link do cliente; auditoria de acessibilidade automatizada. Todos no [roadmap](roadmap.md).
