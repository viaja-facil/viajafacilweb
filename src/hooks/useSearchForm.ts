"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { getAvailabilityForRoute } from "@/lib/mock-data";
import { buildSearchParams, buildQuickBookParams } from "@/lib/search-params";
import type { TripLeg } from "@/lib/types";

let legIdCounter = 0;
function generateLegId() {
  return `leg-${++legIdCounter}-${Date.now()}`;
}

function createEmptyLeg(): TripLeg {
  return { id: generateLegId(), origin: "", destination: "", date: null };
}

export function useSearchForm() {
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
  const [showLegCalendar, setShowLegCalendar] = useState<number | null>(null);

  const [legs, setLegs] = useState<TripLeg[]>([
    { id: generateLegId(), origin: "", destination: "", date: null },
    { id: generateLegId(), origin: "", destination: "", date: null },
  ]);

  const availability = useMemo(() => {
    if (!origin || !destination) return [];
    return getAvailabilityForRoute(origin, destination);
  }, [origin, destination]);

  const getLegAvailability = useCallback((legIndex: number) => {
    const leg = legs[legIndex];
    if (!leg || !leg.origin || !leg.destination) return [];
    return getAvailabilityForRoute(leg.origin, leg.destination);
  }, [legs]);

  const hasRouteSelected = Boolean(origin && destination && origin !== destination);

  const hasAllLegsValid = useMemo(() => {
    if (tripType !== "multicity") return hasRouteSelected;
    return legs.length >= 2 && legs.every(
      (leg) => leg.origin && leg.destination && leg.origin !== leg.destination && leg.date
    );
  }, [tripType, legs, hasRouteSelected]);

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

  const handleLegDateSelect = useCallback((legIndex: number, selectedDate: string) => {
    setLegs((prev) =>
      prev.map((leg, i) => (i === legIndex ? { ...leg, date: selectedDate } : leg))
    );
    setShowLegCalendar(null);
  }, []);

  const addLeg = useCallback(() => {
    setLegs((prev) => [...prev, createEmptyLeg()]);
  }, []);

  const removeLeg = useCallback((index: number) => {
    setLegs((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateLeg = useCallback((index: number, field: "origin" | "destination", value: string) => {
    setLegs((prev) =>
      prev.map((leg, i) =>
        i === index ? { ...leg, [field]: value, date: null } : leg
      )
    );
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPassengerCount(passengers);

    if (tripType === "multicity") {
      const params = buildSearchParams({
        legs,
        passengers,
        adults,
        children,
        tripType,
      });
      router.push(`/search?${params}`);
    } else {
      const params = buildSearchParams({
        origin,
        destination,
        date: date || undefined,
        departureDate: departureDate || undefined,
        returnDate: returnDate || undefined,
        passengers,
        adults,
        children,
        tripType,
      });
      router.push(`/search?${params}`);
    }
  };

  const handleBookDestination = (dest: { originCode: string; destCode: string }) => {
    setPassengerCount(1);
    const params = buildQuickBookParams(dest.originCode, dest.destCode);
    router.push(`/search?${params}`);
  };

  return {
    origin,
    setOrigin,
    destination,
    setDestination,
    date,
    setDate,
    departureDate,
    setDepartureDate,
    returnDate,
    setReturnDate,
    adults,
    setAdults,
    children,
    setChildren,
    passengers,
    tripType,
    setTripType,
    showCalendar,
    setShowCalendar,
    showDateRange,
    setShowDateRange,
    availability,
    hasRouteSelected,
    handleDateSelect,
    handleDepartureSelect,
    handleReturnSelect,
    handleSearch,
    handleBookDestination,
    legs,
    setLegs,
    addLeg,
    removeLeg,
    updateLeg,
    getLegAvailability,
    showLegCalendar,
    setShowLegCalendar,
    handleLegDateSelect,
    hasAllLegsValid,
  };
}
