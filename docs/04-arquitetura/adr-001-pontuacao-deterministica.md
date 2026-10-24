# ADR-001 · Pontuação determinística em vez de IA

**Status:** aceita.

## Contexto
O coração do Mapa decide o que vale automatizar. Seria tentador pedir a um modelo de linguagem para "avaliar" cada processo. O dono da clínica também deixou claro que dado de paciente não pode sair da máquina ([reunião 3](../01-discovery/05-reuniao-dono-clinica.md)).

## Alternativas
1. **IA avalia e pontua** cada processo a partir da descrição.
2. **Híbrido:** regras calculam, IA ajusta a nota.
3. **Regras determinísticas** para toda a pontuação; IA só redige texto (opcional).

## Escolha
A opção 3. A pontuação é uma função pura (`src/lib/scoring`), sem I/O. A IA, se ligada, **só redige o resumo executivo** a partir de números já calculados, atrás de uma interface `SummaryProvider` com um `MockProvider` padrão.

## Motivo
- **Explicabilidade:** o cliente pergunta "por que esse primeiro?". Com regras, respondo mostrando a nota de cada critério. Com IA, eu responderia "o modelo achou".
- **Reprodutibilidade:** mesma entrada, mesma saída; permite testes unitários com valor exato (74 testes de pontuação e portfólio, na sprint 1).
- **Privacidade:** a IA nunca recebe descrição de processos de pacientes; só números agregados.
- **Custo e disponibilidade:** o produto funciona sem chave, sem rede e sem custo por uso.

## Trade-off
Perco flexibilidade: uma IA captaria nuances de uma descrição livre que uma regra não vê. Aceito, porque o ganho de confiança e de explicabilidade vale mais num instrumento de consultoria.

## Quando eu mudaria de ideia
Se eu tivesse dados reais de projetos (processo → resultado), poderia treinar ou calibrar um modelo para **sugerir ajustes de peso**, mantendo as regras como base explicável. Também reconsideraria para um módulo "ler descrição livre e sugerir campos", sempre com o consultor confirmando.

## Consequências
- O resumo por IA é opcional; se falhar, `generateSummarySafely` cai no mock.
- O caminho real da API da Anthropic **não foi exercitado** (sem chave); está isolado atrás da interface.
