# Wireframes

Desenhados antes de codar, em ASCII, para discutir na [reunião de validação](reuniao-validacao.md). As telas finais estão nos [prints](../screenshots/).

## Lista de diagnósticos

```
+----------------------------------------------------------+
| Mapa                                      Marcos   [Sair] |
+----------------------------------------------------------+
| Diagnósticos                                             |
| +----------------------+  +----------------------+       |
| | Clínica Vida Plena   |  | (outros clientes)    |       |
| | Saúde · 18 pessoas   |  |                      |       |
| | 2 versões            |  |                      |       |
| +----------------------+  +----------------------+       |
| Novo diagnóstico: [cliente] [setor] [pessoas] [Criar]    |
+----------------------------------------------------------+
```

## Diagnóstico: roteiro por área

```
< Diagnósticos                               [v1] [v2]
Clínica Vida Plena · Saúde · 18 pessoas
[Roteiro] Ranking  Matriz  Premissas  Relatório  Versões  Cliente
+-- Atendimento (4) ------------------ [Adicionar processo] --+
| v Perguntas-chave desta área                               |
| Processo               Freq.   h/mês  Completude  [Editar] |
| Confirmação consultas  Diária  29,3   100%                  |
| Ficha de triagem       Diária  22     89% falta: ...        |
+-------------------------------------------------------------+
```

## Matriz e ranking

```
 Potencial
 100 +-----------+-----------+      Ranking
     | COMEÇAR   | PLANEJAR  |      1. Confirmação...   COMEÇAR JÁ
  50 |  (1)(3)   |  (2)(4)   |      2. Registro...      PLANEJAR
     +-----------+-----------+      (abra a linha: notas dos critérios)
     |OPORTUNISTA|  EVITAR   |
   0 +-----------+-----------+
     0          50          100 Esforço
```

## Premissas e faixa

```
Economia mensal: R$ 3.311 a R$ 6.622   Investimento: ...   Payback: 15,3 m
Premissas: [custo da hora] [redução cons./real./otim.] [hora do consultor] ...
[Salvar premissas]
```

## Relatório (web e PDF)

```
Capa: cliente, versão, data
1 Resumo executivo + 4 números
2 Ranking   3 Matriz   4 Retorno com a conta   5 Roteiro 30/60/90
6 Riscos    7 Pré-escopo e faixa   8 O que o relatório não sabe
```

## Formulário do cliente (6 campos)

```
Qual é a tarefa? [__________]
Área [v]  Frequência [v]  Minutos [__]  Pessoas [__]
Ferramentas [__________]   [Enviar]
(não informe dados de pacientes)
```
