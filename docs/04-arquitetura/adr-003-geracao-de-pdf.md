# ADR-003 · Geração do PDF com Playwright (Chromium)

**Status:** aceita.

## Contexto
O relatório precisa sair em PDF fiel à versão web (RNF-05), com gráfico (a matriz), tabelas que quebram bem entre páginas e acentuação correta. Tudo roda local.

## Alternativas
| Opção | Prós | Contras |
|---|---|---|
| **react-pdf** | Biblioteca leve, sem navegador | Reescreve o layout num segundo sistema (componentes próprios); o gráfico SVG e as tabelas precisam ser refeitos; duas fontes da verdade |
| **Playwright / Chromium** | O PDF é a própria página; CSS de impressão; SVG nativo | Exige Chromium instalado; mais pesado; lento (segundos) |
| Imprimir pelo navegador (manual) | Zero código | Depende do usuário; sem padronização |

## Escolha
**Playwright.** A rota `/imprimir/[id]` renderiza o mesmo `ReportView` da tela, sem menus; o servidor abre essa rota no Chromium, com o cookie de sessão do consultor, e chama `page.pdf` em A4 com rodapé numerado.

## Motivo
- **Uma só fonte da verdade:** web e PDF não divergem (RNF-05). Com react-pdf eu manteria dois layouts e eles divergiriam.
- **Já preciso do Playwright** para E2E e prints; não adiciona ferramenta nova.
- O gráfico da matriz é SVG; entra no PDF sem trabalho extra.

## Trade-off
Dependência de um navegador no ambiente e geração mais lenta. Mitigações: modo de falha documentado ([modos de falha](modos-de-falha.md)): se o PDF falhar, a API responde 502 com mensagem clara, o relatório web segue disponível e o usuário pode imprimir pelo navegador. O PDF de exemplo no repositório tem 6 páginas e cerca de 120 KB.

## Quando eu mudaria de ideia
Se o Mapa fosse hospedado e gerasse muitos PDFs por minuto, um Chromium por requisição não escalaria: eu moveria para um serviço dedicado de renderização ou para react-pdf. Como o uso é local e pontual, o trade-off compensa.
