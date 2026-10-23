import { loginAction } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <div className="mb-6 text-center">
        <p className="text-3xl font-bold text-brand-700">Mapa</p>
        <p className="mt-1 text-sm text-slate-600">Descubra onde vale a pena automatizar.</p>
      </div>
      <form action={loginAction} className="card space-y-4">
        <div>
          <label htmlFor="email" className="label">
            E-mail
          </label>
          <input id="email" name="email" type="email" required autoComplete="username" className="input" />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Senha
          </label>
          <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
        </div>
        {erro && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            E-mail ou senha incorretos.
          </p>
        )}
        <button className="btn btn-primary w-full" type="submit">
          Entrar
        </button>
      </form>
    </main>
  );
}
