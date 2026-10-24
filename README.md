# Mapa

**Diagnóstico de processos para consultorias de automação: pontuação determinística e explicável, faixa de retorno em vez de número único, roteiro 30/60/90 e relatório em PDF.**

Documentação em série: [guia e trilhas de leitura](docs/INDEX.md) · [glossário](docs/GLOSSARIO.md) · [galeria de prints](docs/screenshots/README.md)

## O problema

Cenário: a Atalho Automação, consultoria fictícia de quatro pessoas, faz o diagnóstico numa conversa solta, com anotações em caderno e prioridade pela experiência do consultor ([AS-IS](docs/01-discovery/06-processo-as-is.md)).
O cliente, a Clínica Vida Plena, descreve incômodos, não processos. Sem critério escrito, a ordem de prioridade e a estimativa de retorno viram opinião.

| Matriz esforço × retorno | Relatório web |
|---|---|
| [![Matriz com 14 processos em quatro quadrantes](docs/screenshots/05-matriz-esforco-retorno.png)](docs/screenshots/05-matriz-esforco-retorno.png) | [![Relatório web com oito seções](docs/screenshots/07-relatorio-web.png)](docs/screenshots/07-relatorio-web.png) |
| **Premissas e faixa de retorno** | **Proposta (v1.1)** |
| [![Premissas e faixa de retorno](docs/screenshots/06-premissas-e-faixa-de-retorno.png)](docs/screenshots/06-premissas-e-faixa-de-retorno.png) | [![Proposta com escopo e investimento](docs/screenshots/12-proposta-v1-1.png)](docs/screenshots/12-proposta-v1-1.png) |

Relatório de exemplo em PDF: [versão 2](docs/exemplo-de-relatorio/diagnostico-clinica-vida-plena-v2.pdf) · [versão 1](docs/exemplo-de-relatorio/diagnostico-clinica-vida-plena-v1.pdf)

## Ficha técnica

| Campo | Valor |
|---|---|
| Natureza | Estudo de caso fictício |
| Stack | Next.js, TypeScript, Prisma, PostgreSQL, Zod, Vitest, Playwright |
| Testes | 85 unitários e 11 de integração (Vitest) e 15 E2E (Playwright), 2026-10-24, commit `bd3169b` ([logs](docs/05-qualidade/README.md)) |

## O que construí

- Implementei a pontuação determinística: sete critérios viram potencial, esforço, quadrante e prioridade, com pesos e cortes configuráveis por versão (`src/lib/scoring`, [metodologia](docs/03-metodologia/README.md)).
- Modelei o retorno em três cenários, como faixa de economia, investimento e payback, e tratei dado faltante com valor cauteloso, nunca zero (regra RN-08).
- Montei o roteiro de 30/60/90 dias a partir dos quadrantes e da capacidade em horas de implantação.
- Gerei o relatório em web e em PDF pelo Playwright, com a mesma página nos dois formatos ([ADR-003](docs/04-arquitetura/adr-003-geracao-de-pdf.md)).
- Guardei cada versão do diagnóstico como retrato completo e implementei a comparação entre versões ([ADR-004](docs/04-arquitetura/adr-004-versoes.md)).
- Criei o formulário do cliente por link com token, só de escrita e com validade de 14 dias ([ADR-005](docs/04-arquitetura/adr-005-link-do-cliente.md)).

## Competência → prova

| O que o projeto exercita | Onde está a prova |
|---|---|
| Definir critérios e pesos explícitos e conferíveis | [Metodologia](docs/03-metodologia/README.md) e [exemplos de cálculo](docs/03-metodologia/exemplos-de-calculo.md) (3 exemplos conferidos à mão) |
| Tratar dado faltante | Regra RN-08 em [regras de negócio](docs/02-definicao/regras-de-negocio.md) |
| Estimar retorno com faixa e premissas visíveis | [Print 06](docs/screenshots/06-premissas-e-faixa-de-retorno.png) e [PDF v2](docs/exemplo-de-relatorio/diagnostico-clinica-vida-plena-v2.pdf) |
| Transformar restrição da persona do cliente em escopo | [Reunião 3 · dono da clínica](docs/01-discovery/05-reuniao-dono-clinica.md), com tabela antes/depois (reunião simulada) |
| Recusar IA onde ela tira a explicabilidade | [ADR-001](docs/04-arquitetura/adr-001-pontuacao-deterministica.md) e [reunião de validação](docs/04-arquitetura/reuniao-validacao.md) |
| Produzir o entregável de consultoria | [Exemplo de relatório](docs/exemplo-de-relatorio/README.md) e [print 12](docs/screenshots/12-proposta-v1-1.png) |
| Versionar o diagnóstico e comparar versões | [ADR-004](docs/04-arquitetura/adr-004-versoes.md) e [print 09](docs/screenshots/09-comparacao-de-versoes.png) |

## Decisão difícil

| | [ADR-001 · Pontuação determinística em vez de IA](docs/04-arquitetura/adr-001-pontuacao-deterministica.md) |
|---|---|
| Contexto | A pontuação decide o que vale automatizar, e o dono da clínica deixou claro que dado de paciente não pode sair da máquina |
| Alternativas | IA avalia e pontua; híbrido (regras calculam, IA ajusta); regras determinísticas, com IA só redigindo texto opcional |
| Escolha | Regras determinísticas; a IA, se ligada, só redige o resumo a partir de números já calculados |
| Custo aceito | Menos flexibilidade: uma IA captaria nuances de descrição livre que a regra não vê |
| Quando mudaria | Com dados reais de projetos, para sugerir ajustes de peso, ou num módulo que sugere campos com o consultor confirmando |

Recusei o mesmo caminho quando o sócio pediu que a IA preenchesse campos e pontuasse sozinha: privacidade, explicabilidade e qualidade do dado ([recusa justificada](docs/04-arquitetura/reuniao-validacao.md#recusa-justificada)).

## Evidências

- **Testes:** 85 unitários e 11 de integração no Vitest e 15 E2E no Playwright passaram em 2026-10-24, commit `bd3169b`. Sem CI configurada; validação local ([logs](docs/05-qualidade/execucao-test-e2e-bd3169b.txt)).
- **Falha registrada:** no commit `1b09c61`, um E2E falhou por espera de rota fria; corrigi a causa e a suíte voltou a passar ([log da falha](docs/05-qualidade/execucao-test-e2e-1b09c61.txt)).
- **Cobertura:** 100% de linhas, ramos e funções em `src/lib/scoring`, medida em 2026-10-24; o restante não teve cobertura medida ([relatório de testes](docs/05-qualidade/relatorio-de-testes.md)).
- **Decisões e rastreio:** 5 ADRs em [arquitetura](docs/04-arquitetura/README.md) e 20 linhas de [rastreabilidade](docs/02-definicao/rastreabilidade.md) entre requisito, regra, código e teste.
- **Artefatos:** 14 [prints](docs/screenshots/README.md), 2 PDFs e a [prévia da primeira página do v2](docs/exemplo-de-relatorio/v2-pagina-1.png).

## Limites

- Empresa, pessoas e dados são fictícios; o retorno é estimativa com faixa e fórmula visível, não resultado medido.
- O resumo por IA é opcional, e a chamada real à API externa dele não foi testada com chave.
- Pesos e cortes não foram calibrados com dados reais ([15 limitações](docs/03-metodologia/limitacoes.md)).
- A coluna de horas fica cortada no print mobile do roteiro ([print](docs/screenshots/10-versao-mobile-roteiro.png)).

## Evolução prevista

- Editar pesos e cortes pela tela, com validação da soma.
- Tabelas legíveis no celular e limite de tentativas de login.
- Ciclo de calibração com projetos reais ([roadmap](docs/06-pos-lancamento/roadmap.md)).

## Licença

[MIT](LICENSE). O código roda localmente; instruções em [CONTRIBUTING.md](CONTRIBUTING.md).
