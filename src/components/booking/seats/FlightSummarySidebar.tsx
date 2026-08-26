"use client";

import { ArrowRight, Plane, Info, Zap } from "lucide-react";
import { Flight, Seat } from "@/lib/mock-data";
import { formatCurrency, getAirlineById, getAirportByCode } from "@/lib/mock-data";
import { formatTime } from "@/lib/format";

interface FlightSummarySidebarProps {
  flight: Flight;
  selectedSeats: Seat[];
  passengerCount: number;
  grandTotal: number;
  allSeatsSelected: boolean;
  handleContinue: () => void;
  handleSeatClick: (seat: Seat) => void;
}

export default function FlightSummarySidebar({
  flight,
  selectedSeats,
  passengerCount,
  grandTotal,
  allSeatsSelected,
  handleContinue,
  handleSeatClick,
}: FlightSummarySidebarProps) {
  const airline = getAirlineById(flight.airlineId);
  const totalBasePrice = flight.price * selectedSeats.length;
  const totalSeatPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const remainingSeats = passengerCount - selectedSeats.length;

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
        <h3 className="font-bold text-gray-900 mb-4">Resumo do Voo</h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: airline?.color || "#666" }}
            >
              {airline?.logo || <Plane className="w-5 h-5 text-gray-400" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{flight.flightNumber}</p>
              <p className="text-xs text-gray-500">{airline?.name}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-lg font-bold text-gray-900">{flight.origin}</p>
                <p className="text-xs text-gray-500">{formatTime(flight.departureTime)}</p>
              </div>
              <div className="flex-1 mx-4">
                <div className="h-px bg-gray-300 relative">
                  <Plane className="w-4 h-4 text-[#f97316] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{flight.destination}</p>
                <p className="text-xs text-gray-500">{formatTime(flight.arrivalTime)}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center">{flight.duration} • Direto</p>
          </div>
        </div>

        {/* Selected seats */}
        {selectedSeats.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Assentos Selecionados ({selectedSeats.length}/{passengerCount})
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seat) => (
                <div
                  key={seat.id}
                  className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5"
                >
                  <span className="text-sm font-bold text-blue-700">{seat.number}</span>
                  {seat.isExtraLegroom && (
                    <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  )}
                  {seat.price > 0 && (
                    <span className="text-xs text-blue-500">+{formatCurrency(seat.price)}</span>
                  )}
                  <button
                    onClick={() => handleSeatClick(seat)}
                    className="ml-1 text-blue-400 hover:text-blue-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price breakdown */}
        <div className="border-t border-gray-100 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Passagem ({selectedSeats.length}x)</span>
            <span className="text-gray-900">{formatCurrency(totalBasePrice)}</span>
          </div>
          {totalSeatPrice > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Taxa de assento</span>
              <span className="text-gray-900">{formatCurrency(totalSeatPrice)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-100">
            <span className="text-gray-900">Total</span>
            <span className="text-[#f97316]">{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!allSeatsSelected}
          className="w-full min-h-[48px] mt-6 py-3.5 hidden lg:flex bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:shadow-none items-center justify-center gap-2"
        >
          {allSeatsSelected
            ? "Continuar"
            : `Selecione mais ${remainingSeats} ${remainingSeats === 1 ? "lugar" : "lugares"}`}
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 justify-center">
          <Info className="w-3 h-3" />
          <span>Seus assentos ficam reservados por 10 minutos</span>
        </div>
      </div>
    </div>
  );
}
