import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-100 text-slate-700">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2">
          <div><Link href="/" className="inline-flex"><Image src="/viajafacil.png" alt="ViajaFácil" width={1536} height={1024} className="h-20 w-auto" /></Link><p className="mt-3 max-w-md text-sm leading-relaxed">Uma experiência de pesquisa e reserva de voos a partir de Angola. Versão de demonstração, sem emissão ou cobrança real.</p></div>
          <nav aria-label="Links do rodapé" className="grid grid-cols-2 gap-x-4">
            {[{ href: "/search", label: "Pesquisar voos" }, { href: "/reservas", label: "Minhas viagens" }, { href: "/sobre", label: "Sobre o projeto" }, { href: "/#perguntas", label: "Perguntas frequentes" }, { href: "/termos", label: "Termos de uso" }, { href: "/privacidade", label: "Privacidade" }].map((link) => <Link key={link.href} href={link.href} className="flex min-h-11 items-center py-2 text-sm hover:text-[var(--action)]">{link.label}</Link>)}
          </nav>
        </div>
        <p className="mt-6 border-t border-slate-300 pt-5 text-xs">© 2026 ViajaFácil. Dados de demonstração. Use informações fictícias ao testar.</p>
      </div>
    </footer>
  );
}
