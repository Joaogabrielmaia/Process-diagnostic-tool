# Vitrine

Material pronto para currículo, LinkedIn e entrevista. Tudo se apoia no que está no repositório; nada afirma cliente real, operação real ou resultado medido.

## 3 bullets de currículo

- Projetei e construí o **Mapa**, ferramenta de diagnóstico de processos para consultorias de automação (Next.js, TypeScript, Prisma, PostgreSQL, Zod, Playwright): motor de pontuação determinístico com critérios e pesos documentados, retorno estimado em três cenários e relatório em web e PDF. *(Estudo de caso com cliente simulado.)*
- Documentei a metodologia de ponta a ponta (critérios, pesos, exemplos de cálculo, análise de sensibilidade calculada pelo código e limitações), 5 ADRs e modelo de dados, e validei com 96 testes automatizados (unitários e de integração) e 12 E2E; cobertura medida do módulo de pontuação: 100%.
- Conduzi o discovery de forma estruturada (roteiro por área, requisitos rastreáveis, tratamento explícito de dado faltante) e entreguei uma evolução (v1.1) com branch, changelog e tag, após uma retrospectiva simulada. *(Reuniões simuladas com IA no papel dos clientes.)*

## Post de LinkedIn

> Montei uma ferramenta para a primeira conversa com um cliente: onde vale a pena automatizar?
>
> Chamei de **Mapa**. Ela conduz um roteiro por área, pontua cada processo com critérios claros e gera um relatório com ranking, matriz esforço × retorno, roteiro de 30/60/90 dias e uma faixa de investimento.
>
> O que mais me ensinou:
> • **Pontuação sem IA.** Para responder "por que esse primeiro?" eu preciso mostrar a conta, não dizer "o modelo achou". A IA só redige o resumo, e é opcional.
> • **Dado faltante nunca vira zero.** Com os dados completos, o primeiro colocado do meu exemplo mudou. Mostrar a incerteza é parte do produto.
> • **Honestidade vence o número bonito.** O retorno do meu caso de exemplo é de ordem de um ano, e o relatório mostra isso, com faixa e as limitações na última seção.
>
> Um aviso importante: é um estudo de caso. A consultoria e a clínica são fictícias, as reuniões foram simuladas com IA e os números são estimativas calculadas, não resultados medidos. O que é real é o código, os testes e as falhas que encontrei no caminho (e escrevi no repositório).
>
> Está tudo documentado no GitHub: metodologia, decisões, testes e um PDF de exemplo.
>
> #automação #consultoria #engenharia de software #discovery

## Resposta de 30 segundos

"Construí uma ferramenta chamada Mapa, que o consultor usa na primeira conversa com um cliente para descobrir onde vale a pena automatizar. Ela pontua cada processo com critérios e pesos documentados, mostra uma matriz de esforço contra retorno e gera um relatório em PDF com roteiro de 30, 60 e 90 dias. O que mais me interessou foi o raciocínio: pontuação sem IA para ser explicável, faixas em vez de números exatos e tratamento explícito de dado faltante. É um estudo de caso, com cliente fictício e reuniões simuladas, e eu deixo isso claro no repositório."

## Resposta de 2 minutos

"Quero atuar como consultor de soluções e de automação, e percebi que o momento que decide mais é a primeira conversa com o cliente: o que automatizar, quanto custa e se ele confia em você. Então construí o Mapa, uma ferramenta de diagnóstico de processos.

O consultor conduz um roteiro por área. Para cada processo, registra frequência, volume, tempo, ferramentas, padronização, erro, dependências e dados sensíveis. O motor calcula um potencial e um esforço, classifica em quatro quadrantes e gera um ranking. O retorno é calculado com a conta à vista, horas por mês vezes custo da hora vezes uma redução esperada, em três cenários, e o relatório sai em web e PDF, com riscos de LGPD e uma faixa de investimento.

Três decisões que eu defendo. Primeira: a pontuação é determinística, não é IA, porque eu preciso explicar por que um processo vem antes do outro e porque o cliente simulado não aceitava dado de paciente fora da máquina; a IA só redige um resumo a partir de números prontos, e é opcional. Segunda: dado faltante nunca vira zero, vira um valor cauteloso e alarga a faixa; no meu exemplo, com os dados completos o primeiro colocado mudou. Terceira: documentei o que a ferramenta não sabe, porque os pesos são julgamento meu e não foram calibrados com dados reais.

Sobre o que é real: o código, os 96 testes automatizados, os 12 testes de ponta a ponta e as falhas que encontrei, como um print que mostrava a tela errada com os testes passando. O que é simulado: a consultoria, a clínica, as reuniões e os números, e eu deixo isso explícito. O próximo passo seria usar o Mapa em uma conversa real e calibrar."
