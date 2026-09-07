"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Image as ImageIcon,
  Tags,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AdminSidebar({
  adminName,
  mobile = false,
}: {
  adminName: string;
  mobile?: boolean;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "inset-y-0 left-0 z-40 w-64 flex-col bg-ink text-cream",
        mobile ? "flex h-full" : "fixed hidden lg:flex"
      )}
    >
      <div className="flex h-16 items-center px-6">
        <span className="font-display text-base font-bold">
          BRAGA <span className="text-accent">EVENT</span>
        </span>
      </div>
      <p className="px-6 text-xs font-semibold uppercase tracking-wide text-cream/40">
        Admin
      </p>

      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-accent text-white"
                  : "text-cream/70 hover:bg-white/8 hover:text-cream"
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="text-xs text-cream/50">Sessão iniciada como</p>
        <p className="truncate text-sm font-semibold">{adminName}</p>
      </div>
    </aside>
  );
}
