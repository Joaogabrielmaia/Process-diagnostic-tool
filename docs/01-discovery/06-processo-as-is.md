# 06 · Processo atual (AS-IS) do diagnóstico

Como a Atalho faz hoje, segundo as reuniões simuladas ([negócio](02-negocio-atalho.md)):

```mermaid
flowchart TD
    A[Primeiro contato com o cliente] --> B[Conversa solta de ~1 hora]
    B --> C[Anotações em caderno ou bloco de notas]
    C --> D[Consultor monta planilha com processos]
    D --> E{Faltou dado?}
    E -- sim --> F[Chute ou campo em branco esquecido]
    E -- não --> G[Estimativa de horas]
    F --> G
    G --> H[Prioridade por 'experiência' do consultor]
    H --> I[Proposta no Word, copiada da anterior]
    I --> J[Faixa de investimento por intuição]
    J --> K[Envio ao cliente]
    K --> L{Cliente pergunta: por que esse primeiro?}
    L -- sim --> M[Resposta sem critério escrito]
```

**Pontos de dor:** B (falta de roteiro), F (dado faltante invisível), H (critério implícito), J (faixa sem base), M (sem explicação).

## TO-BE com o Mapa

```mermaid
flowchart TD
    A[Cliente responde formulário curto antes] --> B[Reunião guiada por área]
    B --> C[Cadastro dos processos, campos opcionais]
    C --> D[Motor pontua: potencial e esforço]
    D --> E[Ranking e matriz]
    E --> F[Consultor ajusta premissas na frente do cliente]
    F --> G[Relatório web e PDF]
    G --> H[Nova versão após validação]
    H --> I[Comparação entre versões]
```

Cada ponto de dor tem resposta: roteiro (B), completude visível (F), critérios e pesos documentados (H), faixa calculada com premissas (J), nota por critério no ranking (M).
