"use client";

import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminTopbar({ adminName }: { adminName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-ink/8 bg-white px-4 md:px-8">
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink/5 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={22} />
      </button>

      <span className="hidden text-sm font-semibold text-ink-soft lg:block">
        Bem-vindo(a) de volta, {adminName.split(" ")[0]} 👋
      </span>

      <form action={logout}>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={16} /> Sair
        </button>
      </form>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-ink/40 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div className="relative h-full w-64" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-cream"
              aria-label="Fechar menu"
            >
              <X size={18} />
            </button>
            <div className="h-full">
              <AdminSidebar adminName={adminName} mobile />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
