# Minha retrospectiva final

Escrevo em primeira pessoa, sobre o que fiz, o que aprendi e o que eu faria diferente. A [reunião de retrospectiva](retrospectiva-reuniao.md) foi simulada; esta página é minha leitura do projeto.

## O que eu construí
Uma ferramenta de diagnóstico de processos com motor de pontuação determinístico, relatório em web e PDF, versões comparáveis, formulário do cliente e, na v1.1, modelo de proposta. 96 testes no Vitest (85 unitários, 11 de integração) e 12 E2E, todos passando na última execução, e 14 imagens geradas pelo próprio app. Detalhes e falhas no [relatório de testes](../05-qualidade/relatorio-de-testes.md).

## O que eu mais gostei de ter decidido
- **Pontuação sem IA.** Foi a decisão que mais pagou: ter valor exato nos testes, e poder responder "por que esse primeiro?" mostrando as notas. A IA ficou onde ela ajuda sem arriscar: redigir texto a partir de números prontos.
- **Dado faltante nunca virar zero.** A comparação v1 × v2 mostrou, com dados do próprio seed, que um dado faltante **trocou o primeiro colocado**. Essa decisão tem efeito visível.
- **Registrar as limitações dentro do produto**, na última seção do relatório, e não só em um documento.

## O que eu faria diferente
1. **Calibrar antes de documentar tanto.** Passei muito esforço em explicar pesos que **não foram calibrados**. Eu documentei honestamente, mas, se tivesse acesso a dados de projetos reais, começaria por eles. Essa é a maior fraqueza do método.
2. **Não ter mexido nas premissas olhando o resultado.** Ajustei custo da hora e hora do consultor depois de ver o payback. Registrei, mas é um viés que eu evitaria fixando as premissas **antes** de rodar o seed.
3. **Conferir os prints desde o primeiro dia.** Testes passando não garantiram prints certos (dois mostravam a tela errada). Aprendi a abrir o artefato, não só confiar na luz verde.
4. **Testar os caminhos de erro, não só os felizes.** Falha do Chromium e queda do banco ficaram sem teste. Hoje isso é um item do roadmap, mas deveria ter entrado no escopo.

## O que aprendi
- **Uma trava de segurança é informação.** O Prisma recusou um comando destrutivo disparado por agente de IA. Em vez de contornar, redesenhei o teste para ser mais seguro. A trava estava certa.
- **Honestidade é parte do produto.** Num instrumento de consultoria, mostrar um payback de mais de um ano é melhor do que fabricar um número bonito. Se o cliente descobrir o contrário depois, perco a credibilidade que a ferramenta existe para construir.
- **Cobertura de 100% não é qualidade.** Revisei um teste que passava sem checar nada.

## Limites que continuo assumindo
Tudo é fictício e simulado. O projeto mostra **como eu penso e como eu construo**, não que o método acerta previsões reais. A integração com a API da Anthropic não foi testada contra a API de verdade.

## Próximo passo
Usar o Mapa em uma conversa real de discovery, com autorização do cliente, e voltar a calibrar. Se eu tiver anotações de uma conversa real, elas substituem a simulação e o README é ajustado.
