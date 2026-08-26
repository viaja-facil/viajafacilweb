"use client";

import { Flight, Airline, Airport } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/mock-data";
import { formatTime } from "@/lib/format";
import {
  Plane,
  ArrowRight,
  Wifi,
  Coffee,
  Luggage,
} from "lucide-react";

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
  airline?: Airline;
  originAirport?: Airport;
  destAirport?: Airport;
}

export default function FlightCard({
  flight,
  onSelect,
  airline,
  originAirport,
  destAirport,
}: FlightCardProps) {
  const flightDate = new Date(flight.departureTime);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onSelect(flight);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Selecionar voo ${flight.flightNumber} de ${flight.origin} para ${flight.destination}, ${formatCurrency(flight.price)}`}
      onClick={() => onSelect(flight)}
      onKeyDown={handleKeyDown}
      className="w-full bg-white rounded-2xl border border-gray-200 hover:border-[#f97316] hover:shadow-lg hover:shadow-orange-500/10 focus-visible:border-[#f97316] transition-all group cursor-pointer active:scale-[0.99] overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-gray-400">
            {flightDate.toLocaleDateString("pt-AO", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </span>
          <div className="flex-1 h-px bg-gray-100" />
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              flight.class === "economy"
                ? "bg-blue-50 text-blue-600"
                : flight.class === "business"
                ? "bg-purple-50 text-purple-600"
                : "bg-yellow-50 text-yellow-600"
            }`}
          >
            {flight.class === "economy"
              ? "Económica"
              : flight.class === "business"
              ? "Business"
              : "Primeira"}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-4 min-w-0">
          <div className="flex items-center gap-3 lg:w-44 shrink-0 min-w-0">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0"
              style={{ backgroundColor: airline?.color || "#666" }}
            >
              {airline?.logo || <Plane className="w-5 h-5 text-gray-400" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {airline?.name}
              </p>
              <p className="text-xs text-gray-500">{flight.flightNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 min-w-0 shrink">
            <div className="text-center w-16">
              <p className="text-xl font-bold text-gray-900">
                {formatTime(flight.departureTime)}
              </p>
              <p className="text-xs text-gray-500">{flight.origin}</p>
            </div>

            <div className="flex-1 flex items-center gap-1 px-2">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="flex flex-col items-center px-2">
                <Plane className="w-4 h-4 text-[#f97316] -rotate-45" />
                <p className="text-xs text-gray-500 mt-0.5">
                  {flight.duration}
                </p>
              </div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="text-center w-16">
              <p className="text-xl font-bold text-gray-900">
                {formatTime(flight.arrivalTime)}
              </p>
              <p className="text-xs text-gray-500">{flight.destination}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <span title="Wi-Fi">
              <Wifi className="w-4 h-4" aria-hidden="true" />
            </span>
            <span title="Refeição">
              <Coffee className="w-4 h-4" aria-hidden="true" />
            </span>
            <span title="Bagagem">
              <Luggage className="w-4 h-4" aria-hidden="true" />
            </span>
          </div>

          <div className="flex items-center gap-4 lg:flex-col lg:items-end min-w-0 flex-wrap">
            <div className="text-right min-w-0">
              <p className="text-2xl font-bold text-[#f97316] whitespace-nowrap">
                {formatCurrency(flight.price)}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(flight);
              }}
              aria-label={`Selecionar voo ${flight.flightNumber} por ${formatCurrency(flight.price)}`}
              className="min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] active:from-[#dc2626] active:to-[#dc2626] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 flex items-center gap-2"
            >
              Selecionar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  flight.availableSeats > 50
                    ? "bg-green-500"
                    : flight.availableSeats > 20
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              />
              {flight.availableSeats} lugares
            </span>
            <span>{flight.aircraft}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
