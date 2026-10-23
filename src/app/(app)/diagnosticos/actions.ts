"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  addProcess,
  createDiagnosis,
  createInvite,
  createNewVersion,
  deleteProcess,
  updatePremises,
  updateProcess,
} from "@/lib/services/diagnoses";
import { newDiagnosisSchema, premisesSchema, processFormSchema } from "@/lib/validation";

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}

/** Garante que a versão é do consultor logado e que é a mais recente (as antigas são imutáveis, ADR-004). */
async function ownLatestVersion(versionId: string, userId: string) {
  const version = await prisma.diagnosisVersion.findUnique({
    where: { id: versionId },
    include: { diagnosis: true },
  });
  if (!version || version.diagnosis.consultantId !== userId) throw new Error("Diagnóstico não encontrado.");
  const latest = await prisma.diagnosisVersion.findFirstOrThrow({
    where: { diagnosisId: version.diagnosisId },
    orderBy: { number: "desc" },
  });
  if (latest.id !== version.id) throw new Error("Versões antigas não podem ser editadas. Crie uma nova versão.");
  return version;
}

export async function createDiagnosisAction(formData: FormData) {
  const user = await requireUser();
  const parsed = newDiagnosisSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/diagnosticos?erro=1");
  const d = await createDiagnosis(user.id, parsed.data);
  redirect(`/diagnosticos/${d.id}`);
}

export async function saveProcessAction(versionId: string, processId: string | null, formData: FormData) {
  const user = await requireUser();
  const version = await ownLatestVersion(versionId, user.id);
  const base = `/diagnosticos/${version.diagnosisId}`;
  const parsed = processFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const area = formData.get("area") ?? "";
    redirect(`${base}/processos/${processId ?? "novo"}?erro=1&area=${area}`);
  }
  if (processId) {
    const owned = await prisma.process.findFirst({ where: { id: processId, versionId } });
    if (!owned) throw new Error("Processo não encontrado.");
    await updateProcess(processId, parsed.data);
  } else {
    await addProcess(versionId, parsed.data);
  }
  revalidatePath(base);
  redirect(base);
}

export async function deleteProcessAction(versionId: string, processId: string) {
  const user = await requireUser();
  const version = await ownLatestVersion(versionId, user.id);
  const owned = await prisma.process.findFirst({ where: { id: processId, versionId } });
  if (!owned) throw new Error("Processo não encontrado.");
  await deleteProcess(processId);
  revalidatePath(`/diagnosticos/${version.diagnosisId}`);
  redirect(`/diagnosticos/${version.diagnosisId}`);
}

export async function savePremisesAction(versionId: string, formData: FormData) {
  const user = await requireUser();
  const version = await ownLatestVersion(versionId, user.id);
  const base = `/diagnosticos/${version.diagnosisId}/premissas`;
  const raw = Object.fromEntries(formData) as Record<string, string>;
  // Os campos de redução chegam em % (60) e são guardados como fração (0,6).
  for (const k of ["reductionConservative", "reductionRealistic", "reductionOptimistic"]) {
    raw[k] = String(Number(raw[k]) / 100);
  }
  const parsed = premisesSchema.safeParse(raw);
  if (!parsed.success) redirect(`${base}?erro=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados inválidos.")}`);
  await updatePremises(versionId, parsed.data);
  revalidatePath(`/diagnosticos/${version.diagnosisId}`, "layout");
  redirect(`${base}?salvo=1`);
}

export async function newVersionAction(diagnosisId: string, formData: FormData) {
  const user = await requireUser();
  const own = await prisma.diagnosis.findFirst({ where: { id: diagnosisId, consultantId: user.id } });
  if (!own) throw new Error("Diagnóstico não encontrado.");
  const label = String(formData.get("label") ?? "").trim().slice(0, 100) || "Nova versão";
  const v = await createNewVersion(diagnosisId, label);
  redirect(`/diagnosticos/${diagnosisId}?v=${v.number}`);
}

export async function createInviteAction(diagnosisId: string) {
  const user = await requireUser();
  const own = await prisma.diagnosis.findFirst({ where: { id: diagnosisId, consultantId: user.id } });
  if (!own) throw new Error("Diagnóstico não encontrado.");
  await createInvite(diagnosisId);
  revalidatePath(`/diagnosticos/${diagnosisId}/cliente`);
  redirect(`/diagnosticos/${diagnosisId}/cliente`);
}
