import type { Booking } from "../types";

export const mockBookings: Booking[] = [
  {
    id: "bk1",
    userId: "u2",
    flightId: "f1",
    seats: ["12A", "12B"],
    totalPrice: 90000,
    status: "confirmed",
    bookingDate: "2026-08-20T10:30:00",
    passengers: [
      { name: "Maria Santos", document: "004567890LA045", seat: "12A" },
      { name: "Pedro Santos", document: "004567891LA045", seat: "12B" },
    ],
  },
  {
    id: "bk2",
    userId: "u3",
    flightId: "f3",
    seats: ["5C"],
    totalPrice: 55000,
    status: "confirmed",
    bookingDate: "2026-08-19T14:00:00",
    passengers: [
      { name: "João Pedro", document: "004567892LA045", seat: "5C" },
    ],
  },
  {
    id: "bk3",
    userId: "u2",
    flightId: "f7",
    seats: ["2A"],
    totalPrice: 85000,
    status: "pending",
    bookingDate: "2026-08-21T09:15:00",
    passengers: [
      { name: "Maria Santos", document: "004567890LA045", seat: "2A" },
    ],
  },
];
