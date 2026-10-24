# 04 · Reunião 2: analista de projetos (Camila Duarte)

> Reunião simulada; pessoas e empresa fictícias.

**Objetivo:** entender o que a analista precisa para transformar o diagnóstico em projeto. **Participantes:** Camila Duarte (persona da analista) e eu.

## Resumo da conversa

**Camila:** "Eu é quem pega o diagnóstico e monta o projeto. Quando o diagnóstico é raso, eu volto ao cliente cinco vezes. Preciso saber frequência, volume, quem faz, em que ferramenta, quantos erros, de quem depende e se tem dado sensível. Sem isso, eu não consigo estimar esforço."

**Eu:** "O Marcos pediu menos perguntas e uma reunião de 45 minutos."

**Camila:** "Ele pensa na reunião. Eu penso na semana seguinte. Diagnóstico raso custa mais caro depois."

## O conflito e como resolvi

| Marcos (rapidez) | Camila (profundidade) |
|---|---|
| Menos perguntas, 45 minutos | Dez campos por processo, com rastreabilidade |

**Decisões:**

1. **Dez campos por processo**, mas **todos exceto frequência são opcionais**. A Camila tem o que precisa quando o cliente sabe; o Marcos não trava quando o cliente não sabe.
2. **Completude** como métrica visível: cada processo mostra "falta: taxa de erro, dependências". A Camila sabe o que voltar a perguntar; o Marcos vê o que ainda falta sem interromper a conversa.
3. **Dado faltante nunca vira zero.** Entra um valor cauteloso e a faixa de retorno se alarga (veja [metodologia](../03-metodologia/README.md), RN-08).
4. **Formulário curto antes da reunião** adianta o básico, para os 45 minutos serem usados em completar e validar.

## Pedido vago

**Camila:** "Quero rastreabilidade."

**Eu:** "De quê?"

**Camila:** "De por que o processo X ficou na frente do Y, e do que mudou entre a primeira conversa e a final."

→ Requisitos: **nota por critério visível** em cada processo do ranking e **versões comparáveis** (RF-12, [ADR-004](../04-arquitetura/adr-004-versoes.md)).

## O que a Camila pediu e eu recusei

Ela sugeriu um campo livre "descrição detalhada do processo" obrigatório. Recusei para o MVP: texto livre não entra na pontuação, torna o cadastro lento e vai contra o pedido de rapidez. Fica um campo opcional de observações (600 caracteres). Eu mudaria de ideia se, na prática, as observações se mostrassem a parte que mais ajuda a Camila nos projetos.

Próximo: [reunião 3, com o dono da clínica](05-reuniao-dono-clinica.md).
