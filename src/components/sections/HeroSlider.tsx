"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Plane,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Shield,
  Star,
  CreditCard,
  Sparkles,
  Compass,
  Luggage,
} from "lucide-react";
import { formatCurrency } from "@/lib/mock-data";
import { useSearchForm } from "@/hooks/useSearchForm";
import ParticleBackground from "@/components/ui/ParticleBackground";

interface FeaturedDestination {
  city: string;
  country: string;
  image: string;
  gradient: string;
  price: number;
  tripType: string;
  description: string;
  originCode: string;
  destCode: string;
}

const featuredDestinations: FeaturedDestination[] = [
  {
    city: "Benguela",
    country: "Angola",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=600&fit=crop",
    gradient: "from-blue-600 to-cyan-500",
    price: 48000,
    tripType: "Só Ida",
    description: "Praias paradisíacas e o bella Vista",
    originCode: "LAD",
    destCode: "CAB",
  },
  {
    city: "Lubango",
    country: "Angola",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=600&fit=crop",
    gradient: "from-emerald-600 to-teal-500",
    price: 135000,
    tripType: "Só Ida",
    description: "Montanhas e o Cristo Rei",
    originCode: "LAD",
    destCode: "NOV",
  },
  {
    city: "Lisboa",
    country: "Portugal",
    image: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1200&h=600&fit=crop",
    gradient: "from-amber-600 to-orange-500",
    price: 750000,
    tripType: "Só Ida",
    description: "A cidade das sete colinas",
    originCode: "LAD",
    destCode: "LIS",
  },
];

export default function HeroSlider() {
  const { handleBookDestination } = useSearchForm();
  const touchStartXRef = useRef<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        setCurrentSlide((prev) => (prev + 1) % featuredDestinations.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onFocus={() => setIsAutoPlaying(false)}
      onBlur={() => setIsAutoPlaying(true)}
      onTouchStart={(e) => {
        touchStartXRef.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartXRef.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
        touchStartXRef.current = null;
        if (Math.abs(deltaX) < 50) return;
        setIsAutoPlaying(false);
        setCurrentSlide((prev) =>
          deltaX < 0
            ? (prev + 1) % featuredDestinations.length
            : (prev - 1 + featuredDestinations.length) % featuredDestinations.length
        );
      }}
    >
      <ParticleBackground className="opacity-30" particleCount={50} />
      {/* Slider Background (only render near-active slides to avoid eager loading all images) */}
      <div className="absolute inset-0 overflow-hidden">
        {featuredDestinations.map((dest, i) => {
          const isNearActive =
            Math.abs(i - currentSlide) <= 1 ||
            Math.abs(i - currentSlide) === featuredDestinations.length - 1;
          return (
            <div
              key={i}
              aria-hidden={i !== currentSlide}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                i === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              {isNearActive && (
                <Image
                  src={dest.image}
                  alt=""
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  className="object-cover object-center"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/90 via-[#0a1628]/80 to-[#0a1628]/70" />
            </div>
          );
        })}
      </div>

      {/* Decorative blurs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#f97316] rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#f97316] rounded-full blur-3xl" />
      </div>

      {/* Floating travel icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Plane className="absolute top-[15%] right-[12%] w-8 h-8 text-white/25 animate-float" style={{ animationDelay: "0s" }} />
        <MapPin className="absolute top-[25%] left-[8%] w-6 h-6 text-[#f97316]/30 animate-float" style={{ animationDelay: "0.5s" }} />
        <Compass className="absolute bottom-[30%] right-[8%] w-7 h-7 text-white/25 animate-float" style={{ animationDelay: "1s" }} />
        <Luggage className="absolute top-[40%] left-[15%] w-5 h-5 text-[#f97316]/25 animate-float" style={{ animationDelay: "1.5s" }} />
        <Ticket className="absolute bottom-[20%] left-[20%] w-6 h-6 text-white/20 animate-float" style={{ animationDelay: "2s" }} />
        <Sparkles className="absolute top-[10%] left-[30%] w-5 h-5 text-[#f97316]/25 animate-spin-slow" />
        {/* Floating bubbles */}
        <div className="absolute top-[12%] right-[25%] w-3 h-3 bg-[#f97316]/30 rounded-full animate-float" style={{ animationDelay: "0.3s" }} />
        <div className="absolute top-[35%] right-[18%] w-2 h-2 bg-white/25 rounded-full animate-float" style={{ animationDelay: "1.2s" }} />
        <div className="absolute bottom-[35%] left-[12%] w-4 h-4 bg-[#f97316]/25 rounded-full animate-float" style={{ animationDelay: "0.7s" }} />
        <div className="absolute top-[50%] right-[6%] w-2.5 h-2.5 bg-white/20 rounded-full animate-float" style={{ animationDelay: "1.8s" }} />
        <div className="absolute bottom-[15%] right-[30%] w-3 h-3 bg-[#f97316]/20 rounded-full animate-float" style={{ animationDelay: "2.2s" }} />
      </div>

      {/* Floating glass mini-cards */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-[18%] right-[5%] glass-dark rounded-xl px-3 py-2 animate-float" style={{ animationDelay: "0.8s" }}>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-xs text-white/80 font-medium">Compra Segura</span>
          </div>
        </div>
        <div className="absolute bottom-[25%] left-[3%] glass-dark rounded-xl px-3 py-2 animate-float" style={{ animationDelay: "1.6s" }}>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-white/80 font-medium">4.8 Avaliação</span>
          </div>
        </div>
        <div className="absolute top-[35%] right-[3%] glass-dark rounded-xl px-3 py-2 animate-float" style={{ animationDelay: "2.4s" }}>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-white/80 font-medium">Pagamento Fácil</span>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-8 md:pt-20 md:pb-28">
        {/* Slider Info Bar - desktop only (mobile uses dots below) */}
        <div className="hidden md:flex items-center gap-3 mb-8">
          {featuredDestinations.map((dest, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentSlide(i);
                setIsAutoPlaying(false);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                i === currentSlide
                  ? "bg-[#f97316] text-white shadow-lg shadow-orange-500/30"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              {dest.city}
            </button>
          ))}
        </div>

        {/* Featured City Info - LEFT ALIGNED */}
        <div className="text-left mb-5 md:mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 mb-2 md:mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-300 font-medium">
              Destaque: {featuredDestinations[currentSlide].city}
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl md:text-6xl font-bold text-white mb-1.5 md:mb-3 tracking-tight">
            {featuredDestinations[currentSlide].description}
          </h1>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-gray-300">
            <span className="flex items-center gap-1.5 text-xs md:text-sm">
              <MapPin className="w-4 h-4 text-[#f97316]" />
              {featuredDestinations[currentSlide].city}, {featuredDestinations[currentSlide].country}
            </span>
            <span className="text-gray-500 hidden md:inline">•</span>
            <span className="flex items-center gap-1.5 text-xs md:text-sm">
              <Ticket className="w-4 h-4 text-[#f97316]" />
              A partir de <span className="font-bold text-[#f97316]">{formatCurrency(featuredDestinations[currentSlide].price)}</span>
            </span>
            <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs md:text-xs font-semibold">
              {featuredDestinations[currentSlide].tripType}
            </span>
          </div>

          {/* Quick book button */}
          <button
            onClick={() => handleBookDestination(featuredDestinations[currentSlide])}
            className="mt-3 md:mt-5 inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] active:bg-[#dc2626] text-white font-bold px-5 py-2.5 min-h-[44px] rounded-xl transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
          >
            <Plane className="w-5 h-5" />
            Reservar Agora
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Slider Navigation - LEFT ALIGNED (arrows desktop only, dots on mobile) */}
        <div className="flex items-center gap-3 mb-5 md:mb-10">
          <button
            onClick={() => {
              setCurrentSlide((prev) => (prev - 1 + featuredDestinations.length) % featuredDestinations.length);
              setIsAutoPlaying(false);
            }}
            aria-label="Destino anterior"
            className="hidden md:flex w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setCurrentSlide((prev) => (prev + 1) % featuredDestinations.length);
              setIsAutoPlaying(false);
            }}
            aria-label="Próximo destino"
            className="hidden md:flex w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {featuredDestinations.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentSlide(i);
                  setIsAutoPlaying(false);
                }}
                aria-label={`Ir para ${featuredDestinations[i].city}`}
                aria-current={i === currentSlide ? "true" : undefined}
                className={`tap-target flex items-center px-0 bg-transparent ${
                  i === currentSlide ? "w-8" : "w-3"
                }`}
              >
                <span
                  className={`block h-1.5 w-full rounded-full transition-all ${
                    i === currentSlide ? "bg-[#f97316]" : "bg-white/30"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
