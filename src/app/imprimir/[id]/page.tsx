import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { loadComputed } from "@/lib/services/diagnoses";
import { ReportView } from "@/components/ReportView";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ v?: string }> };

/** Rota sem menus, usada pelo gerador de PDF (ADR-003). Exige a mesma sessão do consultor. */
export default async function PrintPage({ params, searchParams }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const { v } = await searchParams;
  const parsed = v ? Number.parseInt(v, 10) : undefined;
  const ctx = await loadComputed(id, user.id, Number.isFinite(parsed) ? parsed : undefined);
  if (!ctx) notFound();
  return (
    <main className="mx-auto max-w-4xl bg-white p-8">
      <ReportView ctx={ctx} />
    </main>
  );
}
