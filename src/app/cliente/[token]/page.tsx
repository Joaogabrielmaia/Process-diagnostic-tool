import { AREAS, FREQUENCIES } from "@/lib/scoring";
import { AREA_LABEL, FREQUENCY_LABEL } from "@/lib/format";
import { findValidInvite } from "@/lib/services/diagnoses";
import { submitClientAction } from "./actions";

type Props = { params: Promise<{ token: string }>; searchParams: Promise<{ ok?: string; erro?: string }> };

export default async function ClientFormPage({ params, searchParams }: Props) {
  const { token } = await params;
  const { ok, erro } = await searchParams;
  const invite = await findValidInvite(token);

  if (!invite) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <h1>Link inválido ou expirado</h1>
        <p className="mt-2 text-sm text-slate-600">Peça um novo link ao seu consultor.</p>
      </main>
    );
  }
  const submit = submitClientAction.bind(null, token);

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <p className="text-sm font-semibold text-brand-700">Atalho Automação</p>
      <h1 className="mt-1">Antes da nossa reunião</h1>
      <p className="mt-2 text-sm text-slate-600">
        Olá! Conte pra gente, em poucos minutos, uma tarefa repetitiva do dia a dia na {invite.diagnosis.clientName}. Pode
        responder de memória: a gente ajusta junto na reunião. Se tiver mais de uma tarefa, envie uma de cada vez.
      </p>

      {ok && (
        <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Recebido, obrigado! Pode enviar outra tarefa se quiser.
        </p>
      )}
      {erro && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Confira os campos e tente de novo.
        </p>
      )}

      <form action={submit} className="card mt-5 space-y-4">
        <div>
          <label className="label" htmlFor="name">Qual é a tarefa?</label>
          <input id="name" name="name" required minLength={3} className="input" placeholder="Ex.: confirmar consultas por WhatsApp" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="area">Em qual área ela acontece?</label>
            <select id="area" name="area" className="input">
              {AREAS.map((a) => <option key={a} value={a}>{AREA_LABEL[a]}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="frequency">Com que frequência?</label>
            <select id="frequency" name="frequency" className="input" defaultValue="SEMANAL">
              {FREQUENCIES.map((f) => <option key={f} value={f}>{FREQUENCY_LABEL[f]}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="minutesPerExecution">Quanto tempo leva cada vez? (minutos)</label>
            <input id="minutesPerExecution" name="minutesPerExecution" type="number" min={0} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="people">Quantas pessoas fazem?</label>
            <input id="people" name="people" type="number" min={1} className="input" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="tools">Que ferramentas usam? (separe por vírgula)</label>
          <input id="tools" name="tools" className="input" placeholder="Excel, WhatsApp (celular)" />
        </div>
        <button className="btn btn-primary w-full" type="submit">Enviar</button>
        <p className="hint">Não peça nem informe dados de pacientes ou clientes neste formulário.</p>
      </form>
    </main>
  );
}
