import { Shell, getCtx } from "../ctx";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ v?: string }> };

export default async function PropostaPage({ params, searchParams }: Props) {
  const { ctx, editable } = await getCtx(params, searchParams);
  return (
    <Shell ctx={ctx} tab="proposta" editable={editable}>
      <p className="text-sm text-slate-600">Modelo de proposta ainda não disponível nesta versão.</p>
    </Shell>
  );
}
