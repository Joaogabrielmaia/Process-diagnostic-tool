# PR: feat(proposta): modelo de proposta a partir do diagnóstico (v1.1.0)

Branch: `feat/proposta` → `main` · Requisito: **RF-17** · História: **US-14**

> A aplicação não está hospedada; o código e a documentação estão neste repositório. Não houve PR aberto em plataforma: a descrição fica neste arquivo, e a integração foi feita localmente com `git merge --no-ff`.

## O que muda
Adiciona a aba **Proposta**, que transforma o diagnóstico em um modelo de proposta comercial, e um endpoint de download em Markdown.

## Por quê
Na [retrospectiva](retrospectiva-reuniao.md), o sócio-consultor apontou que, depois do relatório, ainda redigia a proposta no Word copiando números à mão. É retrabalho e fonte de erro.

## Decisões
- **Escopo = roteiro agendado.** Só o que coube nos 90 dias entra no valor. *Alternativa:* incluir todos os fora de "evitar". *Motivo:* o valor da proposta deve corresponder ao que o consultor consegue entregar na capacidade informada. *Trade-off:* itens bons que não couberam ficam como "fase seguinte". *Mudaria se:* o cliente quisesse ver o valor total do programa.
- **Campos "a preencher".** Pagamento, validade, responsáveis e cláusulas de LGPD **não são inventados**. O texto lista o que o consultor precisa completar. *Motivo:* são decisões comerciais e jurídicas dele.
- **Markdown, não Word/PDF.** *Motivo:* edita-se em qualquer lugar e cola-se no modelo do consultor. *Trade-off:* sem formatação final. *Mudaria se:* houvesse pedido recorrente de .docx.
- **Função pura** (`buildProposal`) sobre o que o motor já calcula; **nenhuma regra de pontuação mudou**.

## Testes (execução real)
- Unitários: `proposal.test.ts` (7). Total de unitários agora: 85.
- E2E: `proposta.spec.ts` (2). Última execução conjunta com `flow.spec.ts`: 12 de 12 passaram.
- Integração: 11 de 11.
- `tsc` e `eslint --max-warnings 0`: sem erros.

## Prints
`docs/screenshots/12-proposta-v1-1.png`

## Atenção: números diferentes do relatório
O payback da proposta (9,1 meses no seed) é menor que o do relatório (15,3). Não é erro: a proposta soma só os 3 processos que couberam nos 90 dias (os de maior prioridade), e o relatório soma todos fora de "evitar". Deixei a diferença explícita na tela ("fase seguinte, fora do valor"). Risco de leitura: alguém comparar os dois sem ler o escopo.

## Riscos
- O texto traz números como estimativa; o aviso consta no topo e o Markdown evita termos como "garantimos" ou "reduziu" (testado).
- A data da proposta usa a data do dia da geração.

## Checklist
- [x] Testes novos passando
- [x] Sem segredos nem links de hospedagem
- [x] CHANGELOG atualizado
- [x] Não altera pontuação
