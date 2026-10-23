# 03 · Reunião 1: sócio-consultor (Marcos Ribeiro)

> Simulação: o Claude interpretou o cliente nesta conversa.

**Objetivo:** entender o que o Marcos espera da ferramenta. **Participantes:** Marcos Ribeiro (interpretado pelo Claude) e eu.

## Resumo da conversa

**Marcos:** "Eu preciso sair da primeira reunião com uma ideia clara do que automatizar, sem ficar uma hora preenchendo formulário na frente do cliente. Rapidez é tudo: o dono de pequena empresa perde a paciência com perguntas demais."

**Eu:** "Quanto tempo você acha razoável?"

**Marcos:** "Uns 45 minutos de conversa, no máximo. E eu quero chegar com um número: quanto ele vai economizar."

**Eu:** "Um número só?"

**Marcos:** "Um número. O cliente quer saber 'quanto eu ganho'. Se eu falar 'depende', ele desiste."

## Pedido vago e como refinei

| Pedido original | Pergunta que fiz | Requisito refinado |
|---|---|---|
| "Quero saber onde ganhar dinheiro" | "Ganhar dinheiro com o quê: economizar horas, vender mais, errar menos?" | Foco em **horas economizadas** e **erro reduzido**, convertidos em reais. Vendas ficam fora (hipótese, não cálculo). |
| "Um número só" | "E se faltar dado? O número vira chute." | Ele aceitou **uma faixa com um valor 'realista' em destaque**: dá o número que ele quer, sem esconder a incerteza. |
| "Rápido" | "Rápido é duração da reunião ou esforço depois?" | Os dois: roteiro guiado por área e **formulário curto enviado antes**, para o cliente adiantar o básico. |

## Decisões e consequências

- O relatório tem **resumo executivo no topo** com o número realista e a faixa ao lado.
- O cadastro de processo aceita **campo em branco** (dado faltante), para não travar a conversa quando o cliente não sabe.
- Nasce a ideia do **formulário do cliente por link** (veja [ADR-005](../04-arquitetura/adr-005-link-do-cliente.md)).

## Tensão que fica aberta

O Marcos quer **menos perguntas**. Depois vou ouvir a Camila, que quer mais. Isso é um conflito real de requisitos, resolvido na [reunião 2](04-reuniao-analista.md).
