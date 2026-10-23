import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listDiagnoses } from "@/lib/services/diagnoses";
import { dateBR } from "@/lib/format";
import { createDiagnosisAction } from "./actions";

export default async function DiagnosesPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const user = await requireUser();
  const { erro } = await searchParams;
  const diagnoses = await listDiagnoses(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1>Diagnósticos</h1>
        <p className="mt-1 text-sm text-slate-600">
          Cada diagnóstico guarda versões. A mais recente é a editável; as anteriores ficam como retrato.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {diagnoses.length === 0 && <p className="text-sm text-slate-600">Nenhum diagnóstico ainda. Crie o primeiro ao lado.</p>}
        {diagnoses.map((d) => (
          <Link
            key={d.id}
            href={`/diagnosticos/${d.id}`}
            className="card block transition hover:border-brand-500"
          >
            <p className="text-lg font-semibold">{d.clientName}</p>
            <p className="text-sm text-slate-600">
              {d.sector} · {d.headcount} pessoas
            </p>
            <p className="mt-3 text-xs text-slate-500">
              {d.versions.length} {d.versions.length === 1 ? "versão" : "versões"} · criado em {dateBR(d.createdAt)}
            </p>
          </Link>
        ))}
      </div>

      <form action={createDiagnosisAction} className="card max-w-xl space-y-3">
        <h2>Novo diagnóstico</h2>
        <div>
          <label className="label" htmlFor="clientName">
            Nome do cliente
          </label>
          <input id="clientName" name="clientName" required minLength={3} className="input" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="label" htmlFor="sector">
              Setor
            </label>
            <input id="sector" name="sector" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="headcount">
              Pessoas
            </label>
            <input id="headcount" name="headcount" type="number" min={1} required className="input" />
          </div>
        </div>
        {erro && <p role="alert" className="text-sm text-red-700">Confira os campos e tente de novo.</p>}
        <button className="btn btn-primary" type="submit">
          Criar diagnóstico
        </button>
      </form>
    </div>
  );
}
