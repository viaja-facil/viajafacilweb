import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Termos da demonstração" };
export default function Page() { return <div className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-slate-700 sm:px-6">
<section><h1 className="mb-3 text-3xl font-bold text-slate-900">Termos da demonstração</h1><p className="leading-relaxed">Esta versão permite experimentar a pesquisa e a reserva de voos com dados fictícios. Não presta um serviço de venda ou emissão de bilhetes.</p></section>
<section><h2 className="mb-3 text-xl font-bold text-slate-900">Voos e pagamentos</h2><p className="leading-relaxed">Preços, horários, disponibilidade, contas, referências e confirmações são simulados. Não efetue pagamentos com referências apresentadas aqui. Uma confirmação nesta versão não constitui bilhete ou reserva junto de uma companhia aérea.</p></section>
<section><h2 className="mb-3 text-xl font-bold text-slate-900">Dados de teste</h2><p className="leading-relaxed">Use informações fictícias. Não introduza documentos de identificação, dados bancários ou informações pessoais reais. Não utilize esta versão para organizar uma viagem que dependa de reserva confirmada.</p></section>
<section><h2 className="mb-3 text-xl font-bold text-slate-900">Antes do lançamento comercial</h2><p className="leading-relaxed">As condições de venda, alterações, cancelamentos, atendimento e identificação da entidade responsável serão publicadas e validadas antes da disponibilização de reservas reais.</p></section>
<p className="text-sm">Última revisão: 7 de outubro de 2026.</p><Link href="/#perguntas" className="inline-flex min-h-11 items-center font-semibold text-[var(--action)]">Consultar perguntas frequentes →</Link></div>; }
