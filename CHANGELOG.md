# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/); versões seguem [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado
- Relatório do ciclo de vida em `docs/ciclo-de-vida/` (nove páginas, reuniões, sprints e diagramas) e README ampliado.
- Testes unitários de volume (500 processos sintéticos) e de configuração de sessão (`tests/unit/robustness.test.ts`), cobrindo F-11 e F-13.
- Script `npm run test:coverage` (cobertura de `src/lib/scoring`), o comando que o relatório de testes já citava.

### Corrigido
- E2E: o teste de comparação de versões falhava na primeira visita a uma rota fria do servidor de desenvolvimento (compilação sob demanda acima dos 5 s de espera). O limite de `expect` passou a 15 s e o teste espera a navegação.
- PDF: a tabela do ranking saía cortada à direita na página 1 porque `min-width` e `overflow-x-auto` da tela valiam também na impressão. O CSS de impressão agora zera os dois. Os PDFs de exemplo foram gerados de novo; os números não mudaram.
- E2E: porta do app e do Playwright lida de `PORT` (padrão 3000).

## [1.1.0]

### Adicionado
- **Modelo de proposta a partir do diagnóstico** (RF-17): aba "Proposta" com escopo, cronograma 30/60/90, faixa de investimento, retorno estimado, premissas, exclusões e lista do que o consultor deve preencher antes de enviar. Download em Markdown.
- O escopo da proposta é exatamente o que coube no roteiro de 90 dias; o que ficou de fora vira "fase seguinte" e não entra no valor.
- 7 testes unitários da proposta, 2 testes E2E (página e download; download exige login) e o print `12-proposta-v1-1.png`.

### Corrigido
- Testes de integração: `hookTimeout` de 90 s no projeto de integração (o `prisma db push` do `beforeAll` estourava os 10 s padrão quando rodava junto dos unitários).
- `coverage/` fora do lint e do git.

### Observações
- Nenhuma regra de pontuação mudou: a proposta só lê o que o motor já calcula.
- Os totais da proposta cobrem só o escopo agendado em 90 dias; por isso diferem dos totais do relatório (que somam tudo fora de "evitar").

## [1.0.0]

### Adicionado
- Motor de pontuação determinístico (7 critérios, potencial, esforço, quadrantes, ranking), retorno em 3 cenários, investimento, payback e roteiro 30/60/90.
- Roteiro de discovery por área, cadastro de processo com campos opcionais e dado faltante tratado de forma cautelosa.
- Matriz esforço × retorno, premissas editáveis, relatório web e PDF (Playwright), versões e comparação.
- Autenticação por e-mail e senha, formulário curto do cliente por link com expiração.
- Resumo por IA atrás de interface, com `MockProvider` e fallback.
- Seed da Clínica Vida Plena, prints e PDF de exemplo.
