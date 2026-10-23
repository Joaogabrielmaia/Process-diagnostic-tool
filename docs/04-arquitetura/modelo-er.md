# Modelo de dados e arquitetura

Fonte: [`prisma/schema.prisma`](../../prisma/schema.prisma).

```mermaid
erDiagram
    User ||--o{ Diagnosis : "conduz"
    Diagnosis ||--|{ DiagnosisVersion : "tem versões"
    Diagnosis ||--o{ ClientInvite : "gera links"
    DiagnosisVersion ||--o{ Process : "contém"

    User {
        string id PK
        string email UK
        string name
        string passwordHash
        enum role "CONSULTOR"
    }
    Diagnosis {
        string id PK
        string clientName
        string sector
        int headcount
        string consultantId FK
    }
    DiagnosisVersion {
        string id PK
        string diagnosisId FK
        int number "único por diagnóstico"
        string label
        json premises
        json config
    }
    Process {
        string id PK
        string versionId FK
        string key "estável entre versões"
        string name
        enum area
        enum frequency
        int volumePerExecution "nulo = faltante"
        float minutesPerExecution "nulo = faltante"
        int people "nulo = faltante"
        string_array tools
        int standardization "nulo = faltante"
        float errorRatePct "nulo = faltante"
        int dataDigitization "nulo = faltante"
        int dependencies "nulo = faltante"
        enum sensitiveData "nulo = faltante"
        enum source "CONSULTOR ou CLIENTE"
        bool needsReview
    }
    ClientInvite {
        string id PK
        string diagnosisId FK
        string token UK
        datetime expiresAt
        datetime submittedAt
    }
```

## Decisões de modelagem

- **Nulo significa dado faltante** (RN-08). Nunca se grava 0 no lugar de "não sei"; a validação converte campo vazio em `null`.
- **Resultados não são gravados.** Potencial, esforço, ranking e retorno são **calculados** a cada leitura a partir dos dados e da configuração da versão. Alternativa seria gravar o resultado; descartei porque isso criaria duas fontes da verdade que poderiam divergir após uma correção no motor. Trade-off: recalcular a cada tela (barato para dezenas de processos). Mudaria se houvesse milhares de processos.
- **Premissas e configuração em JSON na versão**, para reproduzir relatórios antigos (ADR-002, ADR-004).
- **`Process.key`** liga o "mesmo" processo entre versões.

## Camadas

```mermaid
flowchart TB
    UI[Telas Next.js: server components e server actions] --> SVC[services/diagnoses.ts]
    UI --> REP[ReportView]
    SVC --> DB[(PostgreSQL via Prisma)]
    SVC --> SCORE[scoring: funções puras]
    REP --> SCORE
    REP --> SUM[summary: SummaryProvider]
    PDF[Rota /api/.../pdf] --> CHR[Chromium via Playwright] --> PRINT[/imprimir/id/]
    PRINT --> REP
```

A pontuação não conhece banco, rede nem Next.js: é a parte mais fácil de testar e a única que decide ranking e retorno.
