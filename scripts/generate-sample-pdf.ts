/**
 * Gera de verdade o PDF de exemplo em docs/exemplo-de-relatorio/.
 * Exige o app rodando em http://localhost:3000 (npm run dev) e o seed aplicado.
 * Uso: npm run report:pdf
 */
import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { signSession } from "../src/lib/auth";
import { renderReportPdf } from "../src/lib/pdf";

const BASE = process.env.APP_URL ?? "http://localhost:3000";
const prisma = new PrismaClient();

async function main() {
  const diagnosis = await prisma.diagnosis.findFirstOrThrow({
    where: { clientName: "Clínica Vida Plena" },
    include: { consultant: true },
  });
  const token = await signSession(diagnosis.consultantId);
  const outDir = path.resolve(__dirname, "../docs/exemplo-de-relatorio");
  await mkdir(outDir, { recursive: true });

  for (const v of [1, 2]) {
    const pdf = await renderReportPdf({ baseUrl: BASE, path: `/imprimir/${diagnosis.id}?v=${v}`, sessionToken: token });
    const file = path.join(outDir, `diagnostico-clinica-vida-plena-v${v}.pdf`);
    await writeFile(file, pdf);
    console.log(`${path.relative(process.cwd(), file)}: ${(pdf.length / 1024).toFixed(0)} KB`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
