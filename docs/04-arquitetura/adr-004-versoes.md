# ADR-004 · Versões do diagnóstico como retratos completos

**Status:** aceita.

## Contexto
A Camila quer mostrar "o que mudou entre a primeira conversa e a versão final" ([reunião 2](../01-discovery/04-reuniao-analista.md)). Hoje a planilha é sobrescrita.

## Alternativas
1. **Sem versões:** editar sempre o mesmo diagnóstico.
2. **Log de alterações** (event sourcing): registrar cada mudança de campo.
3. **Retrato completo por versão:** cada versão guarda suas próprias premissas, configuração e **cópias** dos processos.

## Escolha
A opção 3. `DiagnosisVersion` guarda premissas, configuração e seus `Process`. Criar uma versão **copia tudo** da última. Só a mais recente é editável; as anteriores são somente leitura. Cada processo tem uma `key` (UUID) que **atravessa as versões**, e a comparação usa essa chave.

## Motivo
- **Simples e à prova de erro:** reproduzir uma versão antiga é só ler; não há como "reconstruir" errado.
- **O relatório antigo fica idêntico**, mesmo que premissas ou o motor mudem depois: premissas e configuração ficam na versão.
- A `key` estável torna a comparação correta mesmo se o processo for renomeado (há teste de integração para isso).

## Trade-off
Duplicação de dados (cada versão copia os processos) e nenhuma noção de "quem mudou o quê". Para dezenas de processos, o custo é irrelevante. Perco o histórico fino de campo a campo.

## Quando eu mudaria de ideia
Com muitos consultores editando o mesmo diagnóstico, eu precisaria de auditoria por campo e autor, e adotaria um log de eventos além dos retratos.

## Regras associadas
RN-11 (só a mais recente é editável). A API server-side recusa edição de versão antiga mesmo que alguém forje o formulário (`ownLatestVersion`).
