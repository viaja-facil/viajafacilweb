import HomeSearch from "@/components/sections/HomeSearch";
import PopularRoutes from "@/components/sections/PopularRoutes";
import FaqSection from "@/components/sections/FaqSection";
import Link from "next/link";
import { Search, Plane, CreditCard, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      <section className="bg-[#0a1628] px-4 py-6 sm:px-6 sm:py-12" aria-labelledby="home-title">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-semibold text-orange-300">A sua próxima viagem começa aqui</p>
          <h1 id="home-title" className="max-w-3xl text-2xl font-bold leading-tight text-white sm:text-5xl">Pesquise o seu próximo voo a partir de Angola</h1>
          <p className="mt-4 mb-6 max-w-2xl text-sm text-slate-300 sm:text-base">Escolha a rota e as datas. Compare horários, preços e bagagem numa só pesquisa.</p>
          <HomeSearch />
        </div>
      </section>
      <PopularRoutes />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6" aria-labelledby="steps-title">
        <h2 id="steps-title" className="text-2xl font-bold text-slate-900 sm:text-3xl">Como funciona</h2>
        <p className="mt-2 text-slate-600">Explore a jornada completa com dados de demonstração.</p>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { icon: Search, title: "Pesquise a viagem", text: "Indique aeroportos, datas e passageiros. Pode explorar uma ida com datas flexíveis." },
            { icon: Plane, title: "Compare e escolha", text: "Veja horários, bagagem e preço por passageiro. Escolha os voos e os lugares de cada trecho." },
            { icon: CreditCard, title: "Experimente a reserva", text: "Use dados fictícios para testar o pagamento e a confirmação. Não há cobrança nem emissão real." },
          ].map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <step.icon aria-hidden="true" className="mb-4 h-6 w-6 text-[var(--action)]" />
              <h3 className="font-bold text-slate-900">{index + 1}. {step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <FaqSection />
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="flex flex-col gap-5 rounded-2xl bg-orange-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-xl font-bold text-slate-900">Tem dúvidas sobre a experiência?</h2><p className="mt-2 text-slate-600">Consulte as perguntas frequentes ou conheça o projeto.</p></div>
          <Link href="/sobre" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--action)] px-5 py-3 font-semibold text-white hover:bg-[var(--action-hover)]">Conhecer a ViajaFácil <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
        </div>
      </section>
    </div>
  );
}
