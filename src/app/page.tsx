"use client";

import { useState, useMemo, useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { airports, airlines, getAvailabilityForRoute, formatCurrency } from "@/lib/mock-data";
import { useBooking } from "@/lib/booking-context";
import { useMediaQuery } from "@/lib/use-media-query";
import AvailabilityCalendar from "@/components/ui/AvailabilityCalendar";
import PassengerSelect from "@/components/ui/PassengerSelect";
import DateRangePicker from "@/components/ui/DateRangePicker";
import CustomSelect from "@/components/ui/CustomSelect";
import BottomSheet from "@/components/ui/BottomSheet";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import TiltCard from "@/components/ui/TiltCard";
import GradientButton from "@/components/ui/GradientButton";
import ParticleBackground from "@/components/ui/ParticleBackground";
import PriceAlert from "@/components/ui/PriceAlert";
import AppDownload from "@/components/ui/AppDownload";
import {
  Plane,
  Calendar,
  ArrowRight,
  Search,
  Shield,
  Clock,
  CreditCard,
  Star,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Ticket,
  ArrowLeftRight,
  Quote,
  ChevronDown,
  Phone,
  CircleDot,
  Sparkles,
  Zap,
} from "lucide-react";

// Featured destinations for slider (domestic + international)
const featuredDestinations = [
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

// Rotas populares
const popularRoutes = [
  {
    city: "Benguela",
    country: "Angola",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    gradient: "from-blue-600/30 to-cyan-500/10",
    price: 48000,
    tripType: "Só Ida",
    description: "Praias paradisíacas",
    originCode: "LAD",
    destCode: "CAB",
    duration: "1h 30min",
    stops: 0,
    tag: "Mais procurada",
  },
  {
    city: "Lubango",
    country: "Angola",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    gradient: "from-emerald-600/30 to-teal-500/10",
    price: 135000,
    tripType: "Só Ida",
    description: "Montanhas e Cristo Rei",
    originCode: "LAD",
    destCode: "NOV",
    duration: "1h 30min",
    stops: 0,
    tag: "Natureza",
  },
  {
    city: "Namibe",
    country: "Angola",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&h=400&fit=crop",
    gradient: "from-rose-600/30 to-pink-500/10",
    price: 147500,
    tripType: "Só Ida",
    description: "Deserto e costas",
    originCode: "LAD",
    destCode: "NRC",
    duration: "1h 45min",
    stops: 0,
    tag: "Praia",
  },
  {
    city: "Malanje",
    country: "Angola",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=400&fit=crop",
    gradient: "from-green-600/30 to-lime-500/10",
    price: 52000,
    tripType: "Só Ida",
    description: "Quedas de Kalandula",
    originCode: "LAD",
    destCode: "MEG",
    duration: "1h 15min",
    stops: 0,
    tag: "Promoção",
  },
  {
    city: "Saurimo",
    country: "Angola",
    image: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=600&h=400&fit=crop",
    gradient: "from-yellow-600/30 to-amber-500/10",
    price: 120000,
    tripType: "Só Ida",
    description: "Pedras e savana",
    originCode: "LAD",
    destCode: "VHC",
    duration: "2h 00min",
    stops: 0,
    tag: "",
  },
  {
    city: "Lisboa",
    country: "Portugal",
    image: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&h=400&fit=crop",
    gradient: "from-amber-600/30 to-orange-500/10",
    price: 750000,
    tripType: "Só Ida",
    description: "A cidade das sete colinas",
    originCode: "LAD",
    destCode: "LIS",
    duration: "6h 30min",
    stops: 0,
    tag: "Internacional",
  },
  {
    city: "Dubai",
    country: "Emirados Árabes",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
    gradient: "from-sky-600/30 to-blue-500/10",
    price: 520000,
    tripType: "Só Ida",
    description: "Luxo e inovação",
    originCode: "LAD",
    destCode: "DXB",
    duration: "7h 45min",
    stops: 0,
    tag: "Internacional",
  },
  {
    city: "Joanesburgo",
    country: "África do Sul",
    image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&h=400&fit=crop",
    gradient: "from-violet-600/30 to-purple-500/10",
    price: 320000,
    tripType: "Só Ida",
    description: "A cidade do ouro",
    originCode: "LAD",
    destCode: "JNB",
    duration: "4h 15min",
    stops: 0,
    tag: "Mais barata",
  },
  {
    city: "São Paulo",
    country: "Brasil",
    image: "https://images.unsplash.com/photo-1670551940813-93e95ea02214?w=600&h=400&fit=crop",
    gradient: "from-teal-600/30 to-emerald-500/10",
    price: 362000,
    tripType: "Só Ida",
    description: "A cidade que não para",
    originCode: "LAD",
    destCode: "GRU",
    duration: "8h 00min",
    stops: 0,
    tag: "Internacional",
  },
];

// Depoimentos / Testimonials
const testimonials = [
  {
    name: "Maria José",
    role: "Viajante frequente",
    avatar: "https://i.pravatar.cc/150?img=47",
    text: "Comprei a minha passagem em menos de 2 minutos. Preço melhor do que em qualquer agência. Recomendo!",
    rating: 5,
  },
  {
    name: "Carlos Silva",
    role: "Empresário",
    avatar: "https://i.pravatar.cc/150?img=12",
    text: "Uso a ViajaFácil para todas as minhas viagens de trabalho. A comparação de preços é incrível.",
    rating: 5,
  },
  {
    name: "Ana Fernandes",
    role: "Estudante",
    avatar: "https://i.pravatar.cc/150?img=32",
    text: "Finalmente uma plataforma angolana que funciona! Consegui ir a Benguela com um preço muito bom.",
    rating: 5,
  },
];

// FAQ items
const faqItems = [
  {
    question: "Como posso comprar minha passagem?",
    answer: "Basta selecionar a origem, destino, datas e número de passageiros. Em seguida, escolha o voo ideal e finalize a compra com cartão de crédito ou débito.",
  },
  {
    question: "Posso cancelar ou alterar minha reserva?",
    answer: "Sim! Acesse a seção 'Minhas Reservas' com o seu e-mail de cadastro. Alterações e cancelamentos seguem a política da companhia aérea escolhida.",
  },
  {
    question: "A ViajaFácil cobra taxa de serviço?",
    answer: "Não. A ViajaFácil não cobra nenhuma taxa adicional. Você paga apenas o valor da passagem exibido na busca.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: "Aceitamos Multicaixa Express (pagamento pelo telemóvel) e Referência Bancária (pagamento via ATM Multicaixa, aplicação bancária ou agência). O pagamento é processado de forma 100% segura.",
  },
  {
    question: "Recebo minha passagem por e-mail?",
    answer: "Sim. Após a confirmação do pagamento, você recebe o bilhete eletrônico no e-mail cadastrado. Também pode acessá-lo a qualquer momento na sua conta.",
  },
  {
    question: "A ViajaFácil trabalha com quais companhias aéreas?",
    answer: "Trabalhamos com as principais companhias aéreas que voam em Angola, incluindo TAAG, flySafair e outras parceiras. A disponibilidade depende da rota e data.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { setPassengerCount } = useBooking();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<string | null>(null);
  const [departureDate, setDepartureDate] = useState<string | null>(null);
  const [returnDate, setReturnDate] = useState<string | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const passengers = adults + children;
  const [tripType, setTripType] = useState<"oneway" | "roundtrip" | "multicity">("oneway");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isMobile = useMediaQuery("(max-width: 767px)");
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const dateRangeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const availability = useMemo(() => {
    if (!origin || !destination) return [];
    return getAvailabilityForRoute(origin, destination);
  }, [origin, destination]);

  const hasRouteSelected = origin && destination && origin !== destination;

  const handleDateSelect = useCallback((selectedDate: string) => {
    setDate(selectedDate);
    setShowCalendar(false);
  }, []);

  const handleDepartureSelect = useCallback((selectedDate: string) => {
    setDepartureDate(selectedDate);
  }, []);

  const handleReturnSelect = useCallback((selectedDate: string) => {
    setReturnDate(selectedDate);
  }, []);

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredDestinations.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Close calendar on click/touch outside (works for both the desktop popover
  // and the mobile bottom sheet, which live in separate portals)
  useEffect(() => {
    if (!showCalendar && !showDateRange) return;
    const handlePointerDown = (e: Event) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const inCalendar = !!target.closest("[data-calendar-root]");
      const inDateRange = !!target.closest("[data-daterange-root]");
      const inDateButton = !!dateButtonRef.current?.contains(target);
      const inDateRangeButton = !!dateRangeButtonRef.current?.contains(target);
      if (showCalendar && !inCalendar && !inDateButton) {
        setShowCalendar(false);
      }
      if (showDateRange && !inDateRange && !inDateRangeButton) {
        setShowDateRange(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [showCalendar, showDateRange]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPassengerCount(passengers);
    const params = new URLSearchParams();
    if (origin) params.set("origin", origin);
    if (destination) params.set("destination", destination);

    if (tripType === "roundtrip") {
      if (departureDate) params.set("departureDate", departureDate);
      if (returnDate) params.set("returnDate", returnDate);
    } else {
      if (date) params.set("date", date);
    }

    params.set("passengers", passengers.toString());
    params.set("adults", adults.toString());
    params.set("children", children.toString());
    params.set("tripType", tripType);
    router.push(`/search?${params.toString()}`);
  };

  const handleBookDestination = (dest: typeof featuredDestinations[0]) => {
    setPassengerCount(1);
    const params = new URLSearchParams({
      origin: dest.originCode,
      destination: dest.destCode,
      passengers: "1",
      tripType: "oneway",
    });
    router.push(`/search?${params.toString()}`);
  };

  const formatDateDisplay = (dateStr: string) => {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-AO", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slider */}
      <section
        className="relative overflow-hidden"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const deltaX = e.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(deltaX) < 50) return;
          setIsAutoPlaying(false);
          setCurrentSlide((prev) =>
            deltaX < 0
              ? (prev + 1) % featuredDestinations.length
              : (prev - 1 + featuredDestinations.length) % featuredDestinations.length
          );
        }}
      >
        <ParticleBackground className="opacity-30" />
        {/* Slider Background */}
        <div className="absolute inset-0 overflow-hidden">
          {featuredDestinations.map((dest, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                i === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${dest.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/90 via-[#0a1628]/80 to-[#0a1628]/70" />
            </div>
          ))}
        </div>

        {/* Decorative blurs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#f97316] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#f97316] rounded-full blur-3xl" />
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
              <span className="px-2 py-0.5 bg-white/10 rounded-full text-[10px] md:text-xs font-semibold">
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
              className="hidden md:flex w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setCurrentSlide((prev) => (prev + 1) % featuredDestinations.length);
                setIsAutoPlaying(false);
              }}
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

          {/* Search Card */}
          <div className="w-full relative">
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-4">
              {/* Trip type - Segmented control */}
              <div className="p-3 pt-3 md:p-5 md:pb-2">
                <div
                  role="radiogroup"
                  aria-label="Tipo de viagem"
                  className="grid grid-cols-3 gap-1 bg-gray-100 rounded-xl p-1 md:inline-flex md:gap-0"
                >
                  {[
                    { value: "oneway" as const, label: "Só Ida", icon: Plane },
                    { value: "roundtrip" as const, label: "Ida e Volta", icon: ArrowRight },
                    { value: "multicity" as const, label: "Multi-Cidade", icon: MapPin },
                  ].map((option) => {
                    const selected = tripType === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`flex items-center justify-center gap-1.5 cursor-pointer select-none min-h-[44px] rounded-lg px-1 transition-all active:scale-[0.97] ${
                          selected
                            ? "bg-[#f97316] text-white shadow-md shadow-orange-500/25"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="tripType"
                          value={option.value}
                          checked={selected}
                          onChange={() => {
                            setTripType(option.value);
                            if (option.value !== "roundtrip") {
                              setDepartureDate(null);
                              setReturnDate(null);
                              setShowDateRange(false);
                            }
                            if (option.value !== "oneway") {
                              setDate(null);
                              setShowCalendar(false);
                            }
                          }}
                          className="sr-only"
                        />
                        <option.icon className={`w-4 h-4 shrink-0 ${
                          selected ? "text-white" : "text-gray-400"
                        }`} />
                        <span className={`text-xs md:text-sm font-semibold whitespace-nowrap`}>
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSearch} className="px-4 pb-4 pt-1 md:p-5 md:pt-3">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-end">
                  {/* Origin */}
                  <div className="md:col-span-3 relative">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block px-1">
                      De onde?
                    </label>
                    <CustomSelect
                        value={origin}
                        onChange={(nextOrigin) => {
                          setOrigin(nextOrigin);
                          setDate(null);
                          setDepartureDate(null);
                          setReturnDate(null);
                        }}
                        placeholder="Selecionar aeroporto"
                        ariaLabel="Aeroporto de origem"
                        leadingIcon={<MapPin className="h-5 w-5" />}
                        buttonClassName="py-[1.1rem]"
                        options={[
                          { value: "", label: "Selecionar aeroporto" },
                          ...airports.map((airport) => ({
                            value: airport.code,
                            label: `${airport.city} (${airport.code})`,
                          })),
                        ]}
                      />
                  </div>

                  {/* Destination */}
                  <div className="md:col-span-3 relative">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block px-1">
                      Para onde?
                    </label>
                    <CustomSelect
                        value={destination}
                        onChange={(nextDestination) => {
                          setDestination(nextDestination);
                          setDate(null);
                          setDepartureDate(null);
                          setReturnDate(null);
                        }}
                        placeholder="Selecionar aeroporto"
                        ariaLabel="Aeroporto de destino"
                        leadingIcon={<MapPin className="h-5 w-5 text-[#f97316]" />}
                        buttonClassName="py-[1.1rem]"
                        options={[
                          { value: "", label: "Selecionar aeroporto" },
                          ...airports.map((airport) => ({
                            value: airport.code,
                            label: `${airport.city} (${airport.code})`,
                          })),
                        ]}
                      />
                  </div>

                  {/* Date with Calendar */}
                  {tripType === "roundtrip" ? (
                    <div className="md:col-span-4 relative">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block px-1">
                        Datas
                      </label>
                      <button
                        ref={dateRangeButtonRef}
                        type="button"
                        onClick={() => {
                          if (hasRouteSelected) {
                            setShowDateRange(!showDateRange);
                            setShowCalendar(false);
                          }
                        }}
                        disabled={!hasRouteSelected}
                        className={`w-full flex items-center gap-2 px-4 py-[1.1rem] border rounded-xl text-sm font-medium transition-all ${
                          !hasRouteSelected
                            ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                            : departureDate || returnDate
                            ? "bg-orange-50 border-[#f97316] text-[#f97316]"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:border-[#f97316]"
                        }`}
                      >
                        <ArrowLeftRight className="w-5 h-5 shrink-0" />
                        <span className="truncate">
                          {departureDate && returnDate
                            ? `${formatDateDisplay(departureDate)} → ${formatDateDisplay(returnDate)}`
                            : departureDate
                            ? `${formatDateDisplay(departureDate)} → Sel. volta`
                            : "Selecionar datas"}
                        </span>
                        {(departureDate || returnDate) && (
                          <span
                            role="button"
                            tabIndex={0}
                            aria-label="Limpar datas"
                            className="p-2 -m-2 shrink-0 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDepartureDate(null);
                              setReturnDate(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.stopPropagation();
                                setDepartureDate(null);
                                setReturnDate(null);
                              }
                            }}
                          >
                            <X className="w-4 h-4" />
                          </span>
                        )}
                      </button>

                      {/* Date Range: popover (desktop) / bottom sheet (mobile) */}
                      {showDateRange && hasRouteSelected && mounted && !isMobile && createPortal(
                        <div
                          data-daterange-root
                          className="fixed left-0 w-[640px] animate-slide-up z-50"
                        >
                          <DateRangePicker
                            availability={availability}
                            departureDate={departureDate}
                            returnDate={returnDate}
                            onDepartureSelect={handleDepartureSelect}
                            onReturnSelect={handleReturnSelect}
                            onClose={() => setShowDateRange(false)}
                          />
                        </div>,
                        document.body
                      )}
                      {showDateRange && hasRouteSelected && mounted && isMobile && createPortal(
                        <BottomSheet
                          open={showDateRange}
                          onClose={() => setShowDateRange(false)}
                          title="Selecionar datas"
                          subtitle="Escolha a ida e a volta"
                        >
                          <DateRangePicker
                            availability={availability}
                            departureDate={departureDate}
                            returnDate={returnDate}
                            onDepartureSelect={handleDepartureSelect}
                            onReturnSelect={handleReturnSelect}
                            onClose={() => setShowDateRange(false)}
                          />
                        </BottomSheet>,
                        document.body
                      )}
                    </div>
                  ) : (
                    <div className="md:col-span-2 relative">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block px-1">
                        Data
                      </label>
                      <button
                        ref={dateButtonRef}
                        type="button"
                        onClick={() => {
                          if (hasRouteSelected) {
                            setShowCalendar(!showCalendar);
                            setShowDateRange(false);
                          }
                        }}
                        disabled={!hasRouteSelected}
                        className={`w-full flex items-center gap-2 px-4 py-[1.1rem] border rounded-xl text-sm font-medium transition-all ${
                          !hasRouteSelected
                            ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                            : date
                            ? "bg-orange-50 border-[#f97316] text-[#f97316]"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:border-[#f97316]"
                        }`}
                      >
                        <Calendar className="w-5 h-5 shrink-0" />
                        <span className="truncate">
                          {date ? formatDateDisplay(date) : "Selecionar"}
                        </span>
                        {date && (
                          <span
                            role="button"
                            tabIndex={0}
                            aria-label="Limpar data"
                            className="ml-auto p-2 -m-2 shrink-0 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDate(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.stopPropagation();
                                setDate(null);
                              }
                            }}
                          >
                            <X className="w-4 h-4" />
                          </span>
                        )}
                      </button>

                      {/* Calendar: popover (desktop) / bottom sheet (mobile) */}
                      {showCalendar && hasRouteSelected && mounted && !isMobile && createPortal(
                        <div
                          data-calendar-root
                          className="fixed left-0 w-[320px] animate-slide-up z-50"
                        >
                          <AvailabilityCalendar
                            availability={availability}
                            selectedDate={date}
                            onDateSelect={handleDateSelect}
                          />
                        </div>,
                        document.body
                      )}
                      {showCalendar && hasRouteSelected && mounted && isMobile && createPortal(
                        <BottomSheet
                          open={showCalendar}
                          onClose={() => setShowCalendar(false)}
                          title="Selecionar data"
                          subtitle="Toque num dia para ver os melhores preços"
                        >
                          <AvailabilityCalendar
                            availability={availability}
                            selectedDate={date}
                            onDateSelect={handleDateSelect}
                          />
                        </BottomSheet>,
                        document.body
                      )}
                    </div>
                  )}

                  {/* Passengers: adults + children */}
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block px-1">
                      Passageiros
                    </label>
                    <PassengerSelect
                      adults={adults}
                      childrenCount={children}
                      onChange={(next) => {
                        setAdults(next.adults);
                        setChildren(next.childrenCount);
                      }}
                    />
                  </div>

                  {/* Search Button */}
                  <div className="md:col-span-2">
                    <span className="hidden md:block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-1 invisible">
                      &nbsp;
                    </span>
                    <button
                      type="submit"
                      className="w-full min-h-[48px] py-[1.1rem] bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center justify-center gap-2 text-sm active:from-[#dc2626] active:to-[#dc2626] active:scale-[0.98]"
                    >
                      <Search className="w-5 h-5" />
                      Buscar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

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

      {/* Popular Routes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
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
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
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
                  <span className="px-2.5 py-1 bg-black/30 backdrop-blur-sm rounded-full text-[10px] font-semibold text-white">
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
                    <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">desde</span>
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

      {/* Partners */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-8">
            Companhias Aéreas Parceiras
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {airlines.map((airline) => (
              <div key={airline.id} className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{airline.logo}</span>
                <span className="text-sm font-semibold text-gray-700">{airline.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#f97316]/10 rounded-full px-4 py-2 mb-4">
              <Zap className="w-4 h-4 text-[#f97316]" />
              <span className="text-sm font-semibold text-[#f97316]">Por que nós?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Por que escolher a ViajaFácil?
            </h2>
            <p className="text-gray-500">A maneira mais inteligente de viajar</p>
          </div>
        </ScrollReveal>
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-4 sm:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-px-4 sm:grid sm:grid-cols-3 sm:snap-none sm:overflow-visible">
          <ScrollReveal delay={0}>
            <div className="w-[280px] sm:w-auto shrink-0 snap-start bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Melhores Preços</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Comparamos preços de todas as companhias para encontrar a melhor opção para o seu bolso.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="w-[280px] sm:w-auto shrink-0 snap-start bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Compra Segura</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Seus dados estão protegidos com criptografia de ponta. Compre com confiança total.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="w-[280px] sm:w-auto shrink-0 snap-start bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reserva Instantânea</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Confirmação imediata do seu voo. Sem filas, sem burocracia, sem complicação.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
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

      {/* Price Alert Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <ScrollReveal>
          <PriceAlert />
        </ScrollReveal>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <ScrollReveal>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#f97316]/10 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-[#f97316]" />
              <span className="text-sm font-semibold text-[#f97316]">Dúvidas?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Perguntas Frequentes
            </h2>
            <p className="text-gray-500">Tudo o que precisa de saber antes de viajar</p>
          </div>
        </ScrollReveal>
        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <FaqItem question={item.question} answer={item.answer} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* App Download Section */}
      <AppDownload />

      {/* CTA Final */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <ScrollReveal>
          <div className="bg-gradient-to-br from-[#0a1628] to-[#162544] rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <ParticleBackground className="opacity-20" particleCount={30} />
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316] rounded-full blur-3xl animate-float" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#f97316] rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
            </div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Pronto para viajar?
                </h2>
                <p className="text-gray-400 max-w-md text-lg">
                  Comece agora a planear a sua próxima viagem. É rápido, fácil e seguro.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <GradientButton
                  onClick={() => router.push("/search")}
                  icon={<Search className="w-5 h-5" />}
                  size="lg"
                >
                  Explorar Voos
                </GradientButton>
                <a
                  href="https://wa.me/244923456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 whitespace-nowrap backdrop-blur-sm border border-white/10"
                >
                  <Phone className="w-5 h-5" />
                  Fale Connosco
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

// Image with fallback for routes
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
    <img
      src={src}
      alt={city}
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      onError={() => setError(true)}
    />
  );
}

// FAQ Accordion Item
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [answer]);

  return (
    <div className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
      open ? "border-[#f97316]/30 shadow-lg shadow-orange-500/10" : "border-gray-200 hover:border-gray-300"
    }`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left group"
      >
        <span className={`text-sm font-semibold pr-4 transition-colors ${
          open ? "text-[#f97316]" : "text-gray-900 group-hover:text-[#f97316]"
        }`}>{question}</span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 transition-all duration-300 ${
            open ? "rotate-180 text-[#f97316]" : "text-gray-400 group-hover:text-[#f97316]"
          }`}
        />
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? `${contentHeight}px` : "0" }}
      >
        <div className="px-5 pb-4">
          <p className="text-sm text-gray-500 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}
