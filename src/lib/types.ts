export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Airline {
  id: string;
  name: string;
  logo: string;
  color: string;
}

export interface Flight {
  id: string;
  airlineId: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  availableSeats: number;
  totalSeats: number;
  aircraft: string;
  stops: number;
  class: "economy" | "business" | "first";
  hasCheckedBaggage: boolean;
}

export interface Seat {
  id: string;
  number: string;
  row: number;
  column: string;
  class: "economy" | "business" | "first";
  isAvailable: boolean;
  isExtraLegroom: boolean;
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  phone?: string;
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  seats: string[];
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  bookingDate: string;
  passengers: Passenger[];
}

export interface Passenger {
  name: string;
  document: string;
  seat: string;
}

export interface DateAvailability {
  date: string;
  hasFlights: boolean;
  minPrice: number;
  flightCount: number;
}
