# Episódio 0 — Sobre este caso

O Mapa é uma ferramenta que o consultor usa na primeira conversa com um cliente para decidir onde vale automatizar.
O caso é inventado: a consultoria Atalho Automação e a Clínica Vida Plena não existem, e os números do diagnóstico foram criados para o estudo.
Esta página separa o que é simulado do que é real, para que ninguém leia o material como operação de cliente.

| Documento | O que contém | Itens |
|---|---|---|
| [Sobre este caso](#sobre-este-caso) | Cenário, personagens fictícios e a tabela Real × simulado | 5 personagens · 5 linhas |

← Anterior · [Índice](../INDEX.md) · [Próximo →](../01-discovery/README.md)

---

# Sobre este caso

Este projeto é um estudo de caso sobre diagnóstico de processos para consultorias de automação: descobrir o problema, definir critérios, decidir, construir, testar e evoluir.

## O que é o Mapa

O **Mapa** é uma ferramenta que o consultor usa na primeira conversa com um cliente para descobrir **onde vale a pena automatizar**. Ela conduz um roteiro de perguntas por área, pontua cada processo com critérios claros, e gera um relatório com ranking de oportunidades, matriz esforço × retorno, roteiro de 30/60/90 dias e uma faixa de investimento, pronto para virar proposta.

O diferencial não é tecnológico. É o **raciocínio de consultor**: critérios explícitos, contas à vista e honestidade sobre a incerteza (faixas, não números exatos).

## Personagens e empresas (todos fictícios)

| Quem | Papel | Observação |
|---|---|---|
| **Atalho Automação** | Consultoria de automação de 4 pessoas | Fictícia. É quem usaria o Mapa. |
| **Marcos Ribeiro** | Sócio-consultor da Atalho | Quer rapidez no diagnóstico. |
| **Camila Duarte** | Analista de projetos da Atalho | Quer profundidade e rastreabilidade. |
| **Clínica Vida Plena** | Clínica de fisioterapia, 18 pessoas | Fictícia. É o cliente de exemplo do diagnóstico. |
| **Ricardo Tavares** | Fisioterapeuta e dono da Vida Plena | Fala em nome do cliente nas reuniões. |

Nomes brasileiros comuns, escolhidos ao acaso. Nenhuma pessoa ou marca real é retratada.

## Real × simulado

| Item | Situação | Observação |
|---|---|---|
| Reuniões, entrevistas e validações | Simuladas | Cada registro abre com a linha de reunião simulada |
| Atalho, Vida Plena e pessoas | Fictícias | Nenhuma pessoa ou marca real é retratada |
| Números do diagnóstico (horas, volumes, taxas de erro, custo da hora) | Fictícios | Criados para o estudo; a economia é estimativa com fórmula visível e faixa |
| Código, testes, prints e PDF | Reais | Gerados rodando a ferramenta; veja o [relatório de testes](../05-qualidade/relatorio-de-testes.md), com as falhas |
| Cliente, produção, hospedagem | Não existem | Tudo roda localmente (Docker Compose) |

Próximo passo: [discovery](../01-discovery/01-brainstorm-e-decisao.md). Índice completo: [INDEX](../INDEX.md).
