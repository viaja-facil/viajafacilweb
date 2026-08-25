"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  flights,
  airports,
  airlines,
  getAirlineById,
  getAirportByCode,
  formatCurrency,
  getAvailabilityForRoute,
  Flight,
} from "@/lib/mock-data";
import { useBooking } from "@/lib/booking-context";
import AvailabilityCalendar from "@/components/ui/AvailabilityCalendar";
import { SkeletonFlight } from "@/components/ui/Skeleton";
import CollapsibleFilter from "@/components/ui/CollapsibleFilter";
import CustomSelect from "@/components/ui/CustomSelect";
import BottomSheet from "@/components/ui/BottomSheet";
import {
  Plane,
  ArrowRight,
  SlidersHorizontal,
  ArrowLeft,
  Users,
  Calendar,
  MapPin,
  Wifi,
  Coffee,
  Luggage,
  X,
  Sun,
  Moon,
  Sunset,
  Clock,
} from "lucide-react";

type SortBy = "price" | "duration" | "departure";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setFlight, setPassengerCount } = useBooking();

  const initialOrigin = searchParams.get("origin") || "";
  const initialDestination = searchParams.get("destination") || "";
  const initialDate = searchParams.get("date") || "";
  const initialPassengers = parseInt(searchParams.get("passengers") || "1");
  const initialAdults = parseInt(searchParams.get("adults") || "");
  const initialChildren = parseInt(searchParams.get("children") || "");

  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate || null);
  const [passengers, setPassengers] = useState(initialPassengers);
  const adults = Number.isNaN(initialAdults) ? initialPassengers : initialAdults;
  const children = Number.isNaN(initialChildren) ? 0 : initialChildren;
  const [sortBy, setSortBy] = useState<SortBy>("price");
  const [maxPrice, setMaxPrice] = useState(200000);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const availability = useMemo(() => {
    if (!origin || !destination) return [];
    return getAvailabilityForRoute(origin, destination);
  }, [origin, destination]);

  const filteredFlights = useMemo(() => {
    const result = flights.filter((f) => {
      if (origin && f.origin !== origin) return false;
      if (destination && f.destination !== destination) return false;
      if (selectedDate && !f.departureTime.startsWith(selectedDate)) return false;
      if (f.price > maxPrice) return false;
      if (selectedClass !== "all" && f.class !== selectedClass) return false;
      if (selectedAirlines.length > 0 && !selectedAirlines.includes(f.airlineId)) return false;
      if (selectedTimeOfDay.length > 0) {
        const hour = new Date(f.departureTime).getHours();
        const timeSlot =
          hour >= 6 && hour < 12
            ? "morning"
            : hour >= 12 && hour < 18
            ? "afternoon"
            : hour >= 18 && hour < 22
            ? "evening"
            : "night";
        if (!selectedTimeOfDay.includes(timeSlot)) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "duration":
          return a.duration.localeCompare(b.duration);
        case "departure":
          return a.departureTime.localeCompare(b.departureTime);
        default:
          return 0;
      }
    });

    return result;
  }, [origin, destination, selectedDate, sortBy, maxPrice, selectedClass, selectedAirlines, selectedTimeOfDay]);

  const handleSelectFlight = (flight: Flight) => {
    setPassengerCount(passengers);
    setFlight(flight);
    router.push(`/booking/seats?flightId=${flight.id}`);
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-AO", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const getOriginCity = () => airports.find((a) => a.code === origin)?.city || "Todos";
  const getDestCity = () => airports.find((a) => a.code === destination)?.city || "Todos";

  const hasRoute = origin && destination && origin !== destination;

  const toggleAirline = (id: string) => {
    setSelectedAirlines((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const toggleTimeOfDay = (slot: string) => {
    setSelectedTimeOfDay((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const activeFilterCount =
    selectedAirlines.length +
    selectedTimeOfDay.length +
    (selectedClass !== "all" ? 1 : 0) +
    (maxPrice < 200000 ? 1 : 0);

  const clearFilters = () => {
    setSelectedDate(null);
    setSelectedClass("all");
    setMaxPrice(200000);
    setSortBy("price");
    setSelectedAirlines([]);
    setSelectedTimeOfDay([]);
  };

  // Filter controls shared between the desktop sidebar and the mobile bottom sheet
  const filtersBody = (
    <>
      <CollapsibleFilter title="Ordenar por" defaultOpen={true}>
        <CustomSelect
          value={sortBy}
          onChange={(nextSort) => setSortBy(nextSort as SortBy)}
          ariaLabel="Ordenar voos por"
          options={[
            { value: "price", label: "Menor Preço" },
            { value: "duration", label: "Mais Rápido" },
            { value: "departure", label: "Partida" },
          ]}
        />
      </CollapsibleFilter>

      <CollapsibleFilter
        title="Preço"
        defaultOpen={true}
        badge={maxPrice < 200000 ? formatCurrency(maxPrice) : undefined}
      >
        <input
          type="range"
          min="20000"
          max="200000"
          step="5000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#f97316]"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>20.000 Kz</span>
          <span>{formatCurrency(maxPrice)}</span>
          <span>200.000 Kz</span>
        </div>
      </CollapsibleFilter>

      <CollapsibleFilter
        title="Classe"
        defaultOpen={true}
        badge={selectedClass !== "all" ? selectedClass === "economy" ? "Eco" : selectedClass === "business" ? "Bus" : "1ª" : undefined}
      >
        <div className="flex flex-wrap gap-2">
          {["all", "economy", "business", "first"].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-2 min-h-[36px] rounded-lg text-xs font-medium border transition-colors ${
                selectedClass === cls
                  ? "bg-[#0a1628] border-[#0a1628] text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 active:border-[#f97316]"
              }`}
            >
              {cls === "all" ? "Todas" : cls === "economy" ? "Económica" : cls === "business" ? "Business" : "Primeira"}
            </button>
          ))}
        </div>
      </CollapsibleFilter>

      <CollapsibleFilter
        title="Companhia Aérea"
        defaultOpen={false}
        badge={selectedAirlines.length > 0 ? `${selectedAirlines.length}` : undefined}
      >
        <div className="space-y-1">
          {airlines.map((airline) => (
            <label
              key={airline.id}
              className="flex items-center gap-3 cursor-pointer group select-none py-1.5 min-h-[44px]"
            >
              <input
                type="checkbox"
                checked={selectedAirlines.includes(airline.id)}
                onChange={() => toggleAirline(airline.id)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                selectedAirlines.includes(airline.id)
                  ? "border-[#f97316] bg-[#f97316]"
                  : "border-gray-300 group-hover:border-gray-400"
              }`}>
                {selectedAirlines.includes(airline.id) && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded flex items-center justify-center text-xs text-white"
                  style={{ backgroundColor: airline.color }}
                >
                  {airline.logo}
                </span>
                <span className="text-sm text-gray-700">{airline.name}</span>
              </div>
            </label>
          ))}
        </div>
      </CollapsibleFilter>

      <CollapsibleFilter
        title="Hora de Partida"
        defaultOpen={false}
        badge={selectedTimeOfDay.length > 0 ? `${selectedTimeOfDay.length}` : undefined}
      >
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "morning", label: "Manhã", icon: Sun, time: "06h - 12h" },
            { id: "afternoon", label: "Tarde", icon: Sunset, time: "12h - 18h" },
            { id: "evening", label: "Noite", icon: Clock, time: "18h - 22h" },
            { id: "night", label: "Madrugada", icon: Moon, time: "22h - 06h" },
          ].map((slot) => (
            <button
              key={slot.id}
              onClick={() => toggleTimeOfDay(slot.id)}
              className={`flex flex-col items-center gap-1 p-2.5 min-h-[64px] rounded-xl border text-xs transition-all ${
                selectedTimeOfDay.includes(slot.id)
                  ? "bg-[#0a1628] border-[#0a1628] text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-[#f97316]"
              }`}
            >
              <slot.icon className="w-4 h-4" />
              <span className="font-semibold">{slot.label}</span>
              <span className={`text-[10px] ${
                selectedTimeOfDay.includes(slot.id) ? "text-gray-300" : "text-gray-400"
              }`}>{slot.time}</span>
            </button>
          ))}
        </div>
      </CollapsibleFilter>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#162544] text-white">
      {/* Mobile sticky filter/sort bar */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/95 backdrop-blur border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 min-h-[40px] px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 active:border-[#f97316] active:text-[#f97316] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#f97316]" />
            Filtrar e ordenar
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 bg-[#f97316] text-white text-[10px] font-bold rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-gray-400 hover:text-[#f97316]"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <MapPin className="w-4 h-4 text-[#f97316]" />
              <span className="font-semibold">{getOriginCity()}</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
              <span className="font-semibold">{getDestCity()}</span>
            </div>
            {selectedDate && (
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <Calendar className="w-4 h-4 text-[#f97316]" />
                <span>{formatDate(selectedDate)}</span>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="ml-1 text-gray-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <Users className="w-4 h-4 text-[#f97316]" />
              <span>
                {children > 0
                  ? `${adults} ${adults === 1 ? "adulto" : "adultos"} • ${children} ${children === 1 ? "criança" : "crianças"}`
                  : `${passengers} ${passengers === 1 ? "passageiro" : "passageiros"}`}
              </span>
            </div>
            <span className="text-gray-400 ml-auto">
              {filteredFlights.length} voos encontrados
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - desktop only (mobile uses the filter bottom sheet) */}
          <div className="hidden lg:block lg:w-80 shrink-0 space-y-4">
            {/* Calendar */}
            {hasRoute && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#f97316]" />
                  Selecionar Data
                </h3>
                <AvailabilityCalendar
                  availability={availability}
                  selectedDate={selectedDate}
                  onDateSelect={(date) => {
                    setSelectedDate(date);
                  }}
                />
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-200 px-5">
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#f97316]" />
                  Filtros
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#f97316] hover:text-[#ea580c] font-semibold"
                >
                  Limpar
                </button>
              </div>

              {filtersBody}
            </div>
          </div>

          {/* Right - Flight results */}
          <div className="flex-1 min-w-0">
            {/* Date quick chips */}
            {hasRoute && (
              <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setSelectedDate(null)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                    !selectedDate
                      ? "bg-[#f97316] text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-[#f97316]"
                  }`}
                >
                  Todas as datas
                </button>
                {availability
                  .filter((a) => a.hasFlights)
                  .slice(0, 14)
                  .map((a) => (
                    <button
                      key={a.date}
                      onClick={() => setSelectedDate(a.date)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                        selectedDate === a.date
                          ? "bg-[#f97316] text-white"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-[#f97316]"
                      }`}
                    >
                      {new Date(a.date + "T12:00:00").toLocaleDateString("pt-AO", {
                        day: "numeric",
                        month: "short",
                      })}
                      <span className="ml-1 opacity-70">{a.flightCount}v</span>
                    </button>
                  ))}
              </div>
            )}

            {/* Flight cards */}
            <div className="space-y-4">
              {isLoading ? (
                <>
                  <SkeletonFlight />
                  <SkeletonFlight />
                  <SkeletonFlight />
                </>
              ) : filteredFlights.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                  <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum voo encontrado
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Tente alterar os filtros ou selecionar outra data.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedDate(null);
                      setSelectedClass("all");
                      setMaxPrice(200000);
                    }}
                    className="text-sm font-semibold text-[#f97316] hover:text-[#ea580c]"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                filteredFlights.map((flight) => {
                  const airline = getAirlineById(flight.airlineId);
                  const originAirport = getAirportByCode(flight.origin);
                  const destAirport = getAirportByCode(flight.destination);
                  const flightDate = new Date(flight.departureTime);

                  return (
                    <div
                      key={flight.id}
                      onClick={() => handleSelectFlight(flight)}
                      className="bg-white rounded-2xl border border-gray-200 hover:border-[#f97316] hover:shadow-lg hover:shadow-orange-500/10 transition-all group cursor-pointer active:scale-[0.99]"
                    >
                      <div className="p-5">
                        {/* Date header for first flight of each day */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-bold text-gray-400">
                            {flightDate.toLocaleDateString("pt-AO", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                          <div className="flex-1 h-px bg-gray-100" />
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              flight.class === "economy"
                                ? "bg-blue-50 text-blue-600"
                                : flight.class === "business"
                                ? "bg-purple-50 text-purple-600"
                                : "bg-yellow-50 text-yellow-600"
                            }`}
                          >
                            {flight.class === "economy" ? "Económica" : flight.class === "business" ? "Business" : "Primeira"}
                          </span>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          {/* Airline info */}
                          <div className="flex items-center gap-3 lg:w-44">
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0"
                              style={{ backgroundColor: airline?.color || "#666" }}
                            >
                              {airline?.logo || <Plane className="w-5 h-5 text-gray-400" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{airline?.name}</p>
                              <p className="text-xs text-gray-500">{flight.flightNumber}</p>
                            </div>
                          </div>

                          {/* Flight times */}
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-center w-16">
                              <p className="text-xl font-bold text-gray-900">
                                {formatTime(flight.departureTime)}
                              </p>
                              <p className="text-xs text-gray-500">{flight.origin}</p>
                            </div>

                            <div className="flex-1 flex items-center gap-1 px-2">
                              <div className="flex-1 h-px bg-gray-200" />
                              <div className="flex flex-col items-center px-2">
                                <Plane className="w-4 h-4 text-[#f97316] -rotate-45" />
                                <p className="text-[10px] text-gray-500 mt-0.5">{flight.duration}</p>
                              </div>
                              <div className="flex-1 h-px bg-gray-200" />
                            </div>

                            <div className="text-center w-16">
                              <p className="text-xl font-bold text-gray-900">
                                {formatTime(flight.arrivalTime)}
                              </p>
                              <p className="text-xs text-gray-500">{flight.destination}</p>
                            </div>
                          </div>

                          {/* Amenities */}
                          <div className="hidden lg:flex items-center gap-2 text-gray-400">
                            <span title="Wi-Fi"><Wifi className="w-4 h-4" /></span>
                            <span title="Refeição"><Coffee className="w-4 h-4" /></span>
                            <span title="Bagagem"><Luggage className="w-4 h-4" /></span>
                          </div>

                          {/* Price and CTA */}
                          <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-[#f97316]">
                                {formatCurrency(flight.price * passengers)}
                              </p>
                              <p className="text-xs text-gray-400">
                                total · {formatCurrency(flight.price)} por pessoa
                              </p>
                            </div>
                            <button
                              onClick={() => handleSelectFlight(flight)}
                              className="min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] active:from-[#dc2626] active:to-[#dc2626] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 flex items-center gap-2 whitespace-nowrap"
                            >
                              Selecionar
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Seats availability */}
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  flight.availableSeats > 50
                                    ? "bg-green-500"
                                    : flight.availableSeats > 20
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                              />
                              {flight.availableSeats} lugares
                            </span>
                            <span>{flight.aircraft}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filters bottom sheet */}
      <BottomSheet
        open={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtrar e ordenar"
        subtitle={`${filteredFlights.length} ${filteredFlights.length === 1 ? "voo encontrado" : "voos encontrados"}`}
        footer={
          <button
            onClick={() => setShowFilters(false)}
            className="w-full min-h-[48px] bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-bold rounded-xl flex items-center justify-center gap-2 active:from-[#dc2626]"
          >
            Ver {filteredFlights.length} {filteredFlights.length === 1 ? "voo" : "voos"}
          </button>
        }
      >
        <div className="-mx-5 -mt-4">
          <div className="bg-white rounded-2xl border-0 px-5">
            <div className="flex items-center justify-end py-3">
              <button
                onClick={clearFilters}
                className="text-xs text-[#f97316] hover:text-[#ea580c] font-semibold"
              >
                Limpar filtros
              </button>
            </div>
            {filtersBody}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#f97316] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Carregando voos...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
