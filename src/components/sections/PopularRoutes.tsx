"use client";
import Image from "next/image";
import { popularRoutes } from "@/lib/data/destinations";
import { flights, formatCurrency } from "@/lib/mock-data";
import { useQuickSearch } from "@/hooks/useQuickSearch";
import { ArrowRight } from "lucide-react";

export default function PopularRoutes() {
  const searchRoute = useQuickSearch();
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6" aria-labelledby="destinations-title">
      <h2 id="destinations-title" className="text-2xl font-bold text-slate-900 sm:text-3xl">Para onde quer viajar?</h2>
      <p className="mt-2 mb-6 text-slate-600">Explore rotas a partir de Luanda. Preços fictícios por passageiro, só ida.</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {popularRoutes.slice(0, 6).map((route) => {
          const available = flights.filter((f) => f.origin === route.originCode && f.destination === route.destCode && f.availableSeats > 0);
          const price = available.length ? Math.min(...available.map((f) => f.price)) : null;
          return (
            <button key={route.destCode} type="button" onClick={() => searchRoute(route)} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition-shadow hover:shadow-lg">
              <div className="relative h-40 bg-slate-200"><Image src={route.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" /><span className="absolute right-3 top-3 rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold text-white">{route.originCode} → {route.destCode}</span></div>
              <div className="p-5"><h3 className="text-lg font-bold text-slate-900">{route.city}</h3><p className="mt-1 text-sm text-slate-600">{route.country} · {route.duration}</p>
                <p className="mt-4 text-xs text-slate-600">Desde · simulado</p><p className="text-xl font-bold text-[var(--action)]">{price === null ? "Consultar datas" : formatCurrency(price)}</p>
                <span className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--action)]">Ver voos para {route.city}<ArrowRight aria-hidden="true" className="h-4 w-4" /></span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
