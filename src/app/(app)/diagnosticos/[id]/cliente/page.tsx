import { prisma } from "@/lib/db";
import { dateBR } from "@/lib/format";
import { createInviteAction } from "../../actions";
import { Shell, getCtx } from "../ctx";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ v?: string }> };

export default async function ClientePage({ params, searchParams }: Props) {
  const { ctx, editable } = await getCtx(params, searchParams);
  const invites = await prisma.clientInvite.findMany({
    where: { diagnosisId: ctx.diagnosis.id },
    orderBy: { createdAt: "desc" },
  });
  const create = createInviteAction.bind(null, ctx.diagnosis.id);
  const now = new Date();

  return (
    <Shell ctx={ctx} tab="cliente" editable={editable}>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card space-y-3">
          <h2>Formulário curto para o cliente</h2>
          <p className="text-sm text-slate-600">
            Antes da reunião, o cliente cita os processos que mais consomem tempo: nome, área, frequência, tempo e
            ferramentas. Nada mais. Cada resposta entra na versão atual marcada como “revisar”, e você completa o resto
            na conversa.
          </p>
          <p className="text-sm text-slate-600">
            O link vale por 14 dias, só acrescenta processos e não mostra nenhum dado existente. Como o Mapa roda só na sua
            máquina, abra o link no mesmo computador (ou numa rede local que você controle).
          </p>
          <form action={create}>
            <button className="btn btn-primary" type="submit">Gerar novo link</button>
          </form>
        </section>

        <section className="card">
          <h2>Links gerados</h2>
          {invites.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">Nenhum link ainda.</p>
          ) : (
            <ul className="mt-3 space-y-3 text-sm">
              {invites.map((i) => {
                const expired = i.expiresAt < now;
                return (
                  <li key={i.id} className="rounded-lg border border-slate-200 p-3">
                    <p className="break-all font-mono text-xs">/cliente/{i.token}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      {expired ? "Expirado" : `Válido até ${dateBR(i.expiresAt)}`}
                      {i.submittedAt ? ` · respondido em ${dateBR(i.submittedAt)}` : " · ainda sem resposta"}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </Shell>
  );
}
