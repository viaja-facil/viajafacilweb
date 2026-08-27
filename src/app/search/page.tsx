"use client";

import { useState, useMemo, Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { flights, airports, airlines, getAirlineById, getAirportByCode, formatCurrency, getAvailabilityForRoute } from "@/lib/mock-data";
import type { Flight, Airline, Airport, TripLeg } from "@/lib/types";
import { formatTime, formatDate } from "@/lib/format";
import { useBooking } from "@/lib/booking-context";
import FlightCard from "@/components/search/FlightCard";
import SearchHeader from "@/components/search/SearchHeader";
import SortBar from "@/components/search/SortBar";
import DateChips from "@/components/search/DateChips";
import FilterPanel from "@/components/search/FilterPanel";
import { SkeletonFlight } from "@/components/ui/Skeleton";
import BottomSheet from "@/components/ui/BottomSheet";
import { Plane, SlidersHorizontal, ArrowLeft, X, ChevronRight, Check } from "lucide-react";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setFlight, addFlight, confirmFlight, setPassengerCount, booking, setLegs } = useBooking();

  const initialTripType = searchParams.get("tripType") || "oneway";
  const initialPassengers = parseInt(searchParams.get("passengers") || "1");
  const initialAdults = parseInt(searchParams.get("adults") || "");
  const initialChildren = parseInt(searchParams.get("children") || "");

  const isMultiCity = initialTripType === "multicity";

  // Parse legs from URL for multi-city
  const initialLegs = useMemo(() => {
    if (!isMultiCity) return [];
    const legCount = parseInt(searchParams.get("legCount") || "0");
    const legs: TripLeg[] = [];
    for (let i = 0; i < legCount; i++) {
      const origin = searchParams.get(`leg${i}.origin`) || "";
      const destination = searchParams.get(`leg${i}.destination`) || "";
      const date = searchParams.get(`leg${i}.date`) || "";
      if (origin && destination) {
        legs.push({ id: `leg-${i}`, origin, destination, date: date || null });
      }
    }
    return legs;
  }, [isMultiCity, searchParams]);

  const [currentLegIndex, setCurrentLegIndex] = useState(0);
  const [selectedFlights, setSelectedFlights] = useState<Flight[]>([]);

  // Single city state
  const initialOrigin = isMultiCity ? (initialLegs[0]?.origin || "") : (searchParams.get("origin") || "");
  const initialDestination = isMultiCity ? (initialLegs[initialLegs.length - 1]?.destination || "") : (searchParams.get("destination") || "");
  const initialDate = searchParams.get("date") || "";
  const initialDepartureDate = searchParams.get("departureDate") || "";
  const initialReturnDate = searchParams.get("returnDate") || "";

  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate || null);
  const [tripType] = useState<"oneway" | "roundtrip" | "multicity">(initialTripType as "oneway" | "roundtrip" | "multicity");
  const [departureDate, setDepartureDate] = useState<string | null>(initialDepartureDate || null);
  const [returnDate, setReturnDate] = useState<string | null>(initialReturnDate || null);
  const [passengers, setPassengers] = useState(initialPassengers);
  const adults = Number.isNaN(initialAdults) ? initialPassengers : initialAdults;
  const childrenCount = Number.isNaN(initialChildren) ? 0 : initialChildren;
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departure">("price");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(7000000);
  const [debouncedMinPrice, setDebouncedMinPrice] = useState(0);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(7000000);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string[]>([]);
  const [stops, setStops] = useState<string>("all");
  const [baggage, setBaggage] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const legsInitializedRef = useRef(false);

  // Current leg for multi-city
  const currentLeg = isMultiCity ? initialLegs[currentLegIndex] : null;
  const effectiveOrigin = isMultiCity && currentLeg ? currentLeg.origin : origin;
  const effectiveDestination = isMultiCity && currentLeg ? currentLeg.destination : destination;
  const effectiveDate = isMultiCity && currentLeg ? currentLeg.date : (tripType === "roundtrip" ? departureDate : selectedDate);

  useEffect(() => {
    if (isMultiCity && !legsInitializedRef.current) {
      legsInitializedRef.current = true;
      setLegs(initialLegs);
    }
  }, [isMultiCity, initialLegs, setLegs]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [currentLegIndex]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedMinPrice(minPrice);
      setDebouncedMaxPrice(maxPrice);
    }, 300);
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [minPrice, maxPrice]);

  const availability = useMemo(() => {
    if (!effectiveOrigin || !effectiveDestination) return [];
    return getAvailabilityForRoute(effectiveOrigin, effectiveDestination);
  }, [effectiveOrigin, effectiveDestination]);

  const availableAirlines = useMemo(() => {
    if (!effectiveOrigin || !effectiveDestination) return airlines;
    const airlineIds = new Set(
      flights
        .filter((f) => f.origin === effectiveOrigin && f.destination === effectiveDestination)
        .map((f) => f.airlineId)
    );
    return airlines.filter((a) => airlineIds.has(a.id));
  }, [effectiveOrigin, effectiveDestination]);

  const filteredFlights = useMemo(() => {
    const result = flights.filter((f) => {
      if (effectiveOrigin && f.origin !== effectiveOrigin) return false;
      if (effectiveDestination && f.destination !== effectiveDestination) return false;
      if (effectiveDate && !f.departureTime.startsWith(effectiveDate)) return false;
      if (f.price > debouncedMaxPrice) return false;
      if (f.price < debouncedMinPrice) return false;
      if (selectedClass !== "all" && f.class !== selectedClass) return false;
      if (selectedAirlines.length > 0 && !selectedAirlines.includes(f.airlineId)) return false;
      if (selectedTimeOfDay.length > 0) {
        const hour = new Date(f.departureTime).getHours();
        const timeSlot = hour >= 6 && hour < 12 ? "morning" : hour >= 12 && hour < 18 ? "afternoon" : hour >= 18 && hour < 22 ? "evening" : "night";
        if (!selectedTimeOfDay.includes(timeSlot)) return false;
      }
      if (stops === "direct" && f.stops !== 0) return false;
      if (stops === "1" && f.stops !== 1) return false;
      if (stops === "2+" && f.stops < 2) return false;
      if (baggage === "with" && !f.hasCheckedBaggage) return false;
      if (baggage === "without" && f.hasCheckedBaggage) return false;
      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "price": return a.price - b.price;
        case "duration": return a.duration.localeCompare(b.duration);
        case "departure": return a.departureTime.localeCompare(b.departureTime);
        default: return 0;
      }
    });

    return result;
  }, [effectiveOrigin, effectiveDestination, effectiveDate, sortBy, debouncedMinPrice, debouncedMaxPrice, selectedClass, selectedAirlines, selectedTimeOfDay, stops, baggage]);

  const handleSelectFlight = (flight: Flight) => {
    setPassengerCount(passengers);

    if (isMultiCity) {
      const newSelectedFlights = [...selectedFlights, flight];
      setSelectedFlights(newSelectedFlights);
      addFlight(flight);

      if (currentLegIndex < initialLegs.length - 1) {
        setCurrentLegIndex(currentLegIndex + 1);
        setIsLoading(true);
      } else {
        setFlight(newSelectedFlights[0]);
        confirmFlight();
        router.push(`/booking/seats?flightId=${flight.id}`);
      }
    } else {
      setFlight(flight);
      confirmFlight();
      router.push(`/booking/seats?flightId=${flight.id}`);
    }
  };

  const getOriginCity = () => airports.find((a) => a.code === effectiveOrigin)?.city || "Todos";
  const getDestCity = () => airports.find((a) => a.code === effectiveDestination)?.city || "Todos";

  const toggleAirline = (id: string) => {
    setSelectedAirlines((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);
  };

  const toggleTimeOfDay = (slot: string) => {
    setSelectedTimeOfDay((prev) => prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]);
  };

  const activeFilterCount = selectedAirlines.length + selectedTimeOfDay.length +
    (selectedClass !== "all" ? 1 : 0) + (stops !== "all" ? 1 : 0) +
    (baggage !== "all" ? 1 : 0) + (minPrice > 0 ? 1 : 0) + (maxPrice < 7000000 ? 1 : 0);

  const clearFilters = () => {
    setSelectedDate(null);
    setSelectedClass("all");
    setMinPrice(0);
    setMaxPrice(7000000);
    setSortBy("price");
    setSelectedAirlines([]);
    setSelectedTimeOfDay([]);
    setStops("all");
    setBaggage("all");
  };

  const filterProps = { stops, setStops, baggage, setBaggage, selectedClass, setSelectedClass, minPrice, setMinPrice, maxPrice, setMaxPrice, availableAirlines, selectedAirlines, toggleAirline, selectedTimeOfDay, toggleTimeOfDay, clearFilters };

  return (
    <div className="min-h-screen bg-gray-50">
      {isMultiCity ? (
        /* Multi-city header */
        <div className="bg-gradient-to-r from-[#0a1628] to-[#162544] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>

            {/* Multi-city progress */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {initialLegs.map((leg, index) => {
                const originCity = airports.find((a) => a.code === leg.origin)?.city || leg.origin;
                const destCity = airports.find((a) => a.code === leg.destination)?.city || leg.destination;
                const isCompleted = index < currentLegIndex;
                const isCurrent = index === currentLegIndex;
                return (
                  <div key={leg.id} className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                      isCurrent
                        ? "bg-[#f97316] text-white"
                        : isCompleted
                        ? "bg-green-500/20 text-green-400"
                        : "bg-white/10 text-gray-400"
                    }`}>
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                      )}
                      <span className="hidden sm:inline">{originCity}</span>
                      <span className="text-gray-400">→</span>
                      <span className="hidden sm:inline">{destCity}</span>
                      {isCompleted && selectedFlights[index] && (
                        <span className="text-green-400 text-xs ml-1">
                          {formatCurrency(selectedFlights[index].price)}
                        </span>
                      )}
                    </div>
                    {index < initialLegs.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Current leg info */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <span className="font-semibold">
                  Trecho {currentLegIndex + 1} de {initialLegs.length}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <span className="font-semibold">{getOriginCity()}</span>
                <span className="text-gray-400">→</span>
                <span className="font-semibold">{getDestCity()}</span>
              </div>
              {effectiveDate && (
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                  <span>{formatDate(effectiveDate)}</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <span>{passengers} {passengers === 1 ? "passageiro" : "passageiros"}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SearchHeader
          origin={origin}
          destination={destination}
          selectedDate={tripType === "roundtrip" ? departureDate : selectedDate}
          passengers={passengers}
          adults={adults}
          childrenCount={childrenCount}
          getOriginCity={() => airports.find((a) => a.code === origin)?.city || "Todos"}
          getDestCity={() => airports.find((a) => a.code === destination)?.city || "Todos"}
          returnDate={tripType === "roundtrip" ? returnDate : undefined}
          tripType={tripType}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-20 lg:pb-6">
        <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl bg-white border border-gray-200/80 shadow-sm px-3 py-3 scrollbar-thin">
              <FilterPanel {...filterProps} />
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0">
            {/* Mobile filter bar */}
            <div className="lg:hidden sticky top-16 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <button onClick={() => setShowFilters(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-semibold">
                <SlidersHorizontal className="w-4 h-4" />
                Filtrar
                {activeFilterCount > 0 && <span className="bg-[#f97316] text-white text-xs rounded-full px-2 py-0.5">{activeFilterCount}</span>}
              </button>
            </div>

            <SortBar sortBy={sortBy} setSortBy={setSortBy} />
            <DateChips
              availability={availability}
              selectedDate={isMultiCity ? effectiveDate : (tripType === "roundtrip" ? departureDate : selectedDate)}
              setSelectedDate={isMultiCity ? () => {} : (tripType === "roundtrip" ? setDepartureDate : setSelectedDate)}
            />

            {/* Flight results */}
            {isLoading ? (
              <div className="space-y-4">{[1, 2, 3].map((i) => <SkeletonFlight key={i} />)}</div>
            ) : filteredFlights.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4 -rotate-45" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhum voo encontrado</h3>
                <p className="text-gray-500 mb-4">Tente ajustar os filtros ou buscar outras datas.</p>
                <button onClick={clearFilters} className="text-[#f97316] font-semibold hover:underline">Limpar filtros</button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFlights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} onSelect={handleSelectFlight} airline={getAirlineById(flight.airlineId)} originAirport={getAirportByCode(flight.origin)} destAirport={getAirportByCode(flight.destination)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter bottom sheet */}
      <BottomSheet open={showFilters} onClose={() => setShowFilters(false)}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Filtros</h3>
            <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
          </div>
          <FilterPanel {...filterProps} />
          <button onClick={() => setShowFilters(false)} className="w-full mt-4 py-3 bg-[#f97316] text-white rounded-xl font-semibold">Aplicar Filtros</button>
        </div>
      </BottomSheet>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f97316]" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
