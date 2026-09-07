import Link from "next/link";
import { MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-ink/8 bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <span className="font-display text-xl font-bold">
              BRAGA <span className="text-accent">EVENT</span>
            </span>
            <p className="mt-3 max-w-xs text-sm text-cream/70">
              A plataforma que te mostra tudo o que está a acontecer em
              Braga. Concertos, festas, cultura e muito mais — sempre
              atualizado.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-sm text-cream/70">
              <MapPin size={16} />
              Braga, Portugal
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-cream/50">
              Explorar
            </h4>
            <nav className="mt-4 flex flex-col gap-2 text-sm">
              <Link href="/eventos" className="text-cream/80 hover:text-accent">
                Todos os eventos
              </Link>
              <Link
                href="/eventos?quando=hoje"
                className="text-cream/80 hover:text-accent"
              >
                Hoje em Braga
              </Link>
              <Link
                href="/eventos?quando=fim-de-semana"
                className="text-cream/80 hover:text-accent"
              >
                Este fim de semana
              </Link>
              <Link href="/categorias" className="text-cream/80 hover:text-accent">
                Categorias
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-cream/50">
              Segue-nos
            </h4>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Braga Event"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-accent"
              >
                <InstagramIcon size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-cream/50 md:flex-row">
          <span>© {new Date().getFullYear()} Braga Event. Todos os direitos reservados.</span>
          <span>Feito com ♥ em Braga, Portugal.</span>
        </div>
      </div>
    </footer>
  );
}
