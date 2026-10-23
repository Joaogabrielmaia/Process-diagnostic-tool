# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/); versões seguem [SemVer](https://semver.org/lang/pt-BR/).

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
