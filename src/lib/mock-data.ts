import type { Seat, DateAvailability } from "./types";
import { SEAT_CLASSES } from "./constants";
import { mockBookings } from "./data/bookings";
import { flights } from "./data/flights";

export type { Airport, Airline, Flight, Seat, User, Booking, DateAvailability } from "./types";
export { formatCurrency } from "./format";
export { airports, getAirportByCode } from "./data/airports";
export { airlines, getAirlineById } from "./data/airlines";
export { flights } from "./data/flights";
export { mockUsers } from "./data/users";
export { mockBookings } from "./data/bookings";

export function generateSeats(flightId: string, classType: "economy" | "business" | "first"): Seat[] {
  const seats: Seat[] = [];
  const { rows, columns, extraLegroom } = SEAT_CLASSES[classType];

  for (let row = 1; row <= rows; row++) {
    for (const col of columns) {
      const seatId = `${row}${col}`;
      const isOccupied = mockBookings.some(
        (b) => b.flightId === flightId && b.seats.includes(seatId)
      );

      seats.push({
        id: seatId,
        number: seatId,
        row,
        column: col,
        class: classType,
        isAvailable: !isOccupied,
        isExtraLegroom: extraLegroom.includes(row),
        price: classType === "first" ? 15000 : classType === "business" ? 10000 : extraLegroom.includes(row) ? 5000 : 0,
      });
    }
  }

  return seats;
}

const toLocalDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function getAvailabilityForRoute(origin: string, destination: string): DateAvailability[] {
  const result: DateAvailability[] = [];
  const now = new Date(2026, 7, 21);

  for (let i = 0; i < 60; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const dateStr = toLocalDateStr(date);

    const dayFlights = flights.filter(
      (f) =>
        f.origin === origin &&
        f.destination === destination &&
        f.departureTime.startsWith(dateStr) &&
        f.availableSeats > 0
    );

    result.push({
      date: dateStr,
      hasFlights: dayFlights.length > 0,
      minPrice: dayFlights.length > 0 ? Math.min(...dayFlights.map((f) => f.price)) : 0,
      flightCount: dayFlights.length,
    });
  }

  return result;
}

export function getCheapestDate(origin: string, destination: string): string | null {
  const availability = getAvailabilityForRoute(origin, destination);
  const available = availability.filter((a) => a.hasFlights);
  if (available.length === 0) return null;
  return available.reduce((cheapest, curr) =>
    curr.minPrice < cheapest.minPrice ? curr : cheapest
  ).date;
}

export function getFlightsForDate(origin: string, destination: string, date: string) {
  return flights.filter(
    (f) =>
      f.origin === origin &&
      f.destination === destination &&
      f.departureTime.startsWith(date) &&
      f.availableSeats > 0
  );
}
