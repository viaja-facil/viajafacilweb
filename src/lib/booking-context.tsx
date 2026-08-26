"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
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

const BOOKING_STORAGE_KEY = "viajafacil-booking";

function loadInitialBooking(): BookingState {
  if (typeof window === "undefined") return initialBooking;
  try {
    const raw = window.sessionStorage.getItem(BOOKING_STORAGE_KEY);
    if (!raw) return initialBooking;
    const parsed = JSON.parse(raw) as BookingState;
    return { ...initialBooking, ...parsed };
  } catch {
    return initialBooking;
  }
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(initialBooking);

  // Restore booking after mount so a page refresh doesn't lose checkout
  // state. Scheduled on the next frame to avoid a cascading render.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setBooking(loadInitialBooking());
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Persist booking state to sessionStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (booking.flight === null) {
      window.sessionStorage.removeItem(BOOKING_STORAGE_KEY);
      return;
    }
    window.sessionStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(booking));
  }, [booking]);

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
