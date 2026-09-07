import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <div className="text-5xl">🧭</div>
      <h1 className="mt-6 font-display text-3xl font-bold text-ink">
        Não encontrámos essa página
      </h1>
      <p className="mt-3 max-w-sm text-ink-soft">
        O evento pode ter terminado ou o endereço está incorreto. Explora os
        próximos eventos em Braga.
      </p>
      <div className="mt-8">
        <Button href="/eventos">Ver eventos em Braga</Button>
      </div>
      <Link href="/" className="mt-4 text-sm font-semibold text-ink-soft hover:text-ink">
        Voltar ao início
      </Link>
    </div>
  );
}
