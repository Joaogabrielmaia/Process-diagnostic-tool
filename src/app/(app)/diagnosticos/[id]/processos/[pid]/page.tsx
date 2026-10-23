import Link from "next/link";
import { notFound } from "next/navigation";
import { AREAS, FREQUENCIES, SENSITIVITIES, type Area } from "@/lib/scoring";
import { AREA_LABEL, FREQUENCY_LABEL, SENSITIVITY_LABEL } from "@/lib/format";
import { prisma } from "@/lib/db";
import { Shell, getCtx } from "../../ctx";
import { deleteProcessAction, saveProcessAction } from "../../../actions";

type Props = {
  params: Promise<{ id: string; pid: string }>;
  searchParams: Promise<{ v?: string; area?: string; erro?: string }>;
};

const val = (n: number | null | undefined) => (n === null || n === undefined ? "" : String(n));

export default async function ProcessPage({ params, searchParams }: Props) {
  const { id, pid } = await params;
  const { area: areaParam, erro } = await searchParams;
  const { ctx, editable } = await getCtx(Promise.resolve({ id }), Promise.resolve({}));
  if (!editable) notFound();
  const existing = pid === "novo" ? null : await prisma.process.findFirst({ where: { id: pid, versionId: ctx.version.id } });
  if (pid !== "novo" && !existing) notFound();

  const area = (existing?.area ?? (AREAS.includes(areaParam as Area) ? (areaParam as Area) : "ATENDIMENTO")) as Area;
  const save = saveProcessAction.bind(null, ctx.version.id, existing?.id ?? null);
  const remove = existing ? deleteProcessAction.bind(null, ctx.version.id, existing.id) : null;

  return (
    <Shell ctx={ctx} tab="" editable={editable}>
      <form action={save} className="card max-w-3xl space-y-5">
        <div>
          <h2>{existing ? "Editar processo" : "Novo processo"}</h2>
          <p className="hint">Deixe em branco o que o cliente não soube responder: isso é registrado como dado faltante.</p>
        </div>
        {erro && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            Confira os campos: há valores fora da faixa permitida.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="name">Nome do processo</label>
            <input id="name" name="name" required minLength={3} defaultValue={existing?.name ?? ""} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="area">Área</label>
            <select id="area" name="area" defaultValue={area} className="input">
              {AREAS.map((a) => (
                <option key={a} value={a}>{AREA_LABEL[a]}</option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className="grid gap-4 sm:grid-cols-4">
          <legend className="mb-2 text-sm font-semibold">Volume e tempo</legend>
          <div>
            <label className="label" htmlFor="frequency">Frequência</label>
            <select id="frequency" name="frequency" defaultValue={existing?.frequency ?? "SEMANAL"} className="input">
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>{FREQUENCY_LABEL[f]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="volumePerExecution">Itens por execução</label>
            <input id="volumePerExecution" name="volumePerExecution" type="number" min={0} defaultValue={val(existing?.volumePerExecution)} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="minutesPerExecution">Minutos por execução</label>
            <input id="minutesPerExecution" name="minutesPerExecution" type="number" min={0} step="any" defaultValue={val(existing?.minutesPerExecution)} className="input" />
            <p className="hint">De uma pessoa.</p>
          </div>
          <div>
            <label className="label" htmlFor="people">Nº de pessoas</label>
            <input id="people" name="people" type="number" min={1} defaultValue={val(existing?.people)} className="input" />
          </div>
        </fieldset>

        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-2 text-sm font-semibold">Como o processo é feito hoje</legend>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="tools">Ferramentas (separe por vírgula)</label>
            <input id="tools" name="tools" defaultValue={existing?.tools.join(", ") ?? ""} placeholder="Excel, WhatsApp (celular)" className="input" />
            <p className="hint">Ferramentas fora do catálogo recebem integração média e ficam sinalizadas.</p>
          </div>
          <div>
            <label className="label" htmlFor="standardization">Padronização (1 a 5)</label>
            <input id="standardization" name="standardization" type="number" min={1} max={5} defaultValue={val(existing?.standardization)} className="input" />
            <p className="hint">1 = cada um faz de um jeito · 5 = roteiro único seguido</p>
          </div>
          <div>
            <label className="label" htmlFor="dataDigitization">Digitalização dos dados (1 a 5)</label>
            <input id="dataDigitization" name="dataDigitization" type="number" min={1} max={5} defaultValue={val(existing?.dataDigitization)} className="input" />
            <p className="hint">1 = papel ou memória · 5 = dado estruturado em sistema</p>
          </div>
          <div>
            <label className="label" htmlFor="errorRatePct">Taxa de erro percebida (%)</label>
            <input id="errorRatePct" name="errorRatePct" type="number" min={0} max={100} step="any" defaultValue={val(existing?.errorRatePct)} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="dependencies">Dependências (sistemas ou terceiros)</label>
            <input id="dependencies" name="dependencies" type="number" min={0} defaultValue={val(existing?.dependencies)} className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="sensitiveData">Dados sensíveis (LGPD)</label>
            <select id="sensitiveData" name="sensitiveData" defaultValue={existing?.sensitiveData ?? ""} className="input">
              <option value="">Não sei / não informado</option>
              {SENSITIVITIES.map((s) => (
                <option key={s} value={s}>{SENSITIVITY_LABEL[s]}</option>
              ))}
            </select>
          </div>
        </fieldset>

        <div>
          <label className="label" htmlFor="notes">Observações</label>
          <textarea id="notes" name="notes" rows={2} maxLength={600} defaultValue={existing?.notes ?? ""} className="input" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="btn btn-primary" type="submit">Salvar processo</button>
          <Link href={`/diagnosticos/${id}?v=${ctx.version.number}`} className="btn">Cancelar</Link>
        </div>
      </form>
      {remove && (
        <form action={remove} className="max-w-3xl">
          <button className="btn btn-danger" type="submit">Excluir este processo</button>
        </form>
      )}
    </Shell>
  );
}
