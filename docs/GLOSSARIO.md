# Glossário

Termos usados no projeto, com uma linha de definição e o lugar onde aparecem. Voltar ao [índice](INDEX.md).

| Termo | Definição | Onde aparece |
|---|---|---|
| ADR | Registro de decisão de arquitetura: contexto, alternativas, escolha e custo aceito. | [ADR-001](04-arquitetura/adr-001-pontuacao-deterministica.md) |
| AS-IS / TO-BE | Como o trabalho é feito hoje (AS-IS) e como passa a ser feito com a ferramenta (TO-BE). | [Processo atual](01-discovery/06-processo-as-is.md) |
| Dado faltante | Campo que o cliente não soube informar; entra com valor cauteloso, nunca zero, e reduz a completude. | [Metodologia](03-metodologia/README.md#dado-faltante-rn-08) |
| Discovery | Fase de conversa e levantamento em que o consultor entende o negócio e os processos do cliente. | [Episódio 1](01-discovery/README.md) |
| Faixa de retorno | Economia e investimento mostrados em três cenários (conservador, realista, otimista), em vez de um número único. | [Premissas](screenshots/06-premissas-e-faixa-de-retorno.png) |
| LGPD | Lei Geral de Proteção de Dados, que regula o tratamento de dado pessoal no Brasil. | [Riscos do relatório](02-definicao/regras-de-negocio.md) |
| Link do cliente por token | Endereço com código aleatório, válido por 14 dias, que só permite ao cliente acrescentar processos. | [ADR-005](04-arquitetura/adr-005-link-do-cliente.md) |
| Matriz esforço × retorno | Gráfico que coloca cada processo pelo esforço de automatizar (horizontal) e pelo potencial de retorno (vertical). | [Print 05](screenshots/05-matriz-esforco-retorno.png) |
| Payback | Meses para a economia mensal cobrir o investimento: investimento ÷ economia mensal. | [Metodologia](03-metodologia/README.md#de-onde-vêm-os-paybacks) |
| Pontuação determinística | Cálculo por regras escritas: a mesma entrada dá sempre a mesma nota, sem IA. | [ADR-001](04-arquitetura/adr-001-pontuacao-deterministica.md) |
| Quadrante | Uma das quatro regiões da matriz: Começar já, Planejar, Oportunista, Evitar. | [Metodologia](03-metodologia/README.md) |
| Roteiro 30/60/90 | Ordem de implantação em janelas de 30 dias, limitada pela capacidade em horas. | [Metodologia](03-metodologia/README.md) |
| Análise de sensibilidade | Teste do que muda no resultado quando uma premissa muda. | [Sensibilidade](03-metodologia/sensibilidade.md) |
| Versão como retrato (snapshot) | Cada versão do diagnóstico guarda uma cópia completa dos dados; as anteriores não mudam. | [ADR-004](04-arquitetura/adr-004-versoes.md) |
