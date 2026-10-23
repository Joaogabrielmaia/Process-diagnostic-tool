import { expect, test } from "@playwright/test";
import { login, openSeededDiagnosis } from "./helpers";

test("v1.1: proposta é gerada a partir do diagnóstico e baixa em Markdown", async ({ page }) => {
  await login(page);
  await openSeededDiagnosis(page);
  await page.getByRole("link", { name: "Proposta" }).click();
  await page.waitForURL("**/proposta*");

  const proposal = page.getByTestId("proposal");
  await expect(proposal.getByRole("heading", { name: "Proposta de automação para Clínica Vida Plena" })).toBeVisible();
  await expect(proposal.getByRole("heading", { name: "1. Escopo" })).toBeVisible();
  await expect(proposal.getByText("Confirmação de consultas por WhatsApp")).toBeVisible();
  await expect(proposal.getByRole("heading", { name: "5. A preencher antes de enviar" })).toBeVisible();

  const href = await page.getByRole("link", { name: "Baixar em Markdown" }).getAttribute("href");
  const res = await page.request.get(href!);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("text/markdown");
  const md = await res.text();
  expect(md).toContain("# Proposta de automação para Clínica Vida Plena");
  expect(md).toContain("R$");
});

test("v1.1: download da proposta exige login", async ({ request }) => {
  const res = await request.get("/api/diagnosticos/qualquer/proposta");
  expect(res.status()).toBe(401);
});
