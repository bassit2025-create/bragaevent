"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function MobileNav({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 active:scale-95"
      >
        <Menu size={24} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-ink/40" onClick={() => setOpen(false)}>
          <div
            className="animate-fade-in-up ml-auto flex h-full w-[82%] max-w-sm flex-col bg-cream p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-lg font-bold text-ink">
                BRAGA <span className="text-accent">EVENT</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-ink/5 active:scale-95"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-4 text-lg font-semibold text-ink transition-colors hover:bg-ink/5 active:bg-ink/10"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-8 text-sm text-ink-soft">
              Braga Event · feito com ♥ em Braga
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
