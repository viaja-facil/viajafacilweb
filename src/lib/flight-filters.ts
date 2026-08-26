import type { Flight } from "./types";

export type SortBy = "price" | "duration" | "departure";

export interface FlightFilters {
  origin?: string;
  destination?: string;
  selectedDate?: string | null;
  maxPrice?: number;
  selectedClass?: string;
  selectedAirlines?: string[];
  selectedTimeOfDay?: string[];
  stops?: string;
  baggage?: string;
  priceRange?: string;
  sortBy?: SortBy;
}

export function getTimeSlot(departureTime: string): string {
  const hour = new Date(departureTime).getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}

export function filterFlights(flights: Flight[], filters: FlightFilters): Flight[] {
  const {
    origin,
    destination,
    selectedDate,
    maxPrice = 3000000,
    selectedClass = "all",
    selectedAirlines = [],
    selectedTimeOfDay = [],
    stops = "all",
    baggage = "all",
    priceRange = "all",
  } = filters;

  return flights.filter((f) => {
    if (origin && f.origin !== origin) return false;
    if (destination && f.destination !== destination) return false;
    if (selectedDate && !f.departureTime.startsWith(selectedDate)) return false;
    if (f.price > maxPrice) return false;
    if (selectedClass !== "all" && f.class !== selectedClass) return false;
    if (selectedAirlines.length > 0 && !selectedAirlines.includes(f.airlineId)) return false;
    if (selectedTimeOfDay.length > 0) {
      const timeSlot = getTimeSlot(f.departureTime);
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
}

export function sortFlights(flights: Flight[], sortBy: SortBy): Flight[] {
  const sorted = [...flights];
  switch (sortBy) {
    case "price":
      return sorted.sort((a, b) => a.price - b.price);
    case "duration":
      return sorted.sort((a, b) => a.duration.localeCompare(b.duration));
    case "departure":
      return sorted.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    default:
      return sorted;
  }
}

export function getActiveFilterCount(filters: {
  selectedAirlines?: string[];
  selectedTimeOfDay?: string[];
  stops?: string;
  baggage?: string;
  priceRange?: string;
  selectedClass?: string;
}): number {
  let count = 0;
  if (filters.selectedAirlines && filters.selectedAirlines.length > 0) count++;
  if (filters.selectedTimeOfDay && filters.selectedTimeOfDay.length > 0) count++;
  if (filters.stops && filters.stops !== "all") count++;
  if (filters.baggage && filters.baggage !== "all") count++;
  if (filters.priceRange && filters.priceRange !== "all") count++;
  if (filters.selectedClass && filters.selectedClass !== "all") count++;
  return count;
}
