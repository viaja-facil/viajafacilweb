"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { flights, airports, airlines, getAirlineById, getAirportByCode, formatCurrency, getAvailabilityForRoute } from "@/lib/mock-data";
import type { Flight, Airline, Airport } from "@/lib/types";
import { formatTime, formatDate } from "@/lib/format";
import { useBooking } from "@/lib/booking-context";
import FlightCard from "@/components/search/FlightCard";
import SearchHeader from "@/components/search/SearchHeader";
import SortBar from "@/components/search/SortBar";
import DateChips from "@/components/search/DateChips";
import FilterPanel from "@/components/search/FilterPanel";
import { SkeletonFlight } from "@/components/ui/Skeleton";
import BottomSheet from "@/components/ui/BottomSheet";
import { Plane, SlidersHorizontal, ArrowLeft, X } from "lucide-react";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setFlight, confirmFlight, setPassengerCount } = useBooking();

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
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departure">("price");
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string[]>([]);
  const [stops, setStops] = useState<string>("all");
  const [baggage, setBaggage] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
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

  const availableAirlines = useMemo(() => {
    if (!origin || !destination) return airlines;
    const airlineIds = new Set(
      flights
        .filter((f) => f.origin === origin && f.destination === destination)
        .map((f) => f.airlineId)
    );
    return airlines.filter((a) => airlineIds.has(a.id));
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
        const timeSlot = hour >= 6 && hour < 12 ? "morning" : hour >= 12 && hour < 18 ? "afternoon" : hour >= 18 && hour < 22 ? "evening" : "night";
        if (!selectedTimeOfDay.includes(timeSlot)) return false;
      }
      if (stops === "direct" && f.stops !== 0) return false;
      if (stops === "1" && f.stops !== 1) return false;
      if (stops === "2+" && f.stops < 2) return false;
      if (baggage === "with" && !f.hasCheckedBaggage) return false;
      if (baggage === "without" && f.hasCheckedBaggage) return false;
      if (priceRange === "100" && f.price > 100000) return false;
      if (priceRange === "200" && (f.price < 100000 || f.price > 200000)) return false;
      if (priceRange === "500" && (f.price < 200000 || f.price > 500000)) return false;
      if (priceRange === "500+" && f.price < 500000) return false;
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
  }, [origin, destination, selectedDate, sortBy, maxPrice, selectedClass, selectedAirlines, selectedTimeOfDay, stops, baggage, priceRange]);

  const handleSelectFlight = (flight: Flight) => {
    setPassengerCount(passengers);
    setFlight(flight);
    confirmFlight();
    router.push(`/booking/seats?flightId=${flight.id}`);
  };

  const getOriginCity = () => airports.find((a) => a.code === origin)?.city || "Todos";
  const getDestCity = () => airports.find((a) => a.code === destination)?.city || "Todos";
  const hasRoute = origin && destination && origin !== destination;

  const toggleAirline = (id: string) => {
    setSelectedAirlines((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);
  };

  const toggleTimeOfDay = (slot: string) => {
    setSelectedTimeOfDay((prev) => prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]);
  };

  const activeFilterCount = selectedAirlines.length + selectedTimeOfDay.length +
    (selectedClass !== "all" ? 1 : 0) + (stops !== "all" ? 1 : 0) +
    (baggage !== "all" ? 1 : 0) + (priceRange !== "all" ? 1 : 0);

  const clearFilters = () => {
    setSelectedDate(null);
    setSelectedClass("all");
    setMaxPrice(3000000);
    setSortBy("price");
    setSelectedAirlines([]);
    setSelectedTimeOfDay([]);
    setStops("all");
    setBaggage("all");
    setPriceRange("all");
  };

  const filterProps = { stops, setStops, baggage, setBaggage, priceRange, setPriceRange, selectedClass, setSelectedClass, maxPrice, setMaxPrice, availableAirlines, selectedAirlines, toggleAirline, selectedTimeOfDay, toggleTimeOfDay, clearFilters };

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchHeader origin={origin} destination={destination} selectedDate={selectedDate} passengers={passengers} adults={adults} children={children} getOriginCity={getOriginCity} getDestCity={getDestCity} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-20 lg:pb-6">
        <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
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
            <DateChips availability={availability} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

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
