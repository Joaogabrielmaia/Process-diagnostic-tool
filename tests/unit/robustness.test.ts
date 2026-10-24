import { afterEach, describe, expect, it, vi } from "vitest";
import { rankProcesses, type ProcessInput } from "@/lib/scoring";
import { signSession } from "@/lib/auth";

const AREAS = ["COMERCIAL", "ATENDIMENTO", "FINANCEIRO", "OPERACAO", "RH"] as const;
const FREQS = ["DIARIA", "SEMANAL", "QUINZENAL", "MENSAL", "EVENTUAL"] as const;

/** Gerador pseudoaleatório fixo (mulberry32), para o teste ser reprodutível. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function synthetic(n: number): ProcessInput[] {
  const r = rng(42);
  const pick = <T,>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)] as T;
  const maybe = <T,>(v: T) => (r() < 0.2 ? null : v);
  return Array.from({ length: n }, (_, i) => ({
    key: `p-${i}`,
    name: `Processo ${i}`,
    area: pick(AREAS),
    frequency: pick(FREQS),
    volumePerExecution: maybe(1 + Math.floor(r() * 200)),
    minutesPerExecution: maybe(1 + Math.floor(r() * 120)),
    people: maybe(1 + Math.floor(r() * 5)),
    tools: r() < 0.5 ? ["Excel"] : [],
    standardization: maybe(1 + Math.floor(r() * 5)),
    errorRatePct: maybe(Math.floor(r() * 30)),
    dataDigitization: maybe(1 + Math.floor(r() * 5)),
    dependencies: maybe(Math.floor(r() * 6)),
    sensitiveData: maybe(pick(["NENHUM", "PESSOAL", "SAUDE_FINANCEIRO"] as const)),
  }));
}

describe("volume de processos (F-13)", () => {
  it("ordena 500 processos sem depender da ordem de entrada", () => {
    const base = synthetic(500);
    const shuffled = [...base];
    const r = rng(7);
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }
    const a = rankProcesses(base).map((p) => p.key);
    const b = rankProcesses(shuffled).map((p) => p.key);
    expect(a).toEqual(b);
    const priorities = rankProcesses(base).map((p) => p.priority);
    for (let i = 1; i < priorities.length; i++) expect(priorities[i]!).toBeLessThanOrEqual(priorities[i - 1]!);
  });

  it("nenhuma nota sai fora de 0 a 100 nem vira NaN com dado faltante", () => {
    for (const p of rankProcesses(synthetic(500))) {
      for (const v of [p.potential, p.effort, p.priority]) {
        expect(Number.isFinite(v)).toBe(true);
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
      expect(p.completeness).toBeGreaterThan(0);
      expect(p.completeness).toBeLessThanOrEqual(1);
    }
  });
});

describe("configuração da sessão (F-11)", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("recusa assinar sessão sem SESSION_SECRET", async () => {
    vi.stubEnv("SESSION_SECRET", "");
    await expect(signSession("u1")).rejects.toThrow(/SESSION_SECRET/);
  });

  it("recusa segredo curto demais", async () => {
    vi.stubEnv("SESSION_SECRET", "curto");
    await expect(signSession("u1")).rejects.toThrow(/mínimo 32/);
  });
});
