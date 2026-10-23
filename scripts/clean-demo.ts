/**
 * Remove os diagnósticos criados pelos testes E2E do banco de DESENVOLVIMENTO e recoloca o seed.
 * Mantém só a Clínica Vida Plena. Uso: npm run demo:clean
 */
import "dotenv/config";
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL?.includes("localhost")) throw new Error("Só roda contra um banco local.");
  const { count } = await prisma.diagnosis.deleteMany({ where: { NOT: { clientName: "Clínica Vida Plena" } } });
  console.log(`${count} diagnóstico(s) de teste removido(s).`);
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
