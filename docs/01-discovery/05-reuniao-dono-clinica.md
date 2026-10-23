# 05 · Reunião 3: dono da clínica (Ricardo Tavares, Clínica Vida Plena)

> Simulação: o Claude interpretou o cliente nesta conversa. A Clínica Vida Plena é fictícia.

**Objetivo:** ver o diagnóstico pela ótica de quem o recebe e levantar os processos da clínica. **Participantes:** Ricardo Tavares (interpretado pelo Claude), fisioterapeuta e dono, e eu no papel de consultor.

## O que o Ricardo contou

A clínica tem **18 pessoas**: fisioterapeutas, recepção, financeiro e administrativo. Os incômodos citados:

- "A recepção passa a manhã mandando mensagem para confirmar consulta. E mesmo assim tem falta."
- "Remarcar é um quebra-cabeça: agenda, WhatsApp, às vezes papel."
- "Faturar convênio é semanal e dá erro de guia."
- "Estoque de material é em papel; já faltou gaze em dia de movimento."
- "Eu não sei dizer quanto tempo gastamos com cada coisa. Chuto."

(Esses relatos geraram os 14 processos do [seed](../../src/lib/seed-data.ts).)

## Pedido vago e como refinei

**Ricardo:** "Quero que o computador cuide da clínica."

**Eu:** "O que você faria com o tempo que sobrasse?"

**Ricardo:** "Atender mais pacientes e parar de fechar o dia às oito da noite."

→ Refinamento: o valor para esse cliente é **horas devolvidas à recepção e ao financeiro**, não "tecnologia". O relatório fala em horas por mês e roteiro realista, não em "transformação digital".

## Contradição interna do cliente

O Ricardo disse "quero tudo automatizado" e, minutos depois, "não confio em mexer na agenda sem alguém conferindo". Isso me ensinou algo que virou regra de comunicação: o relatório propõe **primeiro o que não toca em dado crítico** e marca "revisão humana" onde há dado de saúde. O quadrante "planejar" e a seção de riscos existem por isso.

## A restrição que mudou o escopo

**Ricardo:** "Uma coisa é inegociável: dados de paciente não podem sair do computador da clínica nem ir para nenhum site. Já tive susto com isso."

**Impacto no escopo (decisões):**

| Antes | Depois |
|---|---|
| Ideia de guardar o diagnóstico em serviço na nuvem | **Tudo local** (Docker Compose, banco no computador) |
| Resumo por IA recebendo o diagnóstico completo | A IA **só recebe números agregados** já calculados, nunca nomes de pacientes (e nem há campo para isso). É opcional e fica atrás de uma interface com `MockProvider` ([ADR-001](../04-arquitetura/adr-001-pontuacao-deterministica.md)). |
| Formulário do cliente livre | Formulário curto com aviso: **não informe dados de pacientes**. Ele só acrescenta processos e não lê nada ([ADR-005](../04-arquitetura/adr-005-link-do-cliente.md)). |
| Risco LGPD como nota de rodapé | Passa a ser **critério de risco** que entra no esforço e **seção própria** no relatório |

**Quando eu mudaria de ideia:** se o cliente aceitasse um serviço em nuvem com contrato de operador de dados, o resumo por IA e o armazenamento poderiam sair do local. Aqui, não.

Próximo: [processo atual (AS-IS) e perguntas-chave](06-processo-as-is.md).
