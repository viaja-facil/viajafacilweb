"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Flight, Seat } from "@/lib/mock-data";

export type PaymentMethod = "multicaixa_express" | "referencia";

interface BookingState {
  flight: Flight | null;
  seats: Seat[];
  passengers: { name: string; document: string }[];
  passengerCount: number;
  totalPrice: number;
  paymentMethod: PaymentMethod | null;
  paymentReference: string | null;
  step: "search" | "select" | "seats" | "checkout" | "confirmation";
}

interface BookingContextType {
  booking: BookingState;
  setFlight: (flight: Flight) => void;
  confirmFlight: () => void;
  setSeats: (seats: Seat[]) => void;
  setPassengers: (passengers: { name: string; document: string }[]) => void;
  setPassengerCount: (count: number) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setPaymentReference: (ref: string) => void;
  goToStep: (step: BookingState["step"]) => void;
  resetBooking: () => void;
}

const initialBooking: BookingState = {
  flight: null,
  seats: [],
  passengers: [],
  passengerCount: 1,
  totalPrice: 0,
  paymentMethod: null,
  paymentReference: null,
  step: "search",
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(initialBooking);

  const setFlight = (flight: Flight) => {
    setBooking((prev) => ({ ...prev, flight, step: "select" }));
  };

  const confirmFlight = () => {
    setBooking((prev) => ({ ...prev, step: "seats" }));
  };

  const setSeats = (seats: Seat[]) => {
    const flightPrice = booking.flight?.price || 0;
    const seatExtras = seats.reduce((sum, s) => sum + s.price, 0);
    setBooking((prev) => ({
      ...prev,
      seats,
      totalPrice: flightPrice * seats.length + seatExtras,
    }));
  };

  const setPassengers = (passengers: { name: string; document: string }[]) => {
    setBooking((prev) => ({ ...prev, passengers, step: "checkout" }));
  };

  const setPassengerCount = (count: number) => {
    setBooking((prev) => {
      const newSeats = prev.seats.slice(0, count);
      const flightPrice = prev.flight?.price || 0;
      const seatExtras = newSeats.reduce((sum, s) => sum + s.price, 0);
      return {
        ...prev,
        passengerCount: count,
        seats: newSeats,
        totalPrice: flightPrice * newSeats.length + seatExtras,
      };
    });
  };

  const setPaymentMethod = (method: PaymentMethod) => {
    setBooking((prev) => ({ ...prev, paymentMethod: method }));
  };

  const setPaymentReference = (ref: string) => {
    setBooking((prev) => ({ ...prev, paymentReference: ref }));
  };

  const goToStep = (step: BookingState["step"]) => {
    setBooking((prev) => ({ ...prev, step }));
  };

  const resetBooking = () => {
    setBooking(initialBooking);
  };

  return (
    <BookingContext.Provider
      value={{
        booking,
        setFlight,
        confirmFlight,
        setSeats,
        setPassengers,
        setPassengerCount,
        setPaymentMethod,
        setPaymentReference,
        goToStep,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
