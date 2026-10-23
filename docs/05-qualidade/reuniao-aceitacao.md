# Reunião de aceitação

> Simulação: o Claude interpretou o cliente nesta conversa.

**Participantes:** Marcos Ribeiro, Camila Duarte e eu. Percorremos as [histórias](../02-definicao/historias.md) contra o que **rodou de verdade** (resultados em [relatório de testes](relatorio-de-testes.md)). Os vereditos abaixo refletem as execuções reais, não opinião.

| US | Critério | Evidência real | Veredito |
|---|---|---|---|
| US-01 | Cria diagnóstico com versão 1 | Integração + E2E passaram | Aceita |
| US-02 | 5 áreas com 3 perguntas e o porquê | Print [02](../screenshots/02-roteiro-por-area.png); sem teste automatizado do texto | Aceita, com ressalva: sem teste automatizado do conteúdo |
| US-03 | Campo vazio vira faltante; fora da faixa recusado | Integração + E2E | Aceita |
| US-04 | Ranking com notas por critério | Print [04](../screenshots/04-ranking.png); 55 testes de pontuação | Aceita |
| US-05 | Matriz com 4 quadrantes e texto alternativo | Print [05](../screenshots/05-matriz-esforco-retorno.png); E2E confere o gráfico por nome acessível | Aceita |
| US-06 | Premissas recalculam; ordem inválida recusada | E2E (dobrou o custo da hora e a economia mudou; recusou redução inválida) | Aceita |
| US-07 | Relatório com 8 seções | E2E confere os 8 títulos | Aceita |
| US-08 | PDF válido, exige login | E2E: `%PDF-`, `application/pdf`, 401 sem login | Aceita. **Ressalva:** o erro do Chromium não foi forçado em teste |
| US-09 | Versões imutáveis e comparação | Integração + E2E (v1 só leitura) | Aceita |
| US-10 | Login e rota protegida | Integração + E2E | Aceita |
| US-11 | Link só escreve; expira | Integração + E2E | Aceita |
| US-12 | Resumo por IA com fallback | Unit (mock e fallback). **API real da Anthropic não testada** | **Aceita só no caminho mock** |
| US-13 | Seed da Vida Plena | Executado e usado nos prints e E2E | Aceita |

## Pontos levantados na reunião

- **Camila:** "Quero poder editar os pesos pela tela." → Já registrado como adiado (ADR-002, roadmap).
- **Marcos:** "No celular a tabela do roteiro corta a coluna de horas." → Concordo; é limitação registrada na review da sprint 3.
- **Camila:** "O relatório está honesto, mas o payback de 15 meses assusta." → Mantenho. É o que os dados fictícios indicam, e mostrar o resultado honesto é parte da proposta de valor do Mapa. Os próprios números de entrada são editáveis.

## Resultado

**Aceito**, com três ressalvas abertas: resumo por IA só validado no caminho mock, modos de falha do PDF e do banco não forçados em teste, e legibilidade das tabelas no celular.
