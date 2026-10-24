# 06 · Desenvolvimento e configuração

[← Índice do ciclo de vida](README.md) · Anterior: [05 · Modelo de dados](05-modelo-de-dados.md) · Próximo: [07 · Testes e qualidade](07-testes-e-qualidade.md)

Esta página usa só o que o histórico Git mostra. As datas abaixo são as reais dos commits e das tags; elas não seguem o cronograma acadêmico das sprints.

## Estratégia de branches e integração

| Item | Prática observada |
|---|---|
| Branch principal | `main` |
| Branches de trabalho | `feat/proposta` (v1.1, integrada com merge), `docs/apresentacao` e `docs/readme-venda` (PRs #1 e #2, mesclados e removidos) |
| Integração | Merge com commit de merge; sem rebase nem force push |
| Revisão | PRs #1 e #2 com descrição do que muda, correções e exceções; sem revisor externo registrado |

## Convenção de commits e versionamento

Commits em Conventional Commits, citando IDs de requisito e regra (por exemplo `feat(scoring): ... (RF-05..RF-08, RN-01..RN-09)`). Versionamento semântico, com tags `v1.0.0` e `v1.1.0` e [CHANGELOG](../../CHANGELOG.md) por versão. As releases do GitHub repetem as notas do CHANGELOG.

## Histórico de mudanças relevantes

| Commit | Data | Mudança | Sprint |
|---|---|---|---|
| `4bb1719` | 2026-10-23 | Estrutura inicial, Docker Compose, configuração de testes | 1 |
| `d827b84` | 2026-10-23 | Motor de pontuação, retorno e roteiro 30/60/90 | 1 |
| `4e89286` | 2026-10-23 | Modelo Prisma, autenticação, versões e link do cliente | 1 e 2 |
| `1b90766` | 2026-10-23 | Telas do consultor, relatório web e PDF, formulário do cliente | 2 e 3 |
| `4c47ddc` | 2026-10-23 | Testes E2E, prints e scripts de PDF | 3 |
| `fe5d7d7` | 2026-10-23 | Prints reais e PDF de exemplo | 3 |
| `50f744b` | 2026-10-23 | Documentos de discovery, definição, metodologia, arquitetura e qualidade | transversal |
| `6e1651a` | 2026-10-23 | Modelo de proposta (RF-17) | 4 |
| `35782dd` | 2026-10-23 | Merge de `feat/proposta` (v1.1.0) | 4 |
| `201c55f` | 2026-10-24 | Correção da espera de rota fria no E2E e porta por `PORT` | evolução |
| `2224fc0` | 2026-10-24 | Correção das tabelas do PDF na impressão | evolução |
| `bd3169b` | 2026-10-24 | Script `test:coverage` | evolução |
| `1f4473f` | 2026-10-24 | Testes de volume e de configuração de sessão | evolução |

Os commits de um mesmo dia refletem como o repositório foi publicado, e não o ritmo do cronograma acadêmico.

## Organização modular

| Pasta | Conteúdo |
|---|---|
| `src/lib/scoring` | Pontuação pura, sem I/O |
| `src/lib/services` | Casos de uso sobre o banco |
| `src/app` | Telas, ações e rotas (`/imprimir`, API de PDF, link do cliente) |
| `src/components` | Matriz, relatório e selos |
| `prisma` | Schema e seed |
| `tests` | Unitários, integração e E2E (inclui o gerador de prints) |
| `scripts` | Sensibilidade, PDF de exemplo e limpeza da demo |

## CI/CD e automações

Não há workflow de CI (`.github/workflows` não existe) e a API do GitHub registra 0 execuções. A verificação é local: `tsc`, `eslint`, Vitest e Playwright, com os registros em [docs/05-qualidade](../05-qualidade/README.md). Não há pipeline de entrega nem deploy.

## Ambientes, configuração e segredos

| Item | Situação |
|---|---|
| Ambiente | Local, PostgreSQL em Docker Compose |
| Configuração | `.env` ignorado pelo Git; `.env.example` traz valores de desenvolvimento local |
| Segredos | Nenhuma chave de API nem chave privada no histórico (varredura de 2026-10-24). As credenciais de banco do `.env.example` e do setup de integração são locais |
| Sessão | `SESSION_SECRET` com no mínimo 32 caracteres; sem ele a assinatura falha com erro explícito (teste unitário) |
| Dependências | `package.json` e `package-lock.json`; sem automação de atualização |

## Dívida técnica

| Item | Impacto | Tratamento |
|---|---|---|
| Sem CI | Regressão só aparece se alguém rodar os testes | Planejado: workflow que roda lint, tipos e testes |
| Sem migrations (`db push`) | Mudança de schema não tem histórico | Adotar migrations antes de qualquer ambiente compartilhado |
| Pesos editáveis só no código | Ajuste exige mexer em `config.ts` ou no JSON da versão | Roadmap v1.2 |
| Tabelas no celular | Coluna de horas fora da tela | Roadmap v1.3 |
| Cobertura medida só no módulo de pontuação | O resto não tem número | Ampliar `test:coverage` |

## Compatibilidade entre versões

A v1.1.0 só acrescenta a aba Proposta (RF-17) e não altera regra de pontuação. Entre as tags, `prisma/` e `src/lib/scoring` não têm diferenças (conferido com `git diff v1.0.0 v1.1.0`), então os dados da v1.0.0 continuam válidos.
