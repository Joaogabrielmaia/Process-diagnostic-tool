import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { loadComputed } from "@/lib/services/diagnoses";

export type Ctx = NonNullable<Awaited<ReturnType<typeof loadComputed>>>;

export async function getCtx(params: Promise<{ id: string }>, searchParams: Promise<{ v?: string }>) {
  const user = await requireUser();
  const { id } = await params;
  const { v } = await searchParams;
  const parsed = v ? Number.parseInt(v, 10) : undefined;
  const ctx = await loadComputed(id, user.id, Number.isFinite(parsed) ? parsed : undefined);
  if (!ctx) notFound();
  return { ctx, user, editable: ctx.version.number === ctx.latest };
}

const TABS = [
  ["", "Roteiro"],
  ["ranking", "Ranking"],
  ["matriz", "Matriz"],
  ["premissas", "Premissas e retorno"],
  ["relatorio", "Relatório"],
  ["versoes", "Versões"],
  ["cliente", "Formulário do cliente"],
] as const;

export function Shell({
  ctx,
  tab,
  editable,
  children,
}: {
  ctx: Ctx;
  tab: string;
  editable: boolean;
  children: React.ReactNode;
}) {
  const { diagnosis, version } = ctx;
  const base = `/diagnosticos/${diagnosis.id}`;
  const q = `?v=${version.number}`;
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/diagnosticos" className="text-sm text-brand-700 hover:underline">
            ← Diagnósticos
          </Link>
          <h1 className="mt-1">{diagnosis.clientName}</h1>
          <p className="text-sm text-slate-600">
            {diagnosis.sector} · {diagnosis.headcount} pessoas · Versão {version.number}: {version.label}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5" aria-label="Versões">
          {diagnosis.versions.map((v) => (
            <Link
              key={v.number}
              href={`${base}${tab ? `/${tab}` : ""}?v=${v.number}`}
              className={`btn ${v.number === version.number ? "btn-primary" : ""}`}
            >
              v{v.number}
            </Link>
          ))}
        </div>
      </div>

      <nav className="-mx-1 flex gap-1 overflow-x-auto border-b border-slate-200 pb-px" aria-label="Seções do diagnóstico">
        {TABS.map(([slug, label]) => (
          <Link
            key={slug}
            href={`${base}${slug ? `/${slug}` : ""}${q}`}
            aria-current={slug === tab ? "page" : undefined}
            className={`whitespace-nowrap rounded-t-lg px-3 py-2 text-sm font-medium ${
              slug === tab ? "border-b-2 border-brand-600 text-brand-700" : "text-slate-600 hover:text-ink"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      {!editable && (
        <p className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-900" role="status">
          Você está vendo a versão {version.number}, que é um retrato fechado e não pode ser editada. Para ajustar, volte à
          versão {ctx.latest} ou crie uma nova versão.
        </p>
      )}
      {children}
    </div>
  );
}
