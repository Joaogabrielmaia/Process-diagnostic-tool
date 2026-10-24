# Sprint 3 · Relatório, versões e cliente: review

**Meta:** relatório web e PDF, versões, formulário do cliente e evidências (prints, PDF).

## Entregue

| Item | Requisitos |
|---|---|
| Relatório web com 8 seções | RF-10 |
| PDF por Playwright a partir da página de impressão | RF-11, RNF-05 |
| Versões, cópia e comparação | RF-12 |
| Formulário do cliente por link | RF-14 |
| Resumo por IA com `MockProvider` e fallback | RF-15 |
| 10 testes E2E, 13 prints (v1.0), 2 PDFs de exemplo | — |

Commits: `test(e2e): ...` e `docs(evidencias): ...`.

## Resultado real

- E2E: **10 de 10** passaram na última execução (a primeira teve 3 falhas, abaixo).
- PDF gerado de verdade: 6 páginas, cerca de 120 KB; o E2E confere `application/pdf`, cabeçalho `%PDF-` e tamanho acima de 15 KB.

## O que deu errado

1. **3 falhas no primeiro E2E.** Eram do **teste**, não do app: o anunciador de rotas do Next também usa `role="alert"`, então o seletor encontrava dois elementos. Troquei por `p[role=alert]`.
2. **Prints errados.** Olhando a imagem, vi que os prints "05 matriz" e "10 mobile matriz" mostravam o **roteiro**: o script tirava o print antes de a navegação do Next terminar. Só percebi porque **abri os arquivos**; o teste passava. Corrigi esperando a URL mudar (`waitForURL`) e regenerei todos.
3. **Selo quebrando em duas linhas** ("Começar / já") nas tabelas. Adicionei `whitespace-nowrap`.
4. **Sujeira do E2E no banco de desenvolvimento.** Os testes criam diagnósticos; criei `npm run demo:clean` para limpar antes de gerar prints.

## Limitação conhecida
No celular (390 px), as tabelas do roteiro rolam **dentro do cartão**, e a coluna "Horas/mês" fica fora da tela sem rolar. A página não tem rolagem horizontal (testado), mas a legibilidade das tabelas no celular é só aceitável. Está no [roadmap](../06-pos-lancamento/roadmap.md).
