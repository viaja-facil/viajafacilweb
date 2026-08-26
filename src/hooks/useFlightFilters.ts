"use client";

import { useState, useMemo } from "react";
import type { Flight } from "@/lib/types";
import type { SortBy } from "@/lib/flight-filters";
import { filterFlights, sortFlights, getActiveFilterCount } from "@/lib/flight-filters";

export function useFlightFilters(flights: Flight[]) {
  const [sortBy, setSortBy] = useState<SortBy>("price");
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string[]>([]);
  const [stops, setStops] = useState<string>("all");
  const [baggage, setBaggage] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");

  const filteredFlights = useMemo(() => {
    const filtered = filterFlights(flights, {
      maxPrice,
      selectedClass,
      selectedAirlines,
      selectedTimeOfDay,
      stops,
      baggage,
      priceRange,
    });
    return sortFlights(filtered, sortBy);
  }, [flights, sortBy, maxPrice, selectedClass, selectedAirlines, selectedTimeOfDay, stops, baggage, priceRange]);

  const activeFilterCount = useMemo(() => {
    return getActiveFilterCount({
      selectedAirlines,
      selectedTimeOfDay,
      stops,
      baggage,
      priceRange,
      selectedClass,
    });
  }, [selectedAirlines, selectedTimeOfDay, stops, baggage, priceRange, selectedClass]);

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

  const clearFilters = () => {
    setSortBy("price");
    setMaxPrice(3000000);
    setSelectedClass("all");
    setSelectedAirlines([]);
    setSelectedTimeOfDay([]);
    setStops("all");
    setBaggage("all");
    setPriceRange("all");
  };

  return {
    sortBy,
    setSortBy,
    maxPrice,
    setMaxPrice,
    selectedClass,
    setSelectedClass,
    selectedAirlines,
    selectedTimeOfDay,
    stops,
    setStops,
    baggage,
    setBaggage,
    priceRange,
    setPriceRange,
    filteredFlights,
    activeFilterCount,
    toggleAirline,
    toggleTimeOfDay,
    clearFilters,
  };
}
