# Reunião de validação dos wireframes e das decisões

> Simulação: o Claude interpretou o cliente nesta conversa.

**Participantes:** Marcos Ribeiro (sócio-consultor), Camila Duarte (analista), Ricardo Tavares (dono da Vida Plena) e eu. Mostrei os [wireframes](wireframes.md) e a [metodologia](../03-metodologia/README.md).

## Mudanças pedidas e minhas decisões

| # | Quem | Pedido | Decisão | Motivo |
|---|---|---|---|---|
| 1 | Marcos | "O número de economia tem de aparecer logo no topo do relatório" | **Aceito.** O resumo executivo traz a faixa e o valor realista | Atende o pedido de "um número" sem esconder a incerteza |
| 2 | Camila | "Mostre a nota de cada critério no ranking" | **Aceito.** Cada linha do ranking abre as 7 notas | É a rastreabilidade que ela pediu |
| 3 | Ricardo | "Não quero ver sigla; escreve 'Começar já', não 'quadrante Q1'" | **Aceito.** Nomes em português claro e uma frase explicando cada quadrante | O cliente precisa entender sozinho |
| 4 | Camila | "Deixe o consultor editar os pesos pela tela" | **Adiado.** Pesos ficam no código/JSON por versão neste MVP | Exige validação e tela de explicação; ADR-002 registra a limitação |
| 5 | Ricardo | "O cliente deveria poder ver o relatório pelo link" | **Aceito parcialmente:** o link continua só de escrita; o relatório vai em PDF | Link de leitura exigiria autenticação do cliente (ADR-005) |
| 6 | Marcos | "A matriz deve ter o nome de cada processo no gráfico" | **Alterado:** pontos numerados + lista ao lado | Nomes longos se sobrepõem em 14 pontos |
| 7 | Camila | "Mostre no relatório o que ficou fora e por quê" | **Aceito:** "para depois dos 90 dias" e "evitar" aparecem | Evita a impressão de que foram esquecidos |

## Recusa justificada

**Pedido (Marcos):** "Dá para a IA ler a descrição que o cliente escreve e já preencher os campos e a pontuação sozinha? Economizaria muito tempo."

**Recusei.** Motivos:

1. **Privacidade:** o Ricardo vetou dado de paciente fora da máquina; uma IA lendo texto livre do cliente arriscaria receber isso.
2. **Explicabilidade:** se a IA pontua, perco a resposta a "por que esse primeiro?" ([ADR-001](adr-001-pontuacao-deterministica.md)).
3. **Qualidade do dado:** uma IA preenchendo campos "adivinha" valores; isso é pior que deixar em branco e marcar como faltante.

**Quando eu mudaria de ideia:** como um assistente que **sugere** campos a partir de uma descrição, com o consultor confirmando cada um e sem dados de pacientes. Anotei como ideia de roadmap, não como parte da pontuação.

## Decisões confirmadas

- Pontuação determinística (ADR-001).
- Formulário do cliente só de escrita (ADR-005).
- Relatório com limitações explícitas na última seção.
