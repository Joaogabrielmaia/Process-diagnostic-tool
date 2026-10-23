# Roadmap

Ordem por valor e por dependência. Nada aqui está feito; o que está feito consta no [CHANGELOG](../../CHANGELOG.md).

| Versão | Item | Por quê | Depende de |
|---|---|---|---|
| **v1.2** | Editar **pesos e cortes pela tela**, com validação visual da soma e um aviso de que mudar peso muda o ranking | Pedido da analista; hoje exige mexer no código ([ADR-002](../04-arquitetura/adr-002-criterios-configuraveis.md)) | — |
| v1.2 | **Sensibilidade de pesos** na análise (hoje só variei custo, redução, hora do consultor e corte de potencial) | Lacuna declarada em [sensibilidade](../03-metodologia/sensibilidade.md) | — |
| v1.2 | Aviso na tela quando cenários **colapsam** (redução realista = conservadora) | Achado da sensibilidade | — |
| v1.3 | **Tabelas legíveis no celular** (cartões em vez de tabela horizontal) | Limitação da [review da sprint 3](../05-qualidade/sprint-3-review.md) | — |
| v1.3 | **Limite de tentativas de login** e de envios por link do cliente | Falhas não tratadas em [modos de falha](../04-arquitetura/modos-de-falha.md) | — |
| v1.3 | **Auditoria de acessibilidade automatizada** (axe) nos testes E2E | RNF-06 verificado só em parte | — |
| v1.4 | **Testar os caminhos de erro**: falha do Chromium, queda do banco, recusa do servidor a versão antiga | Lacunas listadas no [relatório de testes](../05-qualidade/relatorio-de-testes.md) | — |
| v2.0 | **Ciclo de calibração**: registrar, depois de projetos reais, horas estimadas × realizadas e sugerir ajustes de premissas | A maior fraqueza do método: pesos sem calibração | **Projetos reais** |
| v2.0 | Redução esperada **por tipo de processo**, em vez de uma única por cenário | Limitação nº 5 de [limitações](../03-metodologia/limitacoes.md) | Calibração |
| ideia | Assistente que **sugere** campos a partir de descrição livre, com o consultor confirmando e sem dados de pacientes | Pedido recusado na [validação](../04-arquitetura/reuniao-validacao.md), reconsiderável nessas condições | Decisão de privacidade |
| ideia | Perfis de metodologia por consultoria | Só faz sentido com mais de um consultor | Uso por mais de uma equipe |

## O que continua fora do escopo
Assinatura de proposta, CRM, cobrança, multiempresa e geração automática de automações.
