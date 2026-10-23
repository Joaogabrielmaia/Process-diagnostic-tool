import { execSync } from "node:child_process";
import { afterAll, beforeAll } from "vitest";

// Banco separado do de desenvolvimento. O schema é aplicado sem reset destrutivo e as tabelas são esvaziadas
// pelo cliente, depois de conferir que a URL realmente aponta para o banco de teste.
const TEST_URL = "postgresql://mapa:mapa_dev@localhost:5433/mapa_test?schema=public";

process.env.DATABASE_URL = TEST_URL;
process.env.SESSION_SECRET = "segredo-de-teste-com-mais-de-trinta-e-dois-caracteres";

beforeAll(async () => {
  if (!process.env.DATABASE_URL?.includes("/mapa_test")) {
    throw new Error("Os testes de integração só podem rodar no banco mapa_test.");
  }
  execSync("npx prisma db push --skip-generate", {
    env: { ...process.env, DATABASE_URL: TEST_URL },
    stdio: "pipe",
  });
  const { prisma } = await import("@/lib/db");
  await prisma.clientInvite.deleteMany();
  await prisma.process.deleteMany();
  await prisma.diagnosisVersion.deleteMany();
  await prisma.diagnosis.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  const { prisma } = await import("@/lib/db");
  await prisma.$disconnect();
});
