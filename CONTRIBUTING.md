# Como rodar localmente

Requisitos: Node 20+, Docker e Git. A aplicação não tem deploy; o código e a documentação estão neste repositório.

```bash
git clone https://github.com/Joaogabrielmaia/Process-diagnostic-tool.git
cd Process-diagnostic-tool
npm install
npx playwright install chromium     # usado pelo PDF e pelos testes E2E
cp .env.example .env                # valores de desenvolvimento local
npm run db:up                       # PostgreSQL em Docker (porta 5433)
npm run db:push                     # cria as tabelas
npm run db:seed                     # cria a Clínica Vida Plena (2 versões, 14 processos)
npm run dev                         # http://localhost:3000
```

Entre com `marcos@atalho.example` e a senha de `SEED_CONSULTANT_PASSWORD` no `.env` (padrão do `.env.example`, só para uso local).

```bash
npm run typecheck && npm run lint
npm test                    # unitários
npm run test:coverage       # cobertura de src/lib/scoring
npm run test:integration    # usa o banco mapa_test
npm run test:e2e            # sobe o app; a porta vem de PORT (padrão 3000)
npm run screenshots         # regenera os prints (rode antes: npm run demo:clean)
npm run report:pdf          # regenera o PDF de exemplo
npm run sensitivity         # tabelas de sensibilidade (saída em docs/03-metodologia/.sensitivity-output.md)
```

`npm run db:reset` usa `--force-reset` e apaga o banco: use só em banco de desenvolvimento.

O resumo por IA é opcional. Sem chave, o `MockProvider` é usado; `SUMMARY_PROVIDER=anthropic` e `ANTHROPIC_API_KEY` no `.env` ligam a chamada real, que não foi testada.
