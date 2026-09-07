import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const metadata: Metadata = { title: "Configurações" };

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">
        Configurações
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Gere a tua conta de administrador.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
          <h2 className="font-display text-base font-bold text-ink">Conta</h2>
          <dl className="mt-4 flex flex-col gap-3 text-sm">
            <div className="flex justify-between border-b border-ink/5 pb-2">
              <dt className="text-ink-soft">Nome</dt>
              <dd className="font-semibold text-ink">{session.name}</dd>
            </div>
            <div className="flex justify-between border-b border-ink/5 pb-2">
              <dt className="text-ink-soft">Email</dt>
              <dd className="font-semibold text-ink">{session.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Função</dt>
              <dd className="font-semibold text-ink">
                {session.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
          <h2 className="font-display text-base font-bold text-ink">
            Alterar palavra-passe
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Usa uma palavra-passe forte e exclusiva para esta conta.
          </p>
          <div className="mt-4">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
