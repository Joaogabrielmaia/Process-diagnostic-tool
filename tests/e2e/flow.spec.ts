import { expect, test } from "@playwright/test";
import { CONSULTANT_EMAIL, createDiagnosis, login, openSeededDiagnosis } from "./helpers";

test.describe("acesso", () => {
  test("rotas internas exigem login", async ({ page }) => {
    await page.goto("/diagnosticos");
    await expect(page).toHaveURL(/\/login/);
  });

  test("senha errada mostra erro genérico", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill(CONSULTANT_EMAIL);
    await page.getByLabel("Senha").fill("senha-errada");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.locator("p[role=alert]")).toHaveText("E-mail ou senha incorretos.");
  });

  test("link do cliente com token inválido não revela nada", async ({ page }) => {
    await page.goto("/cliente/token-inexistente");
    await expect(page.getByRole("heading", { name: "Link inválido ou expirado" })).toBeVisible();
  });
});

test.describe("fluxo do consultor", () => {
  test("criar diagnóstico → processo → ranking → premissas → relatório → PDF", async ({ page }) => {
    await login(page);
    const name = `Oficina Teste ${Date.now()}`;
    const id = await createDiagnosis(page, name);

    // preencher processo
    await page.getByRole("link", { name: "Adicionar processo" }).first().click();
    await page.getByLabel("Nome do processo").fill("Envio de orçamentos por e-mail");
    await page.getByLabel("Área").selectOption("COMERCIAL");
    await page.getByLabel("Frequência").selectOption("DIARIA");
    await page.getByLabel("Itens por execução").fill("8");
    await page.getByLabel("Minutos por execução").fill("30");
    await page.getByLabel("Nº de pessoas").fill("2");
    await page.getByLabel(/Ferramentas/).fill("Excel, E-mail");
    await page.getByLabel(/Padronização/).fill("4");
    await page.getByLabel(/Digitalização/).fill("4");
    await page.getByRole("button", { name: "Salvar processo" }).click();
    await expect(page.getByText("Envio de orçamentos por e-mail")).toBeVisible();
    // erro e dependências ficaram em branco: dado faltante deve aparecer
    await expect(page.getByText(/falta:.*taxa de erro/)).toBeVisible();

    // ranking
    await page.getByRole("link", { name: "Ranking" }).click();
    await expect(page.getByText("Envio de orçamentos por e-mail")).toBeVisible();
    await expect(page.getByRole("table")).toContainText("Prioridade");

    // matriz
    await page.getByRole("link", { name: "Matriz" }).click();
    await expect(page.getByRole("img", { name: /Matriz esforço por retorno/ })).toBeVisible();

    // premissas: dobrar o custo da hora aumenta a economia
    await page.getByRole("link", { name: "Premissas e retorno" }).click();
    const kpi = page.getByText("Economia mensal (faixa)").locator("..");
    const before = await kpi.innerText();
    await page.getByLabel("Custo da hora do time (R$)").fill("84");
    await page.getByRole("button", { name: "Salvar premissas" }).click();
    await expect(page.getByRole("status")).toHaveText("Premissas salvas.");
    const after = await page.getByText("Economia mensal (faixa)").locator("..").innerText();
    expect(after).not.toEqual(before);

    // premissas inválidas são recusadas
    await page.getByLabel("Redução conservadora (%)").fill("90");
    await page.getByRole("button", { name: "Salvar premissas" }).click();
    await expect(page.locator("p[role=alert]")).toContainText("A redução deve crescer");

    // relatório
    await page.getByRole("link", { name: "Relatório" }).click();
    const report = page.getByTestId("report");
    for (const heading of [
      "1. Resumo executivo",
      "2. Ranking de oportunidades",
      "3. Matriz esforço × retorno",
      "4. Retorno estimado, com a conta à vista",
      "5. Roteiro de 30/60/90 dias",
      "6. Riscos",
      "7. Pré-escopo e faixa de investimento",
      "8. O que este relatório não sabe",
    ]) {
      await expect(report.getByRole("heading", { name: heading })).toBeVisible();
    }

    // PDF de verdade
    const res = await page.request.get(`/api/diagnosticos/${id}/pdf`);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("application/pdf");
    const body = await res.body();
    expect(body.subarray(0, 5).toString()).toBe("%PDF-");
    expect(body.length).toBeGreaterThan(15_000);
  });

  test("PDF exige login", async ({ request }) => {
    const res = await request.get("/api/diagnosticos/qualquer/pdf");
    expect(res.status()).toBe(401);
  });

  test("validação do formulário de processo: valor fora da faixa é recusado", async ({ page }) => {
    await login(page);
    await createDiagnosis(page, `Validação ${Date.now()}`);
    await page.getByRole("link", { name: "Adicionar processo" }).first().click();
    await page.getByLabel("Nome do processo").fill("Processo com erro");
    // contorna o limite do navegador para testar a validação do servidor
    await page.getByLabel(/Padronização/).evaluate((el: HTMLInputElement) => {
      el.removeAttribute("max");
      el.value = "9";
    });
    await page.getByRole("button", { name: "Salvar processo" }).click();
    await expect(page.locator("p[role=alert]")).toContainText("fora da faixa");
  });
});

test.describe("versões e cliente", () => {
  test("seed: v1 é retrato fechado e a comparação mostra o que mudou", async ({ page }) => {
    await login(page);
    await openSeededDiagnosis(page);
    await page.getByRole("link", { name: "v1", exact: true }).click();
    await expect(page.getByRole("status")).toContainText("não pode ser editada");
    await expect(page.getByRole("link", { name: "Adicionar processo" })).toHaveCount(0);

    await page.getByRole("link", { name: "Versões" }).click();
    await expect(page.getByRole("heading", { name: "Comparação entre versões" })).toBeVisible();
    await expect(page.getByText("Processos novos na v2")).toBeVisible();
    await expect(page.getByText("Admissão de colaboradores (documentos)")).toBeVisible();
  });

  test("formulário do cliente: resposta entra como 'revisar' na versão atual", async ({ page }) => {
    await login(page);
    await createDiagnosis(page, `Cliente Link ${Date.now()}`);
    await page.getByRole("link", { name: "Formulário do cliente" }).click();
    await page.getByRole("button", { name: "Gerar novo link" }).click();
    const path = (await page.getByText(/^\/cliente\//).first().innerText()).trim();

    await page.context().clearCookies();
    await page.goto(path);
    await page.getByLabel("Qual é a tarefa?").fill("Emitir recibos à mão");
    await page.getByLabel("Em qual área ela acontece?").selectOption("FINANCEIRO");
    await page.getByLabel("Quanto tempo leva cada vez? (minutos)").fill("20");
    await page.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByRole("status")).toContainText("Recebido");
    // o cliente não vê nada do diagnóstico
    await expect(page.getByText("Ranking")).toHaveCount(0);

    await login(page);
    await page.getByRole("link", { name: /Cliente Link/ }).first().click();
    await expect(page.getByText("Emitir recibos à mão")).toBeVisible();
    await expect(page.getByText("veio do cliente: revisar")).toBeVisible();
  });

  test("nova versão preserva a anterior", async ({ page }) => {
    await login(page);
    await createDiagnosis(page, `Versões ${Date.now()}`);
    await page.getByRole("link", { name: "Versões" }).click();
    await page.getByLabel("Motivo da nova versão").fill("Ajuste de teste");
    await page.getByRole("button", { name: /Criar versão 2/ }).click();
    await expect(page.getByText(/Versão 2: Ajuste de teste/)).toBeVisible();
  });
});

test("layout mobile não gera rolagem horizontal na página", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);
  await openSeededDiagnosis(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
