"use client";

import { useState } from "react";
import Image from "next/image";
import { popularRoutes } from "@/lib/data/destinations";
import { useSearchForm } from "@/hooks/useSearchForm";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TiltCard from "@/components/ui/TiltCard";
import {
  Plane,
  MapPin,
  Clock,
  ArrowRight,
  Compass,
  Sparkles,
  CircleDot,
} from "lucide-react";

function RouteImage({ src, city }: { src: string; city: string }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-10 h-10 text-white/20 mx-auto mb-2" />
          <p className="text-sm text-white/40 font-semibold">{city}</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={city}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="absolute inset-0 object-cover group-hover:scale-110 transition-transform duration-700"
      onError={() => setError(true)}
    />
  );
}

export default function PopularRoutes() {
  const { handleBookDestination } = useSearchForm();
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
      {/* Floating decorative icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <Plane className="absolute -top-2 right-[10%] w-5 h-5 text-[#f97316]/10 animate-float" style={{ animationDelay: "0s" }} />
        <MapPin className="absolute top-[20%] -left-1 w-4 h-4 text-[#f97316]/8 animate-float" style={{ animationDelay: "1s" }} />
        <Compass className="absolute bottom-[10%] right-[5%] w-5 h-5 text-gray-300/40 animate-float" style={{ animationDelay: "2s" }} />
      </div>
      <ScrollReveal>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#f97316]/10 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#f97316]" />
            <span className="text-sm font-semibold text-[#f97316]">Mais procuradas</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Rotas Populares
          </h2>
          <p className="text-gray-500">As rotas mais procuradas pelos nossos viajantes</p>
        </div>
      </ScrollReveal>
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-px-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:snap-none sm:overflow-visible">
        {popularRoutes.map((dest, i) => (
          <ScrollReveal key={i} delay={i * 100}>
            <TiltCard maxTilt={10}>
              <button
                onClick={() => handleBookDestination(dest)}
                className="group w-full bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#f97316] hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 text-left active:scale-[0.98]"
              >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <RouteImage src={dest.image} city={dest.city} />
                <div className={`absolute inset-0 bg-gradient-to-t ${dest.gradient}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Tag badge */}
                {dest.tag && (
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      dest.tag === "Promoção" ? "bg-red-500 text-white" :
                      dest.tag === "Internacional" ? "bg-blue-500 text-white" :
                      dest.tag === "Mais barata" ? "bg-emerald-500 text-white" :
                      "bg-white/20 backdrop-blur-sm text-white"
                    }`}>
                      {dest.tag}
                    </span>
                  </div>
                )}

                {/* Route badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                    {dest.originCode} → {dest.destCode}
                  </span>
                </div>

                {/* City name overlay */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">{dest.city}</h3>
                  <p className="text-xs text-white/80 font-medium">{dest.country}</p>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                {/* Flight info row */}
                <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {dest.duration}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="flex items-center gap-1">
                    {dest.stops === 0 ? (
                      <>
                        <CircleDot className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-green-600 font-semibold">Direto</span>
                      </>
                    ) : (
                      <>
                        <CircleDot className="w-3.5 h-3.5" />
                        {dest.stops} {dest.stops === 1 ? "escala" : "escalas"}
                      </>
                    )}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span>{dest.tripType}</span>
                </div>

                {/* Price row */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">desde</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-[#f97316]">
                        {new Intl.NumberFormat("pt-AO").format(dest.price)}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">Kz</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-[#f97316] group-hover:text-white transition-all duration-300 group-hover:scale-110">
                    <ArrowRight className="w-5 h-5 text-[#f97316] group-hover:text-white" />
                  </div>
                </div>
              </div>
              </button>
            </TiltCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
