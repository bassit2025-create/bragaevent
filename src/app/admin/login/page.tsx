import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-display text-2xl font-bold text-cream">
            BRAGA <span className="text-accent">EVENT</span>
          </span>
          <p className="mt-1 text-sm text-cream/50">Admin</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <h1 className="font-display text-xl font-bold text-ink">
            Iniciar sessão
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Acesso reservado à equipa Braga Event.
          </p>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
