# Modos de falha

O que acontece quando algo dá errado, e o que o sistema faz. Marquei **como foi verificado**.

| # | Falha | Comportamento | Verificado |
|---|---|---|---|
| F-1 | Chromium não instalado ou falha ao renderizar o PDF | A API responde **502** com mensagem em português ("O relatório web segue disponível; tente de novo ou use Imprimir > Salvar como PDF") e registra o erro no log | Caminho de sucesso testado (E2E). **O caminho de erro não foi forçado em teste**; o código existe e foi revisado |
| F-2 | Provedor de IA indisponível, sem chave ou erro HTTP | `generateSummarySafely` cai no `MockProvider`; o relatório sai normalmente | Teste unitário com provedor que lança erro |
| F-3 | Resposta vazia da API de IA | Lança erro → cai no mock | Coberto por F-2 (mesmo caminho) |
| F-4 | Banco fora do ar | Next devolve erro 500; nada é gravado parcialmente nas operações compostas (usam `$transaction` quando gravam mais de uma tabela) | `$transaction` revisado; **queda do banco não foi simulada** |
| F-5 | Campo numérico fora da faixa (ex.: padronização 9) | A validação do servidor recusa e volta ao formulário com alerta; o limite do navegador não é a defesa | E2E remove o limite do navegador e confirma a recusa |
| F-6 | Premissas inconsistentes (conservador > realista) | Recusadas com mensagem | E2E |
| F-7 | Editar versão antiga (formulário forjado) | O servidor lança erro; a tela de versões antigas nem mostra os botões | Interface testada em E2E; **a recusa do servidor não tem teste automatizado dedicado** |
| F-8 | Link do cliente expirado ou inexistente | Página neutra "link inválido ou expirado"; nada é gravado | Integração e E2E |
| F-9 | Consultor acessa diagnóstico de outro | Retorna "não encontrado" (404) | Integração |
| F-10 | Sessão ausente, adulterada ou expirada | Redireciona ao login; PDF responde 401 | Integração (adulteração) e E2E |
| F-11 | `SESSION_SECRET` ausente | Erro explícito de configuração ao assinar a sessão | Revisão do código; não testado |
| F-12 | Diagnóstico sem processos | Telas mostram estado vazio; resumo e totais zerados sem erro | Teste unitário (`summarize([])`); relatório vazio não foi aberto em teste visual |
| F-13 | Muitos processos em uma tela | Não testado de forma sistemática; o Mapa é pensado para dezenas de processos | Lacuna conhecida |

Falhas **não tratadas**, por escolha: limitação de tentativas de login (força bruta) e limite de envios do link do cliente. Estão no [roadmap](../06-pos-lancamento/roadmap.md).
