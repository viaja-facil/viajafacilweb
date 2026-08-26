"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-context";
import { getAvailabilityForRoute } from "@/lib/mock-data";
import { buildSearchParams, buildQuickBookParams } from "@/lib/search-params";

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

  const availability = useMemo(() => {
    if (!origin || !destination) return [];
    return getAvailabilityForRoute(origin, destination);
  }, [origin, destination]);

  const hasRouteSelected = Boolean(origin && destination && origin !== destination);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPassengerCount(passengers);
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
  };
}
