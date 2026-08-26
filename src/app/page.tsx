"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { airports, airlines, formatCurrency } from "@/lib/mock-data";
import { useBooking } from "@/lib/booking-context";
import { useMediaQuery } from "@/lib/use-media-query";
import { useSearchForm } from "@/hooks/useSearchForm";
import HeroSlider from "@/components/sections/HeroSlider";
import SearchCard from "@/components/sections/SearchCard";
import PopularRoutes from "@/components/sections/PopularRoutes";
import Testimonials from "@/components/sections/Testimonials";
import FaqSection from "@/components/sections/FaqSection";
import FinalCTA from "@/components/sections/FinalCTA";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import AppDownload from "@/components/ui/AppDownload";
import AnswerBlock from "@/components/seo/AnswerBlock";
import { Star } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const searchForm = useSearchForm();

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div className="min-h-screen">
      <HeroSlider
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        isAutoPlaying={isAutoPlaying}
        setIsAutoPlaying={setIsAutoPlaying}
        touchStartX={touchStartX}
        handleBookDestination={searchForm.handleBookDestination}
      />

      <SearchCard {...searchForm} />

      {/* Quick stats */}
      <section className="bg-gradient-to-b from-white to-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <ScrollReveal>
            <div className="grid grid-cols-2 gap-y-8 sm:flex sm:flex-wrap sm:justify-center sm:gap-8 md:gap-16 text-center">
              <div className="group">
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  <AnimatedCounter end={airports.length} suffix="+" />
                </div>
                <div className="text-sm text-gray-500 group-hover:text-[#f97316] transition-colors">Destinos</div>
              </div>
              <div className="hidden sm:block w-px bg-gray-200" />
              <div className="group">
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  <AnimatedCounter end={airlines.length} />
                </div>
                <div className="text-sm text-gray-500 group-hover:text-[#f97316] transition-colors">Companhias</div>
              </div>
              <div className="hidden sm:block w-px bg-gray-200" />
              <div className="group">
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  <AnimatedCounter end={50} suffix="k+" />
                </div>
                <div className="text-sm text-gray-500 group-hover:text-[#f97316] transition-colors">Viajantes</div>
              </div>
              <div className="hidden sm:block w-px bg-gray-200" />
              <div className="group">
                <div className="text-4xl font-bold text-gray-900 flex items-center gap-1 justify-center mb-1">
                  <AnimatedCounter end={4} />
                  <span className="text-2xl">.</span>
                  <AnimatedCounter end={8} />
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-sm text-gray-500 group-hover:text-[#f97316] transition-colors">Avaliação</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Answer Block - SEO + GEO */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <AnswerBlock
          title="Como Comprar Passagens Aéreas em Angola"
          answer="ViajaFácil é a plataforma mais fácil para comprar passagens aéreas em Angola. Em poucos cliques, você compara preços de TAAG, TAP e Emirates, escolhe o melhor voo e reserva com confirmação instantânea. Preços a partir de 48.000 Kz para voos domésticos."
          stats={[
            { value: "10.000+", label: "Viajantes atendidos" },
            { value: "6", label: "Companhias aéreas" },
            { value: "16", label: "Aeroportos" },
            { value: "15%", label: "Economia média" },
          ]}
        />
      </section>

      <PopularRoutes onBookDestination={searchForm.handleBookDestination} />

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#f97316]/10 rounded-full px-4 py-2 mb-4">
              <span className="text-sm font-semibold text-[#f97316]">Por que nós?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Por que escolher a ViajaFácil?
            </h2>
            <p className="text-gray-500">A maneira mais inteligente de viajar</p>
          </div>
        </ScrollReveal>
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-4 sm:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-px-4 sm:grid sm:grid-cols-3 sm:snap-none sm:overflow-visible">
          {[
            { icon: "💳", title: "Melhores Preços", desc: "Comparamos preços de todas as companhias para encontrar a melhor opção para o seu bolso." },
            { icon: "🛡️", title: "Compra Segura", desc: "Seus dados estão protegidos com criptografia de ponta. Compre com confiança total." },
            { icon: "⚡", title: "Reserva Instantânea", desc: "Confirmação imediata do seu voo. Sem filas, sem burocracia, sem complicação." },
          ].map((feature, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="w-[280px] sm:w-auto shrink-0 snap-start bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="text-4xl mb-5">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <Testimonials />

      <FaqSection />

      <FinalCTA />

      {/* App Download */}
      <AppDownload />
    </div>
  );
}

function useSyncExternalStore(arg0: () => () => void, arg1: () => boolean, arg2: () => boolean) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
