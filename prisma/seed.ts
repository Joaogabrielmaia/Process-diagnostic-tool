import "dotenv/config";
import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { DEFAULT_CONFIG, DEFAULT_PREMISES } from "../src/lib/scoring/config";
import { CLIENT, PROCESSES_V1, PROCESSES_V2 } from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  const password = process.env.SEED_CONSULTANT_PASSWORD;
  if (!password) throw new Error("Defina SEED_CONSULTANT_PASSWORD no .env (veja .env.example).");

  // Recria só os dados do estudo de caso; reexecutar o seed é seguro.
  await prisma.diagnosis.deleteMany({ where: { clientName: CLIENT.clientName } });

  const user = await prisma.user.upsert({
    where: { email: "marcos@atalho.example" },
    update: { passwordHash: await bcrypt.hash(password, 10) },
    create: {
      email: "marcos@atalho.example",
      name: "Marcos Ribeiro",
      passwordHash: await bcrypt.hash(password, 10),
    },
  });

  const rows = (list: typeof PROCESSES_V2) =>
    list.map((p) => ({ ...p, source: "CONSULTOR" as const }));

  await prisma.diagnosis.create({
    data: {
      ...CLIENT,
      consultantId: user.id,
      versions: {
        create: [
          {
            number: 1,
            label: "Pré-reunião: formulário do cliente e conversa inicial",
            premises: DEFAULT_PREMISES as unknown as Prisma.InputJsonValue,
            config: DEFAULT_CONFIG as unknown as Prisma.InputJsonValue,
            processes: { create: rows(PROCESSES_V1) },
          },
          {
            number: 2,
            label: "Pós-reunião de validação: dados completos",
            premises: DEFAULT_PREMISES as unknown as Prisma.InputJsonValue,
            config: DEFAULT_CONFIG as unknown as Prisma.InputJsonValue,
            processes: { create: rows(PROCESSES_V2) },
          },
        ],
      },
      invites: {
        create: {
          token: randomBytes(24).toString("base64url"),
          expiresAt: new Date(Date.now() + 14 * 24 * 3600 * 1000),
        },
      },
    },
  });

  console.log(`Seed concluído: ${CLIENT.clientName}, 2 versões, consultor ${user.email}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
