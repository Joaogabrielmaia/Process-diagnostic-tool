# O que a ferramenta não sabe

Uma ferramenta de decisão é tão útil quanto é honesta sobre seus limites. Esta lista também aparece no relatório (seção 8).

## Limites dos dados

1. **Tempo informado é tempo estimado.** O cliente responde de memória; a ferramenta não mede. Pessoas tendem a errar o tempo, para mais ou para menos.
2. **Dado faltante vira valor cauteloso**, não verdade. A faixa se alarga, mas o valor usado ainda é um palpite conservador.
3. **A taxa de erro é percebida**, não medida, e satura em 25%.

## Limites do modelo

4. **Pesos e cortes são julgamento meu**, não calibrados com projetos reais. Podem errar sistematicamente para certos tipos de processo.
5. **A redução de 40/60/80% é a mesma para todos os processos.** Na realidade, a automação de uma confirmação por mensagem tende a reduzir muito mais do que a de um faturamento com dependência externa. O modelo usa o esforço para estimar custo, mas não a redução.
6. **Esforço é estimativa por regra** (digitalização, integração, risco). Só uma análise técnica do processo confirma o tamanho do trabalho.
7. **Não há custo recorrente** (licenças, hospedagem, manutenção) no investimento, nem custo de mudar a rotina da equipe.
8. **Horas liberadas não viram dinheiro automaticamente.** O cálculo multiplica horas por custo da hora, assumindo que o tempo liberado é reaproveitado. Se a clínica não atender mais pacientes nem cortar horas extras, a economia contábil pode ser zero.

## O que fica de fora

9. **Ganhos indiretos** (menos faltas de pacientes, maior satisfação, menos retrabalho de terceiros) são hipóteses e não entram no cálculo.
10. **Receita**: o Mapa não estima aumento de vendas.
11. **Dependências entre processos** (automatizar A só faz sentido depois de B) não são modeladas; o roteiro 30/60/90 ordena por prioridade, não por dependência técnica.
12. **Sazonalidade** (meses de pico) não é considerada: as frequências são médias.

## Limites do estudo

13. **Tudo é fictício e simulado**: a Atalho, a Vida Plena, as reuniões e os números. Os resultados mostram que a ferramenta funciona e é coerente, **não** que ela acerta previsões no mundo real.
14. **A integração com IA** (Anthropic) foi escrita, mas **não foi testada contra a API real** (sem chave neste estudo). O caminho testado é o `MockProvider` e o fallback quando o provedor falha.
15. **Não houve teste de usabilidade com pessoas reais** nem auditoria automatizada de acessibilidade.

## Como o consultor deve usar isso

O Mapa **organiza a conversa e expõe o critério**. A decisão final, e a responsabilidade pelo número que vai para a proposta, continuam sendo do consultor.
