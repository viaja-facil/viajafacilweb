"use client";

import { useState, useCallback, useMemo } from "react";
import type { Seat } from "@/lib/types";
import { calculateTotalPrice } from "@/lib/seats";

export function useSeatSelection(passengerCount: number) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [showMaxAlert, setShowMaxAlert] = useState(false);

  const remainingSeats = passengerCount - selectedSeats.length;
  const allSeatsSelected = selectedSeats.length === passengerCount;

  const pricing = useMemo(() => {
    const seatFee = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    return { seatFee };
  }, [selectedSeats]);

  const handleSeatClick = useCallback((seat: Seat) => {
    if (!seat.isAvailable) return;

    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      }
      if (prev.length >= passengerCount) {
        setShowMaxAlert(true);
        setTimeout(() => setShowMaxAlert(false), 2000);
        return prev;
      }
      return [...prev, seat];
    });
  }, [passengerCount]);

  const removeSeat = useCallback((seatId: string) => {
    setSelectedSeats((prev) => prev.filter((s) => s.id !== seatId));
  }, []);

  return {
    selectedSeats,
    setSelectedSeats,
    showMaxAlert,
    remainingSeats,
    allSeatsSelected,
    pricing,
    handleSeatClick,
    removeSeat,
  };
}
