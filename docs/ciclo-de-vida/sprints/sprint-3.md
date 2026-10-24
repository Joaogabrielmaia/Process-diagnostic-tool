# Sprint 3 · Relatório, versões e cliente

[← Índice do ciclo de vida](../README.md) · [← Sprint 2](sprint-2.md) · [Sprint 4 →](sprint-4.md)

Período acadêmico: 05/10 a 16/10/2026. Os commits abaixo têm as datas reais registradas em [desenvolvimento e configuração](../06-desenvolvimento-e-configuracao.md).

## Objetivo
Relatório web e PDF, versões, formulário do cliente e evidências.

## Escopo
US-07, US-08, US-09, US-11 e US-12. Requisitos RF-10, RF-11, RF-12, RF-14, RF-15 e RNF-05.

## Entregáveis
- Relatório web com 8 seções (RF-10)
- PDF por Playwright a partir da página de impressão (RF-11, RNF-05)
- Versões, cópia e comparação (RF-12)
- Formulário do cliente por link (RF-14)
- Resumo opcional com `MockProvider` e fallback (RF-15)
- 10 testes E2E, 13 prints e 2 PDFs de exemplo (`1b90766`, `4c47ddc`, `fe5d7d7`)

## Critério de conclusão
Relatório e PDF coerentes entre si; E2E do fluxo completo; prints conferidos abrindo os arquivos. Vale também a [Definition of Done](../02-planejamento-e-scrum.md#definition-of-done).

## Planejamento
Meta: entregável de consultoria e acesso do cliente. Restrição vinda da reunião 3: o link só escreve e nada de dado de paciente.

## Review
E2E: 10 de 10 na última execução da época, depois de 3 falhas de seletor. PDF de 6 páginas conferido pelo teste (`application/pdf`, cabeçalho `%PDF-`). Fonte: [sprint 3 review](../../05-qualidade/sprint-3-review.md).

## Retrospectiva
Dois prints mostravam a tela errada com os testes passando, e só a abertura dos arquivos revelou. O E2E sujava o banco de desenvolvimento, e surgiu o `demo:clean`. Limitação conhecida: tabelas pouco legíveis no celular.
