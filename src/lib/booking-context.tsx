"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Flight, Seat, TripLeg } from "@/lib/mock-data";

export type PaymentMethod = "multicaixa_express" | "referencia";

interface BookingState {
  flight: Flight | null;
  flights: Flight[];
  legs: TripLeg[];
  currentLegIndex: number;
  seats: Seat[];
  allSeats: Seat[][];
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
  addFlight: (flight: Flight) => void;
  confirmFlight: () => void;
  nextLeg: () => void;
  previousLeg: () => void;
  setSeats: (seats: Seat[]) => void;
  setPassengers: (passengers: { name: string; document: string }[]) => void;
  setPassengerCount: (count: number) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setPaymentReference: (ref: string) => void;
  goToStep: (step: BookingState["step"]) => void;
  resetBooking: () => void;
  setLegs: (legs: TripLeg[]) => void;
}

const initialBooking: BookingState = {
  flight: null,
  flights: [],
  legs: [],
  currentLegIndex: 0,
  seats: [],
  allSeats: [],
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

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setBooking(loadInitialBooking());
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (booking.flight === null && booking.flights.length === 0) {
      window.sessionStorage.removeItem(BOOKING_STORAGE_KEY);
      return;
    }
    window.sessionStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(booking));
  }, [booking]);

  const setFlight = (flight: Flight) => {
    setBooking((prev) => ({ ...prev, flight, step: "select" }));
  };

  const addFlight = (flight: Flight) => {
    setBooking((prev) => {
      const newFlights = [...prev.flights, flight];
      const newAllSeats = [...prev.allSeats, prev.seats];
      const newTotalPrice = newFlights.reduce((sum, f) => sum + f.price * prev.passengerCount, 0);
      return {
        ...prev,
        flights: newFlights,
        allSeats: newAllSeats,
        seats: [],
        totalPrice: newTotalPrice,
        currentLegIndex: prev.currentLegIndex + 1,
      };
    });
  };

  const confirmFlight = () => {
    setBooking((prev) => ({ ...prev, step: "seats" }));
  };

  const nextLeg = () => {
    setBooking((prev) => ({
      ...prev,
      currentLegIndex: Math.min(prev.currentLegIndex + 1, prev.flights.length),
    }));
  };

  const previousLeg = () => {
    setBooking((prev) => ({
      ...prev,
      currentLegIndex: Math.max(prev.currentLegIndex - 1, 0),
    }));
  };

  const setSeats = (seats: Seat[]) => {
    setBooking((prev) => {
      const flightPrice = prev.flight?.price || (prev.flights[prev.currentLegIndex]?.price || 0);
      const seatExtras = seats.reduce((sum, s) => sum + s.price, 0);
      return {
        ...prev,
        seats,
        totalPrice: flightPrice * seats.length + seatExtras,
      };
    });
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

  const setLegs = (legs: TripLeg[]) => {
    setBooking((prev) => ({ ...prev, legs }));
  };

  return (
    <BookingContext.Provider
      value={{
        booking,
        setFlight,
        addFlight,
        confirmFlight,
        nextLeg,
        previousLeg,
        setSeats,
        setPassengers,
        setPassengerCount,
        setPaymentMethod,
        setPaymentReference,
        goToStep,
        resetBooking,
        setLegs,
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
