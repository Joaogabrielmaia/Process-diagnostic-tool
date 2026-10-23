# Requisitos

Origem de cada requisito nas reuniões: **[M]** [sócio](../01-discovery/03-reuniao-socio.md) · **[C]** [analista](../01-discovery/04-reuniao-analista.md) · **[R]** [dono da clínica](../01-discovery/05-reuniao-dono-clinica.md).

## Requisitos funcionais

| ID | Requisito | Origem | Prioridade |
|---|---|---|---|
| RF-01 | Criar diagnóstico com cliente, setor e número de pessoas | M | Must |
| RF-02 | Roteiro de discovery por área (comercial, atendimento, financeiro, operação, RH) com perguntas-chave e o porquê de cada uma | M, C | Must |
| RF-03 | Cadastrar, editar e excluir processo com: frequência, volume, tempo, pessoas, ferramentas, padronização, taxa de erro, digitalização, dependências e dados sensíveis | C | Must |
| RF-04 | Aceitar campo em branco como dado faltante, sinalizar a lacuna e nunca tratar como zero | M, C | Must |
| RF-05 | Pontuar cada processo em potencial e esforço, com critérios e pesos configuráveis | C | Must |
| RF-06 | Ranking de oportunidades com a nota de cada critério visível | C | Must |
| RF-07 | Matriz esforço × retorno com quatro quadrantes | M | Must |
| RF-08 | Calcular retorno com entradas visíveis (horas/mês × custo da hora × redução) em três cenários e estimar investimento e payback | M | Must |
| RF-09 | Editar premissas e recalcular na hora | M | Must |
| RF-10 | Relatório web: resumo executivo, ranking, matriz, 30/60/90, riscos e pré-escopo | M, R | Must |
| RF-11 | Exportar o relatório em PDF | M | Must |
| RF-12 | Histórico de versões do diagnóstico e comparação entre versões | C | Should |
| RF-13 | Autenticação por e-mail e senha (papel Consultor) | — | Must |
| RF-14 | Formulário curto para o cliente responder antes da reunião, por link | M, R | Should |
| RF-15 | Resumo executivo opcional por IA atrás de uma interface com `MockProvider` | R | Could |
| RF-16 | Seed com o diagnóstico completo da Clínica Vida Plena | — | Must |
| RF-17 | (v1.1) Gerar modelo de proposta a partir do diagnóstico | M | Could |

## Requisitos não funcionais

| ID | Requisito | Como verifico |
|---|---|---|
| RNF-01 | A pontuação é determinística, pura (sem I/O) e não depende de IA | Testes unitários; módulo `src/lib/scoring` não importa banco nem rede |
| RNF-02 | Interface em português do Brasil, usável em 390 px de largura sem rolagem horizontal da página | Teste E2E de layout mobile |
| RNF-03 | Senhas com hash (bcrypt), sessão em cookie httpOnly assinado, link do cliente com expiração e isolamento entre consultores | Testes de integração e E2E |
| RNF-04 | Tudo roda localmente com Docker Compose; nenhum segredo no repositório | `.env.example` e `.gitignore`; revisão manual |
| RNF-05 | Relatório web e PDF nunca divergem | O PDF é renderizado a partir da própria página de impressão ([ADR-003](../04-arquitetura/adr-003-geracao-de-pdf.md)) |
| RNF-06 | Acessibilidade básica: campos com rótulo, foco visível, contraste legível, gráfico com texto alternativo | Revisão manual; seletores por rótulo nos testes E2E |
| RNF-07 | Código tipado (TypeScript estrito) e lint sem avisos | `tsc --noEmit` e `eslint --max-warnings 0` |

RNF-06 é verificado só em parte: não rodei auditoria automatizada de acessibilidade (ex.: axe). Está no [roadmap](../06-pos-lancamento/roadmap.md).

## Fora do escopo

Assinatura de proposta, CRM, cobrança, multiempresa e geração automática de automações. Motivo: o Mapa serve ao **diagnóstico**; esses itens pertencem a outros produtos e diluiriam o foco.
