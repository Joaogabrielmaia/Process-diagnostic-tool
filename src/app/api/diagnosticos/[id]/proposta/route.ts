import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { dateBR } from "@/lib/format";
import { buildProposal, proposalToMarkdown } from "@/lib/proposal";
import { loadComputed } from "@/lib/services/diagnoses";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  const { id } = await params;
  const v = req.nextUrl.searchParams.get("v");
  const ctx = await loadComputed(id, user.id, v ? Number.parseInt(v, 10) : undefined);
  if (!ctx) return NextResponse.json({ erro: "Diagnóstico não encontrado." }, { status: 404 });

  const proposal = buildProposal({
    clientName: ctx.diagnosis.clientName,
    versionNumber: ctx.version.number,
    ranked: ctx.ranked,
    roadmap: ctx.roadmap,
    premises: ctx.premises,
  });
  const safe = ctx.diagnosis.clientName.normalize("NFD").replace(/[^\w]+/g, "-").toLowerCase();
  return new NextResponse(proposalToMarkdown(proposal, dateBR(new Date())), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "content-disposition": `attachment; filename="proposta-${safe}-v${ctx.version.number}.md"`,
    },
  });
}
