"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { getAvailabilityForRoute } from "@/lib/mock-data";
import { buildSearchParams, buildQuickBookParams } from "@/lib/search-params";
import { validateSearch } from "@/lib/search-validation";
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

  const [flexible, setFlexible] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
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
    { id: "leg-1", origin: "", destination: "", date: null },
    { id: "leg-2", origin: "", destination: "", date: null },
  ]);
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = JSON.parse(sessionStorage.getItem("viajafacil-search") || "null");
        if (saved && ["oneway", "roundtrip", "multicity"].includes(saved.tripType)) {
          setTripType(saved.tripType);
          setOrigin(typeof saved.origin === "string" ? saved.origin : "");
          setDestination(typeof saved.destination === "string" ? saved.destination : "");
          setDate(typeof saved.date === "string" ? saved.date : null);
          setDepartureDate(typeof saved.departureDate === "string" ? saved.departureDate : null);
          setReturnDate(typeof saved.returnDate === "string" ? saved.returnDate : null);
          setFlexible(saved.flexible === true);
          if (Number.isInteger(saved.adults) && saved.adults >= 1 && saved.adults <= 9) setAdults(saved.adults);
          if (Number.isInteger(saved.children) && saved.children >= 0 && saved.children <= 8) setChildren(saved.children);
          if (Array.isArray(saved.legs) && saved.legs.length >= 2 && saved.legs.length <= 6 && saved.legs.every((leg: TripLeg) => typeof leg.id === "string" && typeof leg.origin === "string" && typeof leg.destination === "string" && (leg.date === null || typeof leg.date === "string"))) setLegs(saved.legs);
        }
      } catch { /* A corrupt or unavailable draft must not prevent searching. */ }
      setRestored(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!restored) return;
    try { sessionStorage.setItem("viajafacil-search", JSON.stringify({ origin, destination, date, departureDate, returnDate, adults, children, tripType, flexible, legs })); } catch { /* Searching works without browser storage. */ }
  }, [restored, origin, destination, date, departureDate, returnDate, adults, children, tripType, flexible, legs]);

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
    const error = validateSearch({ origin, destination, date, departureDate, returnDate, tripType, flexible, legs });
    setSearchError(error);
    if (error) return;
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
        date: flexible ? undefined : date || undefined,
        flexible: tripType === "oneway" && flexible,
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
    flexible, setFlexible, searchError,
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
