# 01 · Visão e discovery

[← Índice do ciclo de vida](README.md) · Próximo: [02 · Planejamento e Scrum](02-planejamento-e-scrum.md)

## Visão do produto

O Mapa é uma ferramenta de apoio à primeira conversa entre uma consultoria de automação e o cliente. Conduz o levantamento por área, pontua cada processo com critérios escritos e entrega ranking, matriz esforço × retorno, roteiro de 30/60/90 dias e relatório em PDF, com o retorno em faixa e as premissas à vista.

**Proposta de valor:** o cliente consegue conferir por que um processo vem antes de outro e quanto de incerteza há na estimativa.

## Problema central

Cenário: a consultoria faz o diagnóstico numa conversa solta, anota em caderno e ordena por experiência. Cinco dores aparecem no fluxo atual ([AS-IS](../01-discovery/06-processo-as-is.md)): falta de roteiro, dado faltante invisível, critério implícito, faixa de investimento sem base e ausência de explicação quando o cliente pergunta "por que esse primeiro?".

## Partes interessadas

| Papel | Interesse | Registro |
|---|---|---|
| Sócio-consultor da consultoria | Rapidez; relatório com um número logo no topo | [Reunião 1](../01-discovery/03-reuniao-socio.md) |
| Analista de projetos | Profundidade, rastreabilidade, nota por critério | [Reunião 2](../01-discovery/04-reuniao-analista.md) |
| Dono da clínica (cliente) | Horas devolvidas à operação; dado de paciente não sai da máquina | [Reunião 3](../01-discovery/05-reuniao-dono-clinica.md) |

## Escolha do projeto

Cinco ideias foram pontuadas numa matriz de decisão; o diagnóstico de processos obteve 4,60, à frente do mapeador (3,60), da proposta (3,30), da calculadora de ROI (3,25) e do checklist (3,05). Conta e critérios em [brainstorm e decisão](../01-discovery/01-brainstorm-e-decisao.md).

## Perguntas de discovery

O roteiro tem três perguntas por área (comercial, atendimento, financeiro, operação e RH), e cada uma alimenta um critério da pontuação. A tabela completa está em [perguntas-chave](../01-discovery/perguntas-chave.md). Exemplos:

| Pergunta | O que revela | Critério alimentado |
|---|---|---|
| "Qual mensagem vocês mais repetem no dia?" | Repetição com texto parecido | Repetitividade |
| "O que precisa ser conferido à mão todo fechamento?" | Tempo recorrente e fonte de erro | Impacto |
| "Qual controle ainda é feito em papel ou planilha solta?" | Digitalização dos dados | Esforço |

## Escopo e fora de escopo

| Dentro | Fora ([roadmap](../06-pos-lancamento/roadmap.md)) |
|---|---|
| Levantamento por área, pontuação, ranking, matriz, premissas, relatório web e PDF, versões, formulário do cliente, modelo de proposta (v1.1) | Assinatura de proposta, CRM, cobrança, multiempresa, geração automática de automações |

## Restrições, premissas e riscos iniciais

| Tipo | Item |
|---|---|
| Negócio | Dado de paciente não pode sair da máquina (reunião 3); o consultor precisa explicar a ordem ao cliente |
| Técnica | Pontuação pura e sem I/O (RNF-01); tudo local, sem segredo no repositório (RNF-04) |
| Operacional | Cliente sem conta: acesso só por link com validade ([ADR-005](../04-arquitetura/adr-005-link-do-cliente.md)) |
| Premissa | Tempos e volumes vêm do relato do cliente, não de medição; pesos não foram calibrados com dados reais |
| Risco | R-1 a R-7 em [riscos e hipóteses](../02-definicao/riscos.md) |

## Critérios de sucesso

Nenhum ganho foi medido. As hipóteses H-1 a H-4 ([riscos](../02-definicao/riscos.md)) dizem como cada uma seria validada, por exemplo cronometrar cinco diagnósticos com e sem o Mapa (H-1). Os critérios verificáveis do estudo são requisitos atendidos, regras cobertas por teste e relatório reproduzível.

## Transição para requisitos

Os pedidos das reuniões viram requisitos em [03 · Requisitos e rastreabilidade](03-requisitos-e-rastreabilidade.md). Registro das reuniões: [reunioes/](reunioes/README.md).
