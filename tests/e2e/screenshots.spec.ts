import { test, type Page } from "@playwright/test";
import path from "node:path";
import { login, openSeededDiagnosis } from "./helpers";

/**
 * Gera os prints de docs/screenshots/ a partir do app rodando de verdade, com o seed da Clínica Vida Plena.
 * Uso: npm run demo:clean && npm run screenshots
 */
const OUT = path.resolve(__dirname, "../../docs/screenshots");

async function shot(page: Page, file: string, opts: { fullPage?: boolean } = {}) {
  // esconde o indicador do modo dev do Next, que não faz parte do produto
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: path.join(OUT, file), fullPage: opts.fullPage ?? true });
}

test.describe("prints da documentação", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("desktop", async ({ page }) => {
    await page.goto("/login");
    await shot(page, "00-login.png", { fullPage: false });

    await login(page);
    await shot(page, "01-lista-diagnosticos.png");

    await openSeededDiagnosis(page);
    await shot(page, "02-roteiro-por-area.png");

    await page.locator("details").first().locator("summary").click();
    await page.getByRole("link", { name: "Editar Confirmação de consultas por WhatsApp" }).click();
    await page.waitForURL("**/processos/**");
    await shot(page, "03-cadastro-de-processo.png");

    await page.goto(page.url().replace(/\/processos\/.*/, "/ranking"));
    await page.locator("details summary").first().click();
    await shot(page, "04-ranking.png");

    await page.getByRole("link", { name: "Matriz" }).click();
    await page.waitForURL("**/matriz*");
    await shot(page, "05-matriz-esforco-retorno.png");

    await page.getByRole("link", { name: "Premissas e retorno" }).click();
    await page.waitForURL("**/premissas*");
    await shot(page, "06-premissas-e-faixa-de-retorno.png");

    await page.getByRole("link", { name: "Relatório" }).click();
    await page.waitForURL("**/relatorio*");
    await shot(page, "07-relatorio-web.png");

    await page.getByRole("link", { name: "Versões" }).click();
    await page.waitForURL("**/versoes*");
    await shot(page, "09-comparacao-de-versoes.png");

    await page.getByRole("link", { name: "Formulário do cliente" }).click();
    await page.waitForURL("**/cliente*");
    await shot(page, "11-link-do-cliente-consultor.png");

    await page.getByRole("link", { name: "Proposta" }).click();
    await page.waitForURL("**/proposta*");
    await shot(page, "12-proposta-v1-1.png");

  });

  test("formulário do cliente (sem login)", async ({ page }) => {
    await login(page);
    await openSeededDiagnosis(page);
    await page.getByRole("link", { name: "Formulário do cliente" }).click();
    await page.waitForURL("**/cliente*");
    const link = (await page.getByText(/^\/cliente\//).first().innerText()).trim();
    await page.context().clearCookies();
    await page.goto(link);
    await page.getByLabel("Qual é a tarefa?").fill("Reenviar lembrete de retorno aos pacientes");
    await page.getByLabel("Quanto tempo leva cada vez? (minutos)").fill("25");
    await page.getByLabel(/Que ferramentas/).fill("WhatsApp (celular), Excel");
    await shot(page, "08-formulario-do-cliente.png");
  });
});

test.describe("versão mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

  test("mobile", async ({ page }) => {
    await login(page);
    await openSeededDiagnosis(page);
    await shot(page, "10-versao-mobile-roteiro.png", { fullPage: false });
    await page.getByRole("link", { name: "Matriz" }).click();
    await page.waitForURL("**/matriz*");
    await shot(page, "10-versao-mobile-matriz.png", { fullPage: false });
  });
});
