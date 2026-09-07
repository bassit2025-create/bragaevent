"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.push(`/eventos?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl items-center gap-2 rounded-2xl bg-white p-2 shadow-xl shadow-black/20"
    >
      <Search className="ml-2 shrink-0 text-ink-soft" size={20} />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Procurar eventos em Braga..."
        className="w-full bg-transparent py-3 text-base text-ink placeholder:text-ink-soft/60 focus:outline-none"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-dark active:scale-95"
      >
        Procurar
      </button>
    </form>
  );
}
