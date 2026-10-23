import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, currentUser } from "@/lib/auth";
import { renderReportPdf } from "@/lib/pdf";
import { loadComputed } from "@/lib/services/diagnoses";

export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  const { id } = await params;
  const v = req.nextUrl.searchParams.get("v");
  const ctx = await loadComputed(id, user.id, v ? Number.parseInt(v, 10) : undefined);
  if (!ctx) return NextResponse.json({ erro: "Diagnóstico não encontrado." }, { status: 404 });

  const token = (await cookies()).get(SESSION_COOKIE)?.value ?? "";
  try {
    const pdf = await renderReportPdf({
      baseUrl: req.nextUrl.origin,
      path: `/imprimir/${id}?v=${ctx.version.number}`,
      sessionToken: token,
    });
    const safe = ctx.diagnosis.clientName.normalize("NFD").replace(/[^\w]+/g, "-").toLowerCase();
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="diagnostico-${safe}-v${ctx.version.number}.pdf"`,
      },
    });
  } catch (e) {
    // Modo de falha documentado (docs/04-arquitetura/modos-de-falha.md): o relatório web continua disponível.
    console.error("Falha ao gerar PDF", e);
    return NextResponse.json(
      { erro: "Não foi possível gerar o PDF. O relatório web segue disponível; tente de novo ou use Imprimir > Salvar como PDF." },
      { status: 502 },
    );
  }
}
