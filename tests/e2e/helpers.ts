import { expect, type Page } from "@playwright/test";
import "dotenv/config";

export const CONSULTANT_EMAIL = "marcos@atalho.example";
export const CONSULTANT_PASSWORD = process.env.SEED_CONSULTANT_PASSWORD ?? "";

export async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(CONSULTANT_EMAIL);
  await page.getByLabel("Senha").fill(CONSULTANT_PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Diagnósticos" })).toBeVisible();
}

export async function openSeededDiagnosis(page: Page) {
  await page.getByRole("link", { name: /Clínica Vida Plena/ }).first().click();
  await expect(page.getByRole("heading", { name: "Clínica Vida Plena" })).toBeVisible();
}

/** Cria um diagnóstico novo e vazio e devolve o id (para testes que alteram dados sem sujar o seed). */
export async function createDiagnosis(page: Page, name: string) {
  await page.goto("/diagnosticos");
  await page.getByLabel("Nome do cliente").fill(name);
  await page.getByLabel("Setor").fill("Serviços");
  await page.getByLabel("Pessoas").fill("7");
  await page.getByRole("button", { name: "Criar diagnóstico" }).click();
  await expect(page.getByRole("heading", { name })).toBeVisible();
  return page.url().split("/diagnosticos/")[1]!.split(/[?#]/)[0]!;
}
