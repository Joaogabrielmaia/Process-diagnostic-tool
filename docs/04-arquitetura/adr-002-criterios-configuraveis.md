# ADR-002 · Critérios e premissas configuráveis

**Status:** aceita, com implementação parcial (premissas editáveis pela tela; pesos pelo código).

## Contexto
Os pesos são julgamento meu e [não foram calibrados](../03-metodologia/README.md). Cada consultoria e cada setor pode discordar. A Camila pediu rastreabilidade do que mudou entre versões.

## Alternativas
1. **Valores fixos no código**, sem configuração.
2. **Tudo configurável pela interface**, incluindo pesos e cortes.
3. **Configuração como dado** (um objeto tipado guardado por versão), com premissas editáveis pela tela e pesos editáveis pelo código/seed neste MVP.

## Escolha
A opção 3. `ScoringConfig` (pesos, cortes, catálogo de ferramentas) e `Premises` (custo da hora, reduções, hora do consultor, capacidade) são objetos tipados, **guardados em JSON em cada versão do diagnóstico**. A tela edita as premissas; `validateConfig` garante que pesos somem 1.

## Motivo
- Guardar por versão permite reproduzir um relatório antigo exatamente como foi gerado.
- Premissas são o que o consultor ajusta na frente do cliente; pesos são decisão de método, mudada com menos frequência e com mais cuidado.
- A função de pontuação recebe a configuração como argumento, então testar um peso diferente é trivial (há teste para isso).

## Trade-off
Editar pesos pela tela exige validação e uma explicação de uso; deixei fora do MVP. Quem quiser trocar pesos edita `src/lib/scoring/config.ts` ou o JSON da versão. Isso é uma limitação assumida.

## Quando eu mudaria de ideia
Se mais de um consultor precisasse de métodos diferentes, eu criaria "perfis de metodologia" selecionáveis por diagnóstico, com tela de edição e validação visual da soma dos pesos.
