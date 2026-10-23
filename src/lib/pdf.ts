import { chromium } from "@playwright/test";

/**
 * ADR-003: o PDF é a própria página de impressão renderizada pelo Chromium, então web e PDF nunca divergem.
 * Roda localmente; exige `npx playwright install chromium` uma vez.
 */
export async function renderReportPdf(opts: { baseUrl: string; path: string; sessionToken: string }): Promise<Buffer> {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ locale: "pt-BR" });
    await context.addCookies([
      { name: "mapa_session", value: opts.sessionToken, url: opts.baseUrl, httpOnly: true, sameSite: "Lax" },
    ]);
    const page = await context.newPage();
    const res = await page.goto(`${opts.baseUrl}${opts.path}`, { waitUntil: "networkidle" });
    if (!res?.ok()) throw new Error(`Página de impressão respondeu ${res?.status()}`);
    await page.emulateMedia({ media: "print" });
    return await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", bottom: "14mm", left: "12mm", right: "12mm" },
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate:
        '<div style="font-size:8px;width:100%;text-align:center;color:#667">Mapa · estimativas calculadas, não resultados medidos · página <span class="pageNumber"></span> de <span class="totalPages"></span></div>',
    });
  } finally {
    await browser.close();
  }
}
