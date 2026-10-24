# Episódio 4 — Arquitetura

Cinco decisões de arquitetura registradas (ADR), com a primeira delas recusando IA para pontuar: explicabilidade e privacidade pesaram mais que conveniência.
O modelo de dados guarda cada versão como retrato completo; resultados são calculados na leitura, não gravados.
A reunião de validação simulada produziu sete pedidos tratados e uma recusa justificada; os modos de falha F-1 a F-13 listam o que pode dar errado.

| Documento | O que contém | Itens |
|---|---|---|
| [ADR-001](adr-001-pontuacao-deterministica.md) · [002](adr-002-criterios-configuraveis.md) · [003](adr-003-geracao-de-pdf.md) · [004](adr-004-versoes.md) · [005](adr-005-link-do-cliente.md) | Pontuação determinística, critérios configuráveis, PDF, versões, link do cliente | 5 ADRs |
| [Modelo ER e camadas](modelo-er.md) | Tabelas, relações e camadas do código | 1 diagrama ER |
| [Sequência do relatório](sequencia-relatorio.md) | Do pedido ao PDF | 1 diagrama |
| [Modos de falha](modos-de-falha.md) | Falhas previstas, efeito e tratamento | 13 modos |
| [Wireframes](wireframes.md) | Telas em ASCII | 6 telas |
| [Reunião de validação](reuniao-validacao.md) | Pedidos e a recusa de IA pontuando (reunião simulada) | 7 pedidos · 1 recusa |

[← Anterior](../03-metodologia/README.md) · [Índice](../INDEX.md) · [Próximo →](../05-qualidade/README.md)
