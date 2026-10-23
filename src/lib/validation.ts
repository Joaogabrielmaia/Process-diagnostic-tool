import { z } from "zod";
import { AREAS, FREQUENCIES, SENSITIVITIES } from "./scoring/types";

/** Aceita campo vazio de formulário como "dado faltante" (null), nunca como zero. */
const optionalNumber = (min: number, max: number) =>
  z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? null : Number(v)),
    z.number().min(min).max(max).nullable(),
  );
const optionalInt = (min: number, max: number) =>
  z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? null : Number(v)),
    z.number().int().min(min).max(max).nullable(),
  );

export const processFormSchema = z.object({
  name: z.string().trim().min(3, "Dê um nome com pelo menos 3 letras.").max(120),
  area: z.enum(AREAS),
  frequency: z.enum(FREQUENCIES),
  volumePerExecution: optionalInt(0, 100000),
  minutesPerExecution: optionalNumber(0, 24 * 60),
  people: optionalInt(1, 500),
  tools: z.preprocess(
    (v) =>
      typeof v === "string"
        ? v
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : v,
    z.array(z.string().max(60)).max(12),
  ),
  standardization: optionalInt(1, 5),
  errorRatePct: optionalNumber(0, 100),
  dataDigitization: optionalInt(1, 5),
  dependencies: optionalInt(0, 50),
  sensitiveData: z.preprocess((v) => (v === "" ? null : v), z.enum(SENSITIVITIES).nullable()),
  notes: z.string().max(600).optional(),
});
export type ProcessFormData = z.infer<typeof processFormSchema>;

/** Formulário curto do cliente: só o que ele sabe responder sem ajuda (ADR-005). */
export const clientFormSchema = z.object({
  name: z.string().trim().min(3).max(120),
  area: z.enum(AREAS),
  frequency: z.enum(FREQUENCIES),
  minutesPerExecution: optionalNumber(0, 24 * 60),
  people: optionalInt(1, 500),
  tools: z.preprocess(
    (v) =>
      typeof v === "string"
        ? v
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : v,
    z.array(z.string().max(60)).max(12),
  ),
});
export type ClientFormData = z.infer<typeof clientFormSchema>;

export const premisesSchema = z
  .object({
    hourlyCostBRL: z.coerce.number().min(1).max(2000),
    reductionConservative: z.coerce.number().min(0).max(1),
    reductionRealistic: z.coerce.number().min(0).max(1),
    reductionOptimistic: z.coerce.number().min(0).max(1),
    consultantRateBRL: z.coerce.number().min(1).max(5000),
    minDevHours: z.coerce.number().min(1).max(1000),
    maxDevHours: z.coerce.number().min(1).max(2000),
    investmentLowFactor: z.coerce.number().min(0.1).max(3),
    investmentHighFactor: z.coerce.number().min(0.1).max(5),
    capacityHoursPerWindow: z.coerce.number().min(1).max(1000),
  })
  .refine((p) => p.reductionConservative <= p.reductionRealistic && p.reductionRealistic <= p.reductionOptimistic, {
    message: "A redução deve crescer do cenário conservador ao otimista.",
  })
  .refine((p) => p.minDevHours <= p.maxDevHours, { message: "Horas mínimas não podem passar das máximas." })
  .refine((p) => p.investmentLowFactor <= p.investmentHighFactor, {
    message: "O fator baixo do investimento não pode passar do alto.",
  });

export const newDiagnosisSchema = z.object({
  clientName: z.string().trim().min(3).max(120),
  sector: z.string().trim().min(2).max(80),
  headcount: z.coerce.number().int().min(1).max(100000),
});
