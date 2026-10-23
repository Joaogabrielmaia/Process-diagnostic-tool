# Sobre este caso

Sou o João Gabriel Maia da Costa, graduando em Engenharia de Software na PUC Minas e desenvolvedor full stack. Este projeto é um estudo de caso que montei para mostrar como eu penso uma solução do começo ao fim: descobrir o problema, definir critérios, decidir, construir, testar e evoluir.

## O que é o Mapa

O **Mapa** é uma ferramenta que o consultor usa na primeira conversa com um cliente para descobrir **onde vale a pena automatizar**. Ela conduz um roteiro de perguntas por área, pontua cada processo com critérios claros, e gera um relatório com ranking de oportunidades, matriz esforço × retorno, roteiro de 30/60/90 dias e uma faixa de investimento, pronto para virar proposta.

O diferencial não é tecnológico. É o **raciocínio de consultor**: critérios explícitos, contas à vista e honestidade sobre a incerteza (faixas, não números exatos).

## Personagens e empresas (todos fictícios)

| Quem | Papel | Observação |
|---|---|---|
| **Atalho Automação** | Consultoria de automação de 4 pessoas | Fictícia. É o "meu cliente interno": quem usaria o Mapa. |
| **Marcos Ribeiro** | Sócio-consultor da Atalho | Quer rapidez no diagnóstico. |
| **Camila Duarte** | Analista de projetos da Atalho | Quer profundidade e rastreabilidade. |
| **Clínica Vida Plena** | Clínica de fisioterapia, 18 pessoas | Fictícia. É o cliente de exemplo do diagnóstico. |
| **Ricardo Tavares** | Fisioterapeuta e dono da Vida Plena | Fala em nome do cliente nas reuniões. |

Nomes brasileiros comuns, escolhidos ao acaso. Nenhuma pessoa ou marca real é retratada.

## O que é simulação e o que é real

Quero ser direto sobre isso, porque é o ponto mais importante de integridade do projeto.

- **Simulado:** as reuniões, entrevistas e validações. Nelas, o Claude (assistente de IA que me ajudou a construir o projeto) interpretou o cliente e as demais pessoas. Todo registro simulado começa com a linha:
  > Simulação: o Claude interpretou o cliente nesta conversa.
- **Fictício:** a Atalho, a Vida Plena e todos os números do diagnóstico (horas, volumes, taxas de erro, custo da hora). Foram criados para o estudo.
- **Real:** o código, os testes e as execuções. Os resultados de teste, a cobertura, os prints e o PDF foram gerados rodando a ferramenta de verdade, e registrei o que aconteceu, inclusive o que deu errado (veja [relatório de testes](../05-qualidade/relatorio-de-testes.md)).
- **Não existe:** cliente real, operação real, produção, hospedagem ou link de demonstração. Tudo roda localmente (Docker Compose). As provas são os prints, o PDF e os documentos.

Retorno e economia mostrados na ferramenta são **estimativas calculadas** a partir de dados informados, com fórmula visível e faixa de incerteza. Nunca são resultados medidos, e a ferramenta nunca afirma que algo "reduziu X%".

## Por que este projeto

Quero atuar como Consultor de Soluções, Consultor de Automação com IA e Implantação, e no futuro ter minha própria consultoria. O primeiro contato com o cliente é onde se decide quase tudo: o que vale automatizar, quanto custa e se o cliente confia em você. Resolvi construir a ferramenta que eu gostaria de ter nessa conversa.

Próximo passo: [descoberta](../01-discovery/01-brainstorm-e-decisao.md). Índice completo: [INDEX](../INDEX.md).
