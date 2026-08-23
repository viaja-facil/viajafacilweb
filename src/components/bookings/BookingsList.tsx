"use client";

import Link from "next/link";
import { mockBookings, flights, formatCurrency, getAirlineById } from "@/lib/mock-data";
import { Calendar, MapPin, Plane } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmada",
  pending: "Pendente",
  cancelled: "Cancelada",
};

export default function BookingsList({ userId }: { userId: string }) {
  const bookings = mockBookings
    .filter((b) => b.userId === userId)
    .sort((a, b) => b.bookingDate.localeCompare(a.bookingDate));

  if (bookings.length === 0) {
    return (
      <div className="text-center py-10">
        <Plane className="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p className="text-sm font-semibold text-gray-900 mb-1">Nenhuma reserva ainda</p>
        <p className="text-xs text-gray-400 mb-4">
          Quando fizer uma reserva, ela aparece aqui.
        </p>
        <Link
          href="/"
          className="inline-flex min-h-[40px] items-center px-5 bg-[#f97316] hover:bg-[#ea580c] text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Buscar voos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => {
        const flight = flights.find((f) => f.id === booking.flightId);
        const airline = flight ? getAirlineById(flight.airlineId) : null;
        return (
          <div
            key={booking.id}
            className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                {airline && (
                  <span
                    className="w-6 h-6 rounded flex items-center justify-center text-[9px] text-white font-bold"
                    style={{ backgroundColor: airline.color }}
                  >
                    {airline.logo}
                  </span>
                )}
                {flight ? `${flight.flightNumber}` : `Reserva ${booking.id}`}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  STATUS_STYLES[booking.status]
                }`}
              >
                {STATUS_LABELS[booking.status]}
              </span>
            </div>

            {flight && (
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                <span>{flight.origin}</span>
                <MapPin className="w-3 h-3 text-gray-300" />
                <Plane className="w-3 h-3 text-[#f97316] -rotate-45" />
                <span>{flight.destination}</span>
                <span className="ml-auto text-[#f97316]">
                  {formatCurrency(booking.totalPrice)}
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(booking.bookingDate).toLocaleDateString("pt-AO", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span>
                {booking.seats.length} {booking.seats.length === 1 ? "lugar" : "lugares"}:{" "}
                {booking.seats.join(", ")}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
