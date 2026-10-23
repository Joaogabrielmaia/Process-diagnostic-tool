import { brl, num } from "@/lib/format";
import { Kpi } from "@/components/Badges";
import { Shell, getCtx } from "../ctx";
import { savePremisesAction } from "../../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ v?: string; erro?: string; salvo?: string }>;
};

function Field({
  name,
  label,
  value,
  step = "any",
  hint,
  disabled,
}: {
  name: string;
  label: string;
  value: number;
  step?: string;
  hint?: string;
  disabled: boolean;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <input id={name} name={name} type="number" step={step} defaultValue={value} disabled={disabled} className="input" required />
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export default async function PremissasPage({ params, searchParams }: Props) {
  const { ctx, editable } = await getCtx(params, searchParams);
  const { erro, salvo } = await searchParams;
  const { premises: p, summary } = ctx;
  const save = savePremisesAction.bind(null, ctx.version.id);

  return (
    <Shell ctx={ctx} tab="premissas" editable={editable}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi
          label="Economia mensal (faixa)"
          value={`${brl(summary.monthlySavingBRL.conservative)} a ${brl(summary.monthlySavingBRL.optimistic)}`}
          hint={`Realista: ${brl(summary.monthlySavingBRL.realistic)}`}
        />
        <Kpi
          label="Investimento (faixa)"
          value={`${brl(summary.investmentBRL.optimistic)} a ${brl(summary.investmentBRL.conservative)}`}
          hint={`Realista: ${brl(summary.investmentBRL.realistic)}`}
        />
        <Kpi
          label="Payback (realista)"
          value={summary.paybackMonths ? `${num(summary.paybackMonths.realistic)} meses` : "n/d"}
          hint={
            summary.paybackMonths
              ? `De ${num(summary.paybackMonths.optimistic)} a ${num(summary.paybackMonths.conservative)} meses`
              : undefined
          }
        />
      </div>
      <p className="text-xs text-slate-500">
        Totais dos processos fora de “evitar”. São estimativas calculadas, não resultados medidos.
      </p>

      <form action={save} className="card max-w-3xl space-y-5">
        <div>
          <h2>Premissas</h2>
          <p className="hint">
            Economia mensal = horas por mês × custo da hora × redução esperada. Mude uma premissa e veja a faixa reagir: os
            números acima são recalculados ao salvar.
          </p>
        </div>
        {erro && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {erro}
          </p>
        )}
        {salvo && (
          <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Premissas salvas.
          </p>
        )}
        <fieldset className="grid gap-4 sm:grid-cols-2" disabled={!editable}>
          <legend className="mb-2 text-sm font-semibold">Retorno</legend>
          <Field disabled={!editable} name="hourlyCostBRL" label="Custo da hora do time (R$)" value={p.hourlyCostBRL} hint="Salário com encargos ÷ horas trabalhadas." />
          <div />
          <Field disabled={!editable} name="reductionConservative" label="Redução conservadora (%)" value={p.reductionConservative * 100} />
          <Field disabled={!editable} name="reductionRealistic" label="Redução realista (%)" value={p.reductionRealistic * 100} />
          <Field disabled={!editable} name="reductionOptimistic" label="Redução otimista (%)" value={p.reductionOptimistic * 100} />
        </fieldset>
        <fieldset className="grid gap-4 sm:grid-cols-2" disabled={!editable}>
          <legend className="mb-2 text-sm font-semibold">Investimento e capacidade</legend>
          <Field disabled={!editable} name="consultantRateBRL" label="Hora do consultor (R$)" value={p.consultantRateBRL} />
          <Field disabled={!editable} name="capacityHoursPerWindow" label="Horas de implantação por 30 dias" value={p.capacityHoursPerWindow} />
          <Field disabled={!editable} name="minDevHours" label="Horas mínimas por automação" value={p.minDevHours} hint="Com esforço 0." />
          <Field disabled={!editable} name="maxDevHours" label="Horas máximas por automação" value={p.maxDevHours} hint="Com esforço 100." />
          <Field disabled={!editable} name="investmentLowFactor" label="Fator inferior da faixa" value={p.investmentLowFactor} step="0.01" />
          <Field disabled={!editable} name="investmentHighFactor" label="Fator superior da faixa" value={p.investmentHighFactor} step="0.01" />
        </fieldset>
        {editable && (
          <button className="btn btn-primary" type="submit">
            Salvar premissas
          </button>
        )}
      </form>
    </Shell>
  );
}
