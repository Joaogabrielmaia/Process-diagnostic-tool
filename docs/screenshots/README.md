# Galeria de prints

Os 14 prints foram gerados pelo app rodando com o seed da Clínica Vida Plena. A ordem segue o fluxo de uso. Cada legenda tem duas partes: o que se vê · por que importa.

![Sequência de capturas do fluxo: login, cadastro de um processo, ranking, matriz e relatório](demo-diagnostico.gif)

*Sequência de 10 capturas do app rodando (cerca de 22 s): login, abertura do diagnóstico, cadastro de um processo, ranking, matriz, premissas e relatório. Não é uma gravação contínua. O processo "Envio de orçamentos por e-mail" foi cadastrado só para a captura.*

| Tela | Legenda |
|---|---|
| ![Tela de login do Mapa com campos de e-mail e senha](00-login.png) | **00 · Login.** Cartão com o nome Mapa, campos de e-mail e senha e botão Entrar. · As rotas internas exigem login ([relatório de testes](../05-qualidade/relatorio-de-testes.md)). |
| ![Lista com o diagnóstico da Clínica Vida Plena e formulário de novo diagnóstico](01-lista-diagnosticos.png) | **01 · Lista de diagnósticos.** Um cartão da Clínica Vida Plena (2 versões) e o formulário de novo diagnóstico. · Cada diagnóstico guarda versões; a mais recente é a editável ([ADR-004](../04-arquitetura/adr-004-versoes.md)). |
| ![Roteiro por área com perguntas-chave abertas em Comercial e a lista de processos de cada área](02-roteiro-por-area.png) | **02 · Roteiro por área.** Áreas Comercial, Atendimento, Financeiro, Operação e RH, com as três perguntas-chave de Comercial abertas e os processos com horas por mês e completude. · Conduz a conversa de discovery ([perguntas-chave](../01-discovery/perguntas-chave.md)). |
| ![Formulário Editar processo com nome, área, frequência, itens, minutos, pessoas, ferramentas, padronização, digitalização, taxa de erro, dependências e dados sensíveis](03-cadastro-de-processo.png) | **03 · Cadastro de processo.** Formulário de "Confirmação de consultas por WhatsApp", com escala explicada nos campos de padronização e digitalização. · Campo em branco vira dado faltante ([RN-08](../02-definicao/regras-de-negocio.md)). |
| ![Tabela de ranking de 14 processos com o primeiro aberto mostrando as notas dos critérios](04-ranking.png) | **04 · Ranking.** Os 14 processos por prioridade, com o primeiro aberto: frequência 100, volume 80, repetitividade 75, impacto 53, digitalização 75, facilidade de integração 50 e risco 46. · A explicação vem da conta ([metodologia](../03-metodologia/README.md)). |
| ![Matriz esforço por retorno com 14 pontos numerados em quatro quadrantes e lista dos processos ao lado](05-matriz-esforco-retorno.png) | **05 · Matriz esforço × retorno.** Quatro quadrantes (Começar já, Planejar, Oportunista, Evitar) com pontos numerados e a lista de processos de cada um. · Pontos numerados porque nomes longos se sobrepõem ([reunião de validação](../04-arquitetura/reuniao-validacao.md)). |
| ![Três cartões com economia mensal, investimento e payback e o formulário de premissas](06-premissas-e-faixa-de-retorno.png) | **06 · Premissas e faixa de retorno.** Economia de R$ 3.311 a R$ 6.622, investimento de R$ 64.490 a R$ 106.218 e payback realista de 15,3 meses (de 9,7 a 32,1), com o formulário de premissas abaixo. · O retorno aparece como faixa e declara que é estimativa ([metodologia](../03-metodologia/README.md)). |
| ![Relatório web com resumo executivo, ranking, matriz, retorno, roteiro 30/60/90, riscos, pré-escopo e o que o relatório não sabe](07-relatorio-web.png) | **07 · Relatório web.** Oito seções, do resumo executivo a "O que este relatório não sabe", com botão Baixar PDF. · O PDF usa exatamente esta página ([ADR-003](../04-arquitetura/adr-003-geracao-de-pdf.md)). |
| ![Tela de comparação entre versões com histórico, nova versão e tabela de mudanças de prioridade e economia](09-comparacao-de-versoes.png) | **09 · Comparação de versões.** Histórico de duas versões e a comparação v1 → v2 (+21,1 h/mês, +R$ 280 de economia realista, 2 processos novos). · Cada versão é um retrato completo ([ADR-004](../04-arquitetura/adr-004-versoes.md)). |
| ![Página do consultor com explicação do formulário curto e a lista de links gerados](11-link-do-cliente-consultor.png) | **11 · Link do cliente (visão do consultor).** Explicação do formulário curto e um link gerado, válido por 14 dias, ainda sem resposta. · O link só acrescenta processos e não mostra dado existente ([ADR-005](../04-arquitetura/adr-005-link-do-cliente.md)). |
| ![Formulário curto do cliente com seis perguntas e aviso para não informar dados de pacientes](08-formulario-do-cliente.png) | **08 · Formulário do cliente.** Seis perguntas (tarefa, área, frequência, minutos, pessoas, ferramentas) e o aviso de não informar dados de pacientes. · É a única tela que o cliente vê ([ADR-005](../04-arquitetura/adr-005-link-do-cliente.md)). |
| ![Proposta de automação com escopo, investimento, premissas, exclusões e lista do que preencher](12-proposta-v1-1.png) | **12 · Proposta (v1.1).** Escopo de 3 processos, investimento de R$ 23.486 a R$ 38.682, payback de 9,1 meses e a lista "A preencher antes de enviar". · O escopo é o que coube nos 90 dias ([PR da v1.1](../06-pos-lancamento/pr-v1.1-proposta.md)). |
| ![Matriz esforço por retorno em tela de celular, com a legenda de cortes](10-versao-mobile-matriz.png) | **10 · Mobile, matriz.** Matriz e cartão "Começar já" em largura de 390 px, sem rolagem horizontal na página. · Teste E2E de layout mobile ([relatório de testes](../05-qualidade/relatorio-de-testes.md)). |
| ![Roteiro por área em tela de celular com a tabela de Comercial cortada na coluna de horas](10-versao-mobile-roteiro.png) | **10 · Mobile, roteiro.** A tabela de Comercial aparece cortada a partir da coluna "Hora". · É a limitação conhecida de tabelas no celular ([roadmap](../06-pos-lancamento/roadmap.md)). |

## Telas sem print

- Erro de validação do formulário e senha errada.
- Link do cliente inválido ou expirado.
- Estado vazio (diagnóstico sem processos).
- Página `/imprimir`, a base do PDF.
- Versão antiga em modo somente leitura.

Os arquivos 10-versao-mobile-matriz e 10-versao-mobile-roteiro compartilham o número 10.
