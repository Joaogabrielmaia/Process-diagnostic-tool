# Mapa

**Diagnóstico de processos para consultorias de automação: pontuação determinística e explicável, faixa de retorno em vez de número único, roteiro 30/60/90 e relatório em PDF.**

## Em 30 segundos

- **Problema:** uma consultoria pequena chega à primeira reunião com um cliente que descreve incômodos, não processos, e a priorização vira opinião.
- **Solução:** o Mapa conduz a conversa, pontua cada processo com critérios escritos e entrega ranking, matriz e relatório.
- **Prova:** registro da v1.1.0 com 96 testes no Vitest e 12 E2E, e 100% de cobertura em `src/lib/scoring`. Reexecução de 2026-10-24: 96 no Vitest passaram e 11 de 12 E2E passaram, com 1 falha registrada ([logs](docs/05-qualidade/README.md)).
- **Comece por aqui:** [relatório de exemplo (PDF)](docs/exemplo-de-relatorio/diagnostico-clinica-vida-plena-v2.pdf) · [matriz esforço × retorno](docs/screenshots/05-matriz-esforco-retorno.png) · [recusa de IA pontuando](docs/04-arquitetura/reuniao-validacao.md)

## Ficha técnica

| Campo | Valor |
|---|---|
| Natureza | Caso fictício; empresa, pessoas e dados inventados |
| Cenário | Consultoria Atalho Automação; cliente Clínica Vida Plena |
| Discovery | Reuniões simuladas, marcadas nas atas |
| Pontuação | Determinística, sem IA; resumo por IA é opcional e não foi testado com chave real |
| Stack | Next.js, TypeScript, Prisma, PostgreSQL, Zod, Vitest, Playwright |
| Testes | Números com data e commit em [Evidências](#evidências) |
| Execução | Local; a aplicação não está hospedada |

| Matriz esforço × retorno | Relatório web |
|---|---|
| [![Matriz com 14 processos em quatro quadrantes](docs/screenshots/05-matriz-esforco-retorno.png)](docs/screenshots/05-matriz-esforco-retorno.png) | [![Relatório web com oito seções](docs/screenshots/07-relatorio-web.png)](docs/screenshots/07-relatorio-web.png) |
| **Premissas e faixa de retorno** | **Proposta (v1.1)** |
| [![Premissas e faixa de retorno](docs/screenshots/06-premissas-e-faixa-de-retorno.png)](docs/screenshots/06-premissas-e-faixa-de-retorno.png) | [![Proposta com escopo e investimento](docs/screenshots/12-proposta-v1-1.png)](docs/screenshots/12-proposta-v1-1.png) |

![Sequência de capturas do app: login, cadastro de um processo, ranking, matriz e relatório](docs/screenshots/demo-diagnostico.gif)

*Sequência de 10 capturas do app rodando, em cerca de 22 s: login, cadastro de um processo, ranking, matriz, premissas e relatório. Não é gravação contínua.*

| | |
|---|---|
| [![Primeira página do PDF de exemplo](docs/exemplo-de-relatorio/v2-pagina-1.png)](docs/exemplo-de-relatorio/diagnostico-clinica-vida-plena-v2.pdf) | **[Abrir o relatório de exemplo (PDF)](docs/exemplo-de-relatorio/diagnostico-clinica-vida-plena-v2.pdf)**<br>Seis páginas geradas pelo app. Detalhes e a versão anterior em [exemplo de relatório](docs/exemplo-de-relatorio/README.md). |

## Duas entradas

**Pelo lado do negócio:** [Ep. 1 Discovery](docs/01-discovery/README.md) (como o problema foi levantado), [Ep. 2 Definição](docs/02-definicao/README.md) (o que foi pedido e o que ficou de fora), [Ep. 6 Pós-lançamento](docs/06-pos-lancamento/README.md) (balanço e próximos passos) e o [entregável](docs/exemplo-de-relatorio/README.md).

**Pelo lado técnico:** [Ep. 3 Metodologia](docs/03-metodologia/README.md) (as contas), [Ep. 4 Arquitetura](docs/04-arquitetura/README.md) (decisões e modos de falha) e [Ep. 5 Qualidade](docs/05-qualidade/README.md) (testes e falhas registradas).

Termos técnicos estão no [glossário](docs/GLOSSARIO.md).

## O problema

Hoje a Atalho Automação, consultoria fictícia de quatro pessoas, faz o diagnóstico numa conversa solta, com anotações em caderno e prioridade pela experiência do consultor ([AS-IS](docs/01-discovery/06-processo-as-is.md)). O cliente, a Clínica Vida Plena, conta o que incomoda, e falta um critério escrito para transformar isso em ordem de prioridade e em estimativa de retorno que ele consiga conferir.

## O que faz

1. Conduz um roteiro de perguntas por área e registra cada processo do cliente.
2. Pontua cada processo com sete critérios e pesos escritos, sem IA, e monta o ranking.
3. Desenha a matriz esforço × retorno e o roteiro de 30/60/90 dias.
4. Estima economia e investimento em três cenários, com a conta à vista e dado faltante tratado com valor cauteloso.
5. Gera o relatório em web e PDF, compara versões e, na v1.1, monta um modelo de proposta.

## O que este projeto mostra

- Critérios, pesos e fórmulas explícitos, com [contas conferidas à mão](docs/03-metodologia/exemplos-de-calculo.md).
- Faixa de retorno em vez de número único, com as premissas visíveis na tela e no relatório.
- Recusa documentada de deixar IA pontuar, com contexto, alternativas e custo aceito.

| O que o projeto exercita | Onde está a prova |
|---|---|
| Definir critérios e pesos explícitos e conferíveis | [Metodologia](docs/03-metodologia/README.md) e [exemplos de cálculo](docs/03-metodologia/exemplos-de-calculo.md) (3 exemplos) |
| Tratar dado faltante | Regra RN-08 em [regras de negócio](docs/02-definicao/regras-de-negocio.md) |
| Estimar retorno com faixa e premissas visíveis | [Print 06](docs/screenshots/06-premissas-e-faixa-de-retorno.png), [relatório PDF](docs/exemplo-de-relatorio/diagnostico-clinica-vida-plena-v2.pdf) e hipóteses H-1 a H-4 em [riscos](docs/02-definicao/riscos.md) |
| Transformar restrição da persona do cliente em escopo | [Reunião 3 · dono da clínica](docs/01-discovery/05-reuniao-dono-clinica.md) (tabela antes/depois; reunião simulada) |
| Recusar IA onde ela tira a explicabilidade | [ADR-001](docs/04-arquitetura/adr-001-pontuacao-deterministica.md) e [reunião de validação](docs/04-arquitetura/reuniao-validacao.md) |
| Produzir o entregável de consultoria (relatório, PDF, proposta) | [Exemplo de relatório](docs/exemplo-de-relatorio/README.md) e [print 12](docs/screenshots/12-proposta-v1-1.png) |
| Versionar o diagnóstico e comparar versões | [ADR-004](docs/04-arquitetura/adr-004-versoes.md) e [print 09](docs/screenshots/09-comparacao-de-versoes.png) |

## Episódios

| Ep. | Página | O que há |
|---|---|---|
| 0 | [Sobre este caso](docs/00-sobre-este-caso/README.md) | Cenário fictício; real × simulado |
| 1 | [Discovery](docs/01-discovery/README.md) | Brainstorm, três reuniões simuladas, AS-IS/TO-BE |
| 2 | [Definição](docs/02-definicao/README.md) | 17 RF, 7 RNF, 12 RN, 14 US, riscos, backlog |
| 3 | [Metodologia](docs/03-metodologia/README.md) | Critérios, fórmulas, sensibilidade, 15 limitações |
| 4 | [Arquitetura](docs/04-arquitetura/README.md) | 5 ADRs, modelo de dados, 13 modos de falha |
| 5 | [Qualidade](docs/05-qualidade/README.md) | Testes, aceitação, reviews, logs |
| 6 | [Pós-lançamento](docs/06-pos-lancamento/README.md) | Retrospectiva, PR da v1.1, roadmap |

Guia da série com trilhas de 2, 10 e 30 minutos: [docs/INDEX.md](docs/INDEX.md). Galeria: [14 prints](docs/screenshots/README.md).

## Decisões que contam

| | [ADR-001 · Pontuação determinística em vez de IA](docs/04-arquitetura/adr-001-pontuacao-deterministica.md) |
|---|---|
| Contexto | O Mapa decide o que vale automatizar, e o dono da clínica deixou claro que dado de paciente não pode sair da máquina |
| Alternativas | IA avalia e pontua; híbrido (regras calculam, IA ajusta); regras determinísticas, com IA só redigindo texto opcional |
| Escolha | Regras determinísticas; a IA, se ligada, só redige o resumo a partir de números já calculados |
| Custo aceito | Menos flexibilidade: uma IA captaria nuances de descrição livre que a regra não vê |
| Quando mudaria | Com dados reais de projetos, para sugerir ajustes de peso, ou num módulo que sugere campos com o consultor confirmando |

A mesma linha aparece na [recusa justificada](docs/04-arquitetura/reuniao-validacao.md#recusa-justificada): o pedido de deixar a IA preencher campos e pontuar foi recusado por privacidade, explicabilidade e qualidade do dado. Outras decisões: [ADR-005](docs/04-arquitetura/adr-005-link-do-cliente.md) (link do cliente só de escrita, válido por 14 dias) e as demais no [Ep. 4](docs/04-arquitetura/README.md).

## Evidências

| O que | Resultado | Fonte |
|---|---|---|
| v1.1.0, registro do relatório de testes | 96 testes no Vitest e 12 E2E, todos passaram | [relatório de testes](docs/05-qualidade/relatorio-de-testes.md) |
| Reexecução, 2026-10-24, commit 1b09c61 | Vitest: 85 unitários e 11 de integração passaram. E2E: 14 de 15 passaram; falhou `flow.spec.ts:116` | [unitários](docs/05-qualidade/execucao-test-1b09c61.txt) · [integração](docs/05-qualidade/execucao-test-integration-1b09c61.txt) · [E2E](docs/05-qualidade/execucao-test-e2e-1b09c61.txt) |
| Cobertura de `src/lib/scoring` (medida na v1.0.0) | 100% de linhas, ramos e funções; o restante não teve cobertura medida | [relatório de testes](docs/05-qualidade/relatorio-de-testes.md#cobertura-medida-v100) |
| Falhas registradas | 4 no caminho da v1.0.0, mais a falha E2E da reexecução | [relatório de testes](docs/05-qualidade/relatorio-de-testes.md) |

## Rodar localmente

Requisitos: Node 20+, Docker e Git. A aplicação não está hospedada; o código e a documentação estão neste repositório.

```bash
git clone https://github.com/Joaogabrielmaia/Process-diagnostic-tool.git
cd Process-diagnostic-tool
npm install
npx playwright install chromium     # usado pelo PDF e pelos testes E2E
cp .env.example .env                # valores de desenvolvimento local
npm run db:up                       # PostgreSQL em Docker (porta 5433)
npm run db:push                     # cria as tabelas
npm run db:seed                     # cria a Clínica Vida Plena (2 versões, 14 processos)
npm run dev                         # http://localhost:3000
```

Entre com `marcos@atalho.example` e a senha de `SEED_CONSULTANT_PASSWORD` no `.env` (padrão do `.env.example`, só para uso local).

```bash
npm run typecheck && npm run lint
npm test                    # unitários
npm run test:coverage       # cobertura de src/lib/scoring
npm run test:integration    # usa o banco mapa_test
npm run test:e2e            # com o app rodando
npm run screenshots         # regenera os prints (rode antes: npm run demo:clean)
npm run report:pdf          # regenera o PDF de exemplo
npm run sensitivity         # tabelas de sensibilidade
```

`npm run db:reset` usa `--force-reset` e apaga o banco: use só em banco de desenvolvimento. O resumo por IA é opcional; sem chave, o `MockProvider` é usado (`SUMMARY_PROVIDER=anthropic` e `ANTHROPIC_API_KEY` no `.env` ligam a chamada real, não testada).

## Do protótipo à produção

O que falta para sair do estudo:

- A chamada real à API da Anthropic para o resumo opcional não foi testada ([relatório de testes](docs/05-qualidade/relatorio-de-testes.md#o-que-não-foi-testado)).
- Os dados são fictícios; o retorno é estimativa com faixa, não resultado medido ([metodologia](docs/03-metodologia/README.md)).
- A aplicação não está hospedada ([como rodar](#rodar-localmente)).
- A coluna de horas fica cortada no celular ([print](docs/screenshots/10-versao-mobile-roteiro.png) e [roadmap](docs/06-pos-lancamento/roadmap.md)).
- Pesos e cortes não foram calibrados; veja as [15 limitações](docs/03-metodologia/limitacoes.md).

## Limites

- Empresa, pessoas e dados são fictícios; as reuniões são simuladas.
- Retorno e economia são estimativas com fórmula visível e faixa de incerteza.
- Não houve chamada real à API da Anthropic.
- Sem hospedagem.

## Licença

[MIT](LICENSE).
