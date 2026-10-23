import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { logoutAction } from "./diagnosticos/actions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/diagnosticos" className="text-xl font-bold text-brand-700">
            Mapa
          </Link>
          <form action={logoutAction} className="flex items-center gap-3 text-sm text-slate-600">
            <span className="hidden sm:inline">{user.name}</span>
            <button className="btn" type="submit">
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </>
  );
}
