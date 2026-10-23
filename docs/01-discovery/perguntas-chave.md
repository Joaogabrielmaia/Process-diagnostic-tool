# Perguntas-chave do roteiro de discovery

O roteiro tem **três perguntas por área**, escolhidas porque cada uma revela algo que alimenta um critério da pontuação. O texto exato está em [`src/lib/discovery-script.ts`](../../src/lib/discovery-script.ts) e aparece na tela de roteiro.

Depois das perguntas da área, o consultor registra **cada processo** citado com nove campos. Por que cada campo existe:

| Campo | Pergunta ao cliente | Por que pergunto | Alimenta |
|---|---|---|---|
| Frequência | "Com que frequência acontece?" | Define quantas vezes por mês o tempo se repete | Frequência, horas/mês |
| Volume por execução | "Quantos itens por vez?" | Escala do trabalho; alto volume paga mais a automação | Volume |
| Minutos por execução | "Quanto tempo leva, de uma pessoa?" | É a base do cálculo de horas e do retorno | Impacto, retorno |
| Nº de pessoas | "Quantas pessoas fazem?" | Multiplica o tempo total | Horas/mês |
| Ferramentas | "Em que ferramentas?" | Define facilidade de integração (planilha online é fácil; papel não) | Integração |
| Padronização (1 a 5) | "Todos fazem do mesmo jeito?" | Só se automatiza o que já tem um jeito único | Repetitividade |
| Taxa de erro percebida | "Em quantas vezes dá erro?" | Erro tem custo além do tempo | Impacto |
| Digitalização (1 a 5) | "Onde estão os dados?" | Papel exige digitar antes de automatizar | Esforço |
| Dependências | "De quantos sistemas ou terceiros depende?" | Dependência externa aumenta risco e esforço | Risco |
| Dados sensíveis | "Passa dado pessoal, de saúde ou financeiro?" | Define o risco com a LGPD | Risco |

## Por que só frequência é obrigatória

Sem frequência não há como calcular horas por mês. Qualquer outro campo pode faltar sem impedir o cálculo, porque o motor usa um [valor cauteloso](../03-metodologia/README.md#dado-faltante-rn-08) e sinaliza a lacuna. Foi a forma de conciliar a pressa do Marcos com a profundidade da Camila ([reunião 2](04-reuniao-analista.md)).

## Perguntas por área (resumo)

| Área | Pergunta de abertura | Por que |
|---|---|---|
| Comercial | Como um contato novo chega e quem responde primeiro? | Revela atraso e dependência de uma pessoa |
| Atendimento | Qual mensagem vocês mais repetem no dia? | Repetição com texto parecido é o melhor sinal de automação |
| Financeiro | O que precisa ser conferido à mão todo fechamento? | Conferência manual é tempo recorrente e fonte de erro |
| Operação | Qual controle ainda é feito em papel ou planilha solta? | Papel pesa na digitalização |
| RH | Quais tarefas se repetem todo mês na mesma data? | Rotina previsível é fácil de planejar |
