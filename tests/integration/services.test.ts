import { beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import { hashPassword, readSession, signSession, verifyPassword } from "@/lib/auth";
import {
  addProcess,
  compareDiagnosisVersions,
  createDiagnosis,
  createInvite,
  createNewVersion,
  deleteProcess,
  findValidInvite,
  loadComputed,
  submitClientProcess,
  updatePremises,
  updateProcess,
} from "@/lib/services/diagnoses";
import { processFormSchema } from "@/lib/validation";

let ownerId: string;
let otherId: string;

const form = (over: Record<string, unknown> = {}) =>
  processFormSchema.parse({
    name: "Confirmação de consultas",
    area: "ATENDIMENTO",
    frequency: "DIARIA",
    volumePerExecution: "25",
    minutesPerExecution: "40",
    people: "2",
    tools: "WhatsApp (celular), Sistema de agenda",
    standardization: "4",
    errorRatePct: "8",
    dataDigitization: "4",
    dependencies: "1",
    sensitiveData: "PESSOAL",
    ...over,
  });

beforeAll(async () => {
  const mk = async (email: string) =>
    (await prisma.user.create({ data: { email, name: email, passwordHash: await hashPassword("x") } })).id;
  ownerId = await mk("dono@teste.example");
  otherId = await mk("outro@teste.example");
});

describe("diagnóstico e processos", () => {
  it("cria o diagnóstico já com a versão 1 e premissas padrão", async () => {
    const d = await createDiagnosis(ownerId, { clientName: "Clínica Teste", sector: "Saúde", headcount: 10 });
    const ctx = await loadComputed(d.id, ownerId);
    expect(ctx?.version.number).toBe(1);
    expect(ctx?.premises.hourlyCostBRL).toBe(42);
    expect(ctx?.ranked).toEqual([]);
  });

  it("adiciona, edita e remove processos, recalculando o ranking", async () => {
    const d = await createDiagnosis(ownerId, { clientName: "Clínica A", sector: "Saúde", headcount: 10 });
    const v = (await loadComputed(d.id, ownerId))!.version;
    const p = await addProcess(v.id, form());
    let ctx = (await loadComputed(d.id, ownerId))!;
    expect(ctx.ranked).toHaveLength(1);
    expect(ctx.ranked[0]!.hoursPerMonth).toBe(29.3);

    await updateProcess(p.id, form({ minutesPerExecution: "80" }));
    ctx = (await loadComputed(d.id, ownerId))!;
    expect(ctx.ranked[0]!.hoursPerMonth).toBe(58.7);

    await deleteProcess(p.id);
    ctx = (await loadComputed(d.id, ownerId))!;
    expect(ctx.ranked).toHaveLength(0);
  });

  it("guarda campos vazios como null (dado faltante)", async () => {
    const d = await createDiagnosis(ownerId, { clientName: "Clínica B", sector: "Saúde", headcount: 10 });
    const v = (await loadComputed(d.id, ownerId))!.version;
    const p = await addProcess(v.id, form({ errorRatePct: "", sensitiveData: "" }));
    const row = await prisma.process.findUniqueOrThrow({ where: { id: p.id } });
    expect(row.errorRatePct).toBeNull();
    expect(row.sensitiveData).toBeNull();
    const ctx = (await loadComputed(d.id, ownerId))!;
    expect(ctx.ranked[0]!.missingFields).toEqual(expect.arrayContaining(["taxa de erro", "dados sensíveis"]));
  });

  it("um consultor não enxerga o diagnóstico de outro", async () => {
    const d = await createDiagnosis(ownerId, { clientName: "Clínica C", sector: "Saúde", headcount: 10 });
    expect(await loadComputed(d.id, otherId)).toBeNull();
  });

  it("premissas alteradas mudam a economia calculada", async () => {
    const d = await createDiagnosis(ownerId, { clientName: "Clínica D", sector: "Saúde", headcount: 10 });
    const ctx0 = (await loadComputed(d.id, ownerId))!;
    await addProcess(ctx0.version.id, form());
    const before = (await loadComputed(d.id, ownerId))!;
    await updatePremises(ctx0.version.id, { ...before.premises, hourlyCostBRL: before.premises.hourlyCostBRL * 2 });
    const after = (await loadComputed(d.id, ownerId))!;
    expect(after.summary.monthlySavingBRL.realistic).toBeGreaterThan(before.summary.monthlySavingBRL.realistic);
  });
});

describe("versões (ADR-004)", () => {
  it("nova versão copia tudo e deixa a anterior intacta", async () => {
    const d = await createDiagnosis(ownerId, { clientName: "Clínica E", sector: "Saúde", headcount: 10 });
    const v1 = (await loadComputed(d.id, ownerId))!.version;
    await addProcess(v1.id, form());
    const v2 = await createNewVersion(d.id, "Ajuste");
    expect(v2.number).toBe(2);

    const procsV2 = await prisma.process.findMany({ where: { versionId: v2.id } });
    expect(procsV2).toHaveLength(1);
    await updateProcess(procsV2[0]!.id, form({ minutesPerExecution: "10" }));

    const old = (await loadComputed(d.id, ownerId, 1))!;
    const cur = (await loadComputed(d.id, ownerId))!;
    expect(old.ranked[0]!.hoursPerMonth).toBe(29.3);
    expect(cur.ranked[0]!.hoursPerMonth).toBe(7.3);
    expect(cur.version.number).toBe(2);
  });

  it("a chave do processo é estável entre versões e a comparação a usa", async () => {
    const d = await createDiagnosis(ownerId, { clientName: "Clínica F", sector: "Saúde", headcount: 10 });
    const v1 = (await loadComputed(d.id, ownerId))!.version;
    await addProcess(v1.id, form());
    await createNewVersion(d.id, "Ajuste");
    const v2 = (await loadComputed(d.id, ownerId))!;
    const p = v2.version.processes[0]!;
    await updateProcess(p.id, form({ name: "Nome novo", minutesPerExecution: "90" }));
    await addProcess(v2.version.id, form({ name: "Processo extra" }));

    const cmp = (await compareDiagnosisVersions(d.id, ownerId, 1, 2))!;
    expect(cmp.comparison.added.map((x) => x.name)).toEqual(["Processo extra"]);
    expect(cmp.comparison.removed).toEqual([]);
    expect(cmp.comparison.changed).toHaveLength(1);
    expect(cmp.comparison.changed[0]!.name).toBe("Nome novo");
  });
});

describe("link do cliente (ADR-005)", () => {
  it("o cliente acrescenta um processo marcado para revisão, sem ver nada", async () => {
    const d = await createDiagnosis(ownerId, { clientName: "Clínica G", sector: "Saúde", headcount: 10 });
    const invite = await createInvite(d.id);
    expect(invite.token.length).toBeGreaterThanOrEqual(30);

    const res = await submitClientProcess(invite.token, {
      name: "Controle de estoque",
      area: "OPERACAO",
      frequency: "SEMANAL",
      minutesPerExecution: 60,
      people: 1,
      tools: ["Papel"],
    });
    expect(res.ok).toBe(true);

    const ctx = (await loadComputed(d.id, ownerId))!;
    const p = ctx.version.processes[0]!;
    expect(p.source).toBe("CLIENTE");
    expect(p.needsReview).toBe(true);
    expect(p.errorRatePct).toBeNull();
    const refreshed = await prisma.clientInvite.findUniqueOrThrow({ where: { id: invite.id } });
    expect(refreshed.submittedAt).not.toBeNull();
  });

  it("recusa token inexistente e token expirado", async () => {
    const d = await createDiagnosis(ownerId, { clientName: "Clínica H", sector: "Saúde", headcount: 10 });
    const invite = await createInvite(d.id);
    await prisma.clientInvite.update({ where: { id: invite.id }, data: { expiresAt: new Date(Date.now() - 1000) } });
    expect(await findValidInvite(invite.token)).toBeNull();
    expect(await findValidInvite("token-que-nao-existe")).toBeNull();
    const res = await submitClientProcess(invite.token, {
      name: "Qualquer coisa",
      area: "RH",
      frequency: "MENSAL",
      minutesPerExecution: null,
      people: null,
      tools: [],
    });
    expect(res).toEqual({ ok: false, reason: "invalid" });
    expect(await prisma.process.count({ where: { name: "Qualquer coisa" } })).toBe(0);
  });
});

describe("sessão", () => {
  it("assina e lê a sessão; recusa token adulterado ou vazio", async () => {
    const token = await signSession("user-123");
    expect(await readSession(token)).toBe("user-123");
    expect(await readSession(token.slice(0, -3) + "abc")).toBeNull();
    expect(await readSession("lixo")).toBeNull();
    expect(await readSession(undefined)).toBeNull();
  });

  it("senha: hash não guarda o texto e verifica corretamente", async () => {
    const h = await hashPassword("minha-senha");
    expect(h).not.toContain("minha-senha");
    expect(await verifyPassword("minha-senha", h)).toBe(true);
    expect(await verifyPassword("outra", h)).toBe(false);
  });
});
