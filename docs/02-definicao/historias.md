# Histórias de usuário, critérios de aceite e MoSCoW

Personas: **Consultor** (Marcos) e **Analista** (Camila) usam o sistema; **Cliente** (Ricardo) só usa o formulário curto.

| ID | História | Critérios de aceite | RF | MoSCoW |
|---|---|---|---|---|
| US-01 | Como consultor, quero criar um diagnóstico para registrar um novo cliente | Informo nome, setor e pessoas; o diagnóstico nasce com a versão 1 e premissas padrão; nome com menos de 3 letras é recusado | RF-01 | Must |
| US-02 | Como consultor, quero um roteiro por área para conduzir a conversa sem esquecer perguntas | Vejo as 5 áreas; cada uma mostra 3 perguntas com o "por quê"; posso adicionar processo em cada área | RF-02 | Must |
| US-03 | Como consultor, quero cadastrar um processo mesmo sem todos os dados | Só nome, área e frequência são obrigatórios; campo vazio vira "dado faltante"; vejo "falta: …" e a completude; valor fora da faixa é recusado | RF-03, RF-04 | Must |
| US-04 | Como analista, quero ver o ranking com a nota de cada critério para entender a ordem | Ranking ordenado por prioridade; abrir uma linha mostra as 7 notas, horas de implantação e completude | RF-05, RF-06 | Must |
| US-05 | Como consultor, quero a matriz esforço × retorno para explicar visualmente | Gráfico com 4 quadrantes e pontos numerados na ordem do ranking; lista por quadrante; texto alternativo no gráfico | RF-07 | Must |
| US-06 | Como consultor, quero mudar premissas e ver a faixa de retorno reagir | Altero custo da hora, reduções e capacidade; ao salvar, economia, investimento e payback são recalculados; reduções fora de ordem são recusadas com mensagem | RF-08, RF-09 | Must |
| US-07 | Como consultor, quero um relatório pronto para virar proposta | Seções: resumo, ranking, matriz, retorno com a conta à vista, 30/60/90, riscos, pré-escopo e limitações | RF-10 | Must |
| US-08 | Como consultor, quero baixar o relatório em PDF | O download é um PDF válido com o mesmo conteúdo da tela; exige login; se a geração falhar, a mensagem orienta uma alternativa | RF-11 | Must |
| US-09 | Como analista, quero comparar versões para mostrar o que mudou | Crio nova versão copiando a atual; as anteriores ficam só leitura; a comparação mostra processos novos, removidos, mudança de quadrante/prioridade e diferença dos totais | RF-12 | Should |
| US-10 | Como consultor, quero entrar com e-mail e senha | Rotas internas redirecionam ao login; senha errada dá mensagem genérica; sessão expira | RF-13 | Must |
| US-11 | Como cliente, quero responder um formulário curto antes da reunião | Link com token e validade de 14 dias; só acrescenta processo; não vejo nada do diagnóstico; link inválido não revela informação | RF-14 | Should |
| US-12 | Como consultor, quero um resumo executivo redigido | Texto gerado a partir dos números; sem chave de IA, usa o `MockProvider`; se a IA falhar, o relatório cai no mock | RF-15 | Could |
| US-13 | Como visitante do repositório, quero um diagnóstico completo de exemplo | `npm run db:seed` cria a Clínica Vida Plena com 2 versões e 14 processos | RF-16 | Must |
| US-14 | Como consultor, quero um modelo de proposta a partir do diagnóstico | (v1.1) Página de proposta com escopo, cronograma, investimento em faixa, premissas e exclusões; download em Markdown | RF-17 | Could |

## MoSCoW resumido

- **Must:** US-01 a US-08, US-10, US-13
- **Should:** US-09, US-11
- **Could:** US-12, US-14
- **Won't (agora):** assinatura de proposta, CRM, cobrança, multiempresa, geração automática de automações

**Por que US-09 e US-11 são *Should* e não *Must*:** o MVP funciona sem eles (dá para diagnosticar e emitir relatório), mas a consultora precisa de rastreabilidade e o sócio de rapidez; sem os dois, o produto resolve só metade das dores das reuniões. Eu os trouxe para dentro do escopo, em vez de cortar, mas eram os primeiros candidatos a corte se o tempo apertasse (veja a ordem de corte em [backlog](backlog-sprints.md)).
