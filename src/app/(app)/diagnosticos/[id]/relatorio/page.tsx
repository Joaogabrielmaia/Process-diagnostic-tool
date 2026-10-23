import { ReportView } from "@/components/ReportView";
import { Shell, getCtx } from "../ctx";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ v?: string }> };

export default async function RelatorioPage({ params, searchParams }: Props) {
  const { ctx, editable } = await getCtx(params, searchParams);
  return (
    <Shell ctx={ctx} tab="relatorio" editable={editable}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">Pré-visualização do relatório. O PDF usa exatamente esta página.</p>
        <a
          className="btn btn-primary"
          href={`/api/diagnosticos/${ctx.diagnosis.id}/pdf?v=${ctx.version.number}`}
          download
        >
          Baixar PDF
        </a>
      </div>
      <div className="card">
        <ReportView ctx={ctx} />
      </div>
    </Shell>
  );
}
