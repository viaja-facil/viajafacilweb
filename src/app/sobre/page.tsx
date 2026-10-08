import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Sobre o projeto" };
export default function Page() { return <div className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-slate-700 sm:px-6">
<section><h1 className="mb-3 text-3xl font-bold text-slate-900">Sobre a ViajaFácil</h1><p className="leading-relaxed">Estamos a preparar uma experiência de pesquisa e reserva de voos a partir de Angola.</p></section>
<section><h2 className="mb-3 text-xl font-bold text-slate-900">O que pode experimentar</h2><p className="leading-relaxed">Pesquise rotas, compare voos fictícios, selecione ida e regresso, escolha lugares e percorra uma reserva de demonstração. As contas e os pagamentos são simulados.</p></section>
<section><h2 className="mb-3 text-xl font-bold text-slate-900">Nesta versão</h2><p className="leading-relaxed">Não há cobrança, emissão de bilhetes, check-in ou envio de confirmação real. O catálogo não representa parcerias ou disponibilidade comercial. Utilize dados fictícios ao testar.</p></section>
<section><h2 className="mb-3 text-xl font-bold text-slate-900">Ajuda</h2><p className="leading-relaxed">As perguntas frequentes explicam as funcionalidades disponíveis. Os canais de atendimento comercial serão publicados quando estiverem confirmados.</p></section>
<p className="text-sm">Última revisão: 7 de outubro de 2026.</p><Link href="/#perguntas" className="inline-flex min-h-11 items-center font-semibold text-[var(--action)]">Consultar perguntas frequentes →</Link></div>; }
