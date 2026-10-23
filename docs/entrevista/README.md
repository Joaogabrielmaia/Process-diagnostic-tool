# Perguntas de entrevista, por fase

Três perguntas por fase, com a resposta que eu daria em primeira pessoa. Todas as respostas se apoiam em coisas que estão no repositório; onde algo não foi testado ou é simulado, eu digo.

## Fase 0 · Preparação

**1. Por que Next.js, Prisma e PostgreSQL para uma ferramenta que só roda localmente?**
É a stack que domino e que me deixa focar na parte difícil, que é a metodologia. Postgres em Docker Compose deixa o ambiente reproduzível com um comando. Se fosse só um protótipo de cálculo, bastaria um script; escolhi uma aplicação completa porque o fluxo (cadastro, ranking, relatório, versões) é o que o consultor usaria.

**2. Por que não publicar em servidor?**
Duas razões: o estudo é fictício e eu não quero sugerir operação real; e o cliente simulado vetou dado de paciente fora da máquina ([reunião 3](../01-discovery/05-reuniao-dono-clinica.md)), o que também é uma restrição legítima de LGPD. As provas são prints, PDF e documentos.

**3. Como você garantiu que não há segredos no repositório?**
`.env` está no `.gitignore`; só o `.env.example` vai ao git, com valores de desenvolvimento local. O seed lê a senha do ambiente. Não rodei uma varredura automatizada de segredos; a conferência foi manual.

## Fase 1 · Descoberta

**1. Como você escolheu o que construir?**
Fiz uma matriz de decisão com cinco ideias e cinco critérios ponderados. O diagnóstico de processos ganhou (4,60 contra 3,60 do segundo) porque é o que mais demonstra critério de consultor e absorve as outras ideias. Registrei também quando eu mudaria de ideia: se o gargalo fosse fechar propostas, escolheria o gerador de proposta, e acabei fazendo isso como v1.1.

**2. Como você lidou com o sócio querendo rapidez e a analista querendo profundidade?**
Em vez de escolher um lado, desenhei o requisito para atender os dois: nove campos por processo, todos opcionais exceto a frequência, completude visível e valor cauteloso para dado faltante. A analista tem profundidade quando o cliente sabe; o sócio não trava quando não sabe. (As reuniões foram simuladas com o Claude, e eu digo isso.)

**3. Conte uma restrição que mudou o escopo.**
O dono da clínica simulado disse que dado de paciente não pode sair do computador. Isso tirou a nuvem, limitou a IA a receber só números agregados, e transformou o risco LGPD em critério da pontuação e seção do relatório.

## Fase 2 · Definição

**1. Como você priorizou os requisitos?**
MoSCoW com origem em cada reunião. Mantive como *Must* o que faz o produto existir (pontuação, ranking, relatório, PDF) e como *Should* versões e formulário do cliente, porque resolvem dores reais, mas o MVP funciona sem eles. Defini antes a ordem de corte, e não precisei usá-la.

**2. Como você tratou ganhos esperados?**
Como hipóteses, com forma de validar (ex.: cronometrar cinco diagnósticos com e sem o Mapa). Nenhum ganho foi medido, então nenhum foi afirmado.

**3. Como você garante rastreabilidade?**
Cada requisito aponta para regras, código e teste na [matriz](../02-definicao/rastreabilidade.md). Também tem pontos fracos assumidos: o texto do roteiro não tem teste automatizado.

## Fase 3 · Metodologia

**1. Por que esses pesos?**
Impacto 40% porque é o que paga o projeto; repetitividade 25% porque não se automatiza o que não tem jeito único; frequência e volume menos porque já estão em parte contidos no impacto. Digo com todas as letras que **são julgamento meu, não calibrados com dados reais**, e por isso são configuráveis e há análise de sensibilidade.

**2. Como você lida com dado faltante?**
Nunca viro zero: uso um valor cauteloso, listo o que falta, reduzo a completude e alargo a faixa de retorno (o conservador cai mais que o realista). Na comparação v1 × v2 do seed, o dado faltante trocou o primeiro colocado, o que justifica mostrar a completude.

**3. O que a sensibilidade mostrou?**
Que a ordem das oportunidades é estável ao custo da hora (R$ 28 a R$ 60) e ao corte de potencial entre 40 e 55; que os valores em reais e o payback variam linearmente com as premissas; e que, se eu igualo redução realista e conservadora, a faixa colapsa. Também admiti uma lacuna: não variei os pesos.

## Fase 4 · Arquitetura e decisões

**1. Por que pontuação determinística em vez de IA?**
Explicabilidade ("por que esse primeiro?"), reprodutibilidade (testes com valor exato) e privacidade. A IA só redige o resumo a partir de números prontos, atrás de uma interface com `MockProvider`. Perco flexibilidade com texto livre; aceito o trade-off.

**2. Como você recusou um pedido e por quê?**
Na validação simulada, o sócio pediu que a IA lesse a descrição do cliente e preenchesse tudo. Recusei por privacidade, perda de explicabilidade e porque preencher "adivinhando" é pior do que deixar em branco. Deixei aberta a ideia de um assistente que apenas sugere, com confirmação humana.

**3. Por que guardar versões como retratos completos e não um log de alterações?**
Simplicidade e fidelidade: reproduzir um relatório antigo é só ler. Pago com duplicação de dados e sem saber quem mudou o quê. Com vários editores, eu adicionaria auditoria por campo.

## Fase 5 · Implementação

**1. Como você garantiu que a regra de negócio está certa?**
Isolei a pontuação em funções puras e escrevi os valores esperados à mão antes de comparar com a saída. Passou de primeira, o que me deixou desconfiado; revisei e achei um teste que não verificava nada, e reescrevi.

**2. Como você tratou autorização?**
Cada consulta filtra pelo consultor logado; versões antigas são imutáveis no servidor; o link do cliente é só de escrita, com token aleatório e validade de 14 dias. Testei isolamento entre consultores e token expirado. Não implementei limite de tentativas de login, e digo isso.

**3. Algo deu errado na implementação?**
O Prisma recusou meu `--force-reset` por ter sido disparado por um agente de IA. Não contornei: redesenhei o setup do teste para limpar tabelas pelo cliente, só no banco de teste, com checagem do nome do banco.

## Fase 6 · Qualidade e prints

**1. Qual foi o resultado dos testes?**
Na v1.1: 96 testes no Vitest (85 unitários, 11 de integração), 12 E2E, tipos e lint limpos. Cobertura medida do módulo de pontuação: 100%. Cobertura do restante não foi medida. Falhas que tive no caminho estão no [relatório](../05-qualidade/relatorio-de-testes.md).

**2. O que não foi testado?**
A API real da Anthropic, a falha do Chromium, a queda do banco, carga e acessibilidade automatizada. Prefiro listar isso a deixar a impressão de que está tudo coberto.

**3. Qual falha de qualidade você achou "sem teste vermelho"?**
Dois prints mostravam a tela errada, e os testes passavam, porque o print saía antes da navegação terminar. Só vi abrindo a imagem. Corrigi esperando a URL mudar e passei a conferir os artefatos.

## Fase 7 · Evolução e retrospectiva

**1. Como você escolheu a melhoria da v1.1?**
Três candidatas: proposta a partir do diagnóstico, edição de pesos pela tela e ciclo de calibração. Escolhi a proposta porque remove um retrabalho concreto e não exige decisões de método que eu não sei tomar; editar pesos sem calibração só daria mais botões.

**2. Como você tratou a v1.1 tecnicamente?**
Branch `feat/proposta`, testes, changelog, descrição do PR em arquivo, merge com `--no-ff` e tag `v1.1.0`. Errei um comando de merge e a tag saiu no commit errado; apaguei e refiz. A proposta não altera a pontuação.

**3. O que você mudaria?**
Calibraria com dados reais antes de documentar tanto, fixaria premissas antes de ver resultados (ajustei duas olhando o payback) e testaria os caminhos de erro desde o começo.
