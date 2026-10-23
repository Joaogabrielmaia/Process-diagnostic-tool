import { randomBytes, randomUUID } from "node:crypto";
import type { Prisma, Process as ProcessRow } from "@prisma/client";
import { prisma } from "../db";
import {
  buildRoadmap,
  compareVersions,
  DEFAULT_CONFIG,
  DEFAULT_PREMISES,
  rankProcesses,
  summarize,
  type Premises,
  type ProcessInput,
  type ScoringConfig,
} from "../scoring";
import type { ClientFormData, ProcessFormData } from "../validation";

export function rowToInput(row: ProcessRow): ProcessInput {
  return {
    key: row.key,
    name: row.name,
    area: row.area,
    frequency: row.frequency,
    volumePerExecution: row.volumePerExecution,
    minutesPerExecution: row.minutesPerExecution,
    people: row.people,
    tools: row.tools,
    standardization: row.standardization,
    errorRatePct: row.errorRatePct,
    dataDigitization: row.dataDigitization,
    dependencies: row.dependencies,
    sensitiveData: row.sensitiveData,
  };
}

export async function createDiagnosis(
  consultantId: string,
  data: { clientName: string; sector: string; headcount: number },
) {
  return prisma.diagnosis.create({
    data: {
      ...data,
      consultantId,
      versions: {
        create: {
          number: 1,
          label: "Versão inicial",
          premises: DEFAULT_PREMISES as unknown as Prisma.InputJsonValue,
          config: DEFAULT_CONFIG as unknown as Prisma.InputJsonValue,
        },
      },
    },
  });
}

export async function listDiagnoses(consultantId: string) {
  return prisma.diagnosis.findMany({
    where: { consultantId },
    orderBy: { createdAt: "desc" },
    include: { versions: { select: { number: true }, orderBy: { number: "desc" } } },
  });
}

/** Carrega o diagnóstico com a versão pedida (ou a mais recente) e calcula tudo. */
export async function loadComputed(diagnosisId: string, consultantId: string, versionNumber?: number) {
  const diagnosis = await prisma.diagnosis.findFirst({
    where: { id: diagnosisId, consultantId },
    include: { versions: { select: { number: true, label: true, createdAt: true }, orderBy: { number: "asc" } } },
  });
  if (!diagnosis) return null;
  const latest = diagnosis.versions[diagnosis.versions.length - 1]!.number;
  const number = versionNumber ?? latest;
  const version = await prisma.diagnosisVersion.findUnique({
    where: { diagnosisId_number: { diagnosisId, number } },
    include: { processes: { orderBy: { name: "asc" } } },
  });
  if (!version) return null;
  return { diagnosis, version, latest, ...computeVersion(version) };
}

export function computeVersion(version: {
  premises: unknown;
  config: unknown;
  processes: ProcessRow[];
}) {
  const premises = { ...DEFAULT_PREMISES, ...(version.premises as Partial<Premises>) };
  const config = { ...DEFAULT_CONFIG, ...(version.config as Partial<ScoringConfig>) };
  const inputs = version.processes.map(rowToInput);
  const ranked = rankProcesses(inputs, config, premises);
  return { premises, config, inputs, ranked, summary: summarize(ranked), roadmap: buildRoadmap(ranked, premises) };
}

function toRowData(data: ProcessFormData) {
  const { notes, ...rest } = data;
  return { ...rest, notes: notes || null };
}

export async function addProcess(versionId: string, data: ProcessFormData) {
  return prisma.process.create({
    data: { ...toRowData(data), versionId, key: randomUUID(), source: "CONSULTOR" },
  });
}

export async function updateProcess(processId: string, data: ProcessFormData) {
  return prisma.process.update({
    where: { id: processId },
    data: { ...toRowData(data), needsReview: false },
  });
}

export async function deleteProcess(processId: string) {
  return prisma.process.delete({ where: { id: processId } });
}

export async function updatePremises(versionId: string, premises: Premises) {
  return prisma.diagnosisVersion.update({
    where: { id: versionId },
    data: { premises: premises as unknown as Prisma.InputJsonValue },
  });
}

/** ADR-004: nova versão = cópia completa da mais recente; as anteriores nunca mudam. */
export async function createNewVersion(diagnosisId: string, label: string) {
  const latest = await prisma.diagnosisVersion.findFirstOrThrow({
    where: { diagnosisId },
    orderBy: { number: "desc" },
    include: { processes: true },
  });
  return prisma.diagnosisVersion.create({
    data: {
      diagnosisId,
      number: latest.number + 1,
      label,
      premises: latest.premises as Prisma.InputJsonValue,
      config: latest.config as Prisma.InputJsonValue,
      processes: {
        create: latest.processes.map((p) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, versionId, ...rest } = p;
          return rest;
        }),
      },
    },
  });
}

export async function compareDiagnosisVersions(diagnosisId: string, consultantId: string, a: number, b: number) {
  const [before, after] = await Promise.all([
    loadComputed(diagnosisId, consultantId, a),
    loadComputed(diagnosisId, consultantId, b),
  ]);
  if (!before || !after) return null;
  return {
    before,
    after,
    comparison: compareVersions(before.ranked, after.ranked, before.summary, after.summary),
  };
}

const INVITE_DAYS = 14;

export async function createInvite(diagnosisId: string) {
  return prisma.clientInvite.create({
    data: {
      diagnosisId,
      token: randomBytes(24).toString("base64url"),
      expiresAt: new Date(Date.now() + INVITE_DAYS * 24 * 3600 * 1000),
    },
  });
}

export async function findValidInvite(token: string) {
  const invite = await prisma.clientInvite.findUnique({
    where: { token },
    include: { diagnosis: true },
  });
  if (!invite || invite.expiresAt < new Date()) return null;
  return invite;
}

/**
 * ADR-005: o cliente só acrescenta processos à versão mais recente, marcados "para revisar".
 * Ele nunca lê nem altera dados existentes.
 */
export async function submitClientProcess(token: string, data: ClientFormData) {
  const invite = await findValidInvite(token);
  if (!invite) return { ok: false as const, reason: "invalid" as const };
  const latest = await prisma.diagnosisVersion.findFirstOrThrow({
    where: { diagnosisId: invite.diagnosisId },
    orderBy: { number: "desc" },
  });
  await prisma.$transaction([
    prisma.process.create({
      data: {
        versionId: latest.id,
        key: randomUUID(),
        name: data.name,
        area: data.area,
        frequency: data.frequency,
        minutesPerExecution: data.minutesPerExecution,
        people: data.people,
        tools: data.tools,
        source: "CLIENTE",
        needsReview: true,
      },
    }),
    prisma.clientInvite.update({ where: { id: invite.id }, data: { submittedAt: new Date() } }),
  ]);
  return { ok: true as const };
}
