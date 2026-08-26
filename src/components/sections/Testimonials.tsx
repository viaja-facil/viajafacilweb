"use client";

import { testimonials } from "@/lib/data/testimonials";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#f97316]/10 rounded-full px-4 py-2 mb-4">
              <Star className="w-4 h-4 text-[#f97316] fill-[#f97316]" />
              <span className="text-sm font-semibold text-[#f97316]">Depoimentos</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              O que dizem os nossos viajantes
            </h2>
            <p className="text-gray-500">Milhares de pessoas já viajaram com a ViajaFácil</p>
          </div>
        </ScrollReveal>
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-px-4 sm:grid sm:grid-cols-3 sm:snap-none sm:overflow-visible">
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} delay={i * 150}>
              <div
                className="w-[280px] sm:w-auto shrink-0 snap-start bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <Quote className="w-8 h-8 text-[#f97316]/20 mb-4" />
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
