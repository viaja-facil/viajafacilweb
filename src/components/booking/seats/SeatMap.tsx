"use client";

import { Plane } from "lucide-react";
import { Seat } from "@/lib/mock-data";
import { groupSeatsByRow } from "@/lib/seats";
import { formatCurrency } from "@/lib/mock-data";

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: Seat[];
  passengerCount: number;
  handleSeatClick: (seat: Seat) => void;
  columns: string[];
  flightClass: string;
}

export default function SeatMap({
  seats,
  selectedSeats,
  passengerCount,
  handleSeatClick,
  columns,
  flightClass,
}: SeatMapProps) {
  const rows = groupSeatsByRow(seats);
  const remainingSeats = passengerCount - selectedSeats.length;
  const allSeatsSelected = selectedSeats.length === passengerCount;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {/* Seat selection progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className={allSeatsSelected ? "text-green-600" : "text-gray-700"}>
            {allSeatsSelected
              ? `Todos os ${passengerCount} ${passengerCount === 1 ? "lugar selecionado" : "lugares selecionados"}`
              : `Faltam ${remainingSeats} ${remainingSeats === 1 ? "lugar" : "lugares"}`}
          </span>
          <span className="text-gray-400">
            {selectedSeats.length} de {passengerCount}
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              allSeatsSelected ? "bg-green-500" : "bg-[#f97316]"
            }`}
            style={{ width: `${(selectedSeats.length / passengerCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-100 border-2 border-green-500 rounded-md" />
          <span className="text-gray-600">Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 border-2 border-blue-600 rounded-md" />
          <span className="text-gray-600">Selecionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-100 border-2 border-gray-300 rounded-md" />
          <span className="text-gray-600">Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-50 border-2 border-yellow-400 rounded-md" />
          <span className="text-gray-600">Espaço extra</span>
        </div>
      </div>

      {/* Aircraft body */}
      <div className="relative mx-auto max-w-md overflow-x-auto scrollbar-hide">
        {/* Nose */}
        <div className="mx-auto w-32 h-12 bg-gray-100 rounded-t-full border border-b-0 border-gray-200 flex items-center justify-center">
          <span className="text-xs font-semibold text-gray-400">FRENTE</span>
        </div>

        {/* Seat map */}
        <div className="min-w-[380px]">
          {/* Column headers */}
          <div className="flex items-center sticky top-0 z-10 bg-white/95 backdrop-blur mb-2 px-1 pt-1">
            <div className="w-8 shrink-0" />
            {columns.map((col) => (
              <div key={col} className="w-10 text-center shrink-0">
                <span className="text-xs font-bold text-gray-500">{col}</span>
              </div>
            ))}
            <div className="w-8 shrink-0" />
          </div>

          {/* Seats grid */}
          <div className="bg-gray-100 border border-gray-200 rounded-xl p-3 space-y-1">
            {Object.entries(rows).map(([rowNum, rowSeats]) => {
              const isExtraLegroom = rowSeats[0]?.isExtraLegroom;
              return (
                <div key={rowNum} className="flex items-center gap-1">
                  <span className="w-8 shrink-0 text-center text-xs font-bold text-gray-400 sticky left-0 bg-gray-100 rounded z-10">
                    {rowNum}
                  </span>
                  {columns.map((col) => {
                    const seat = rowSeats.find((s) => s.column === col);
                    if (!seat) return <div key={col} className="w-10 shrink-0" />;

                    const isSelected = selectedSeats.some((s) => s.id === seat.id);
                    const isOccupied = !seat.isAvailable;

                    return (
                      <button
                        key={col}
                        onClick={() => handleSeatClick(seat)}
                        disabled={isOccupied}
                        title={`${seat.number} ${isOccupied ? "(Ocupado)" : seat.isExtraLegroom ? "(Espaço Extra)" : ""} ${!isOccupied && seat.price > 0 ? `+ ${formatCurrency(seat.price)}` : ""}`}
                        className={`w-10 h-10 shrink-0 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                          isOccupied
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                            : isSelected
                            ? "bg-blue-500 text-white border-2 border-blue-600 shadow-lg shadow-blue-500/30 scale-110"
                            : isExtraLegroom
                            ? "bg-yellow-50 border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-100 hover:border-yellow-500 cursor-pointer"
                            : "bg-green-100 border-2 border-green-500 text-green-700 hover:bg-green-200 hover:border-green-600 cursor-pointer"
                        }`}
                      >
                        {seat.number}
                      </button>
                    );
                  })}
                  <span className="w-8 shrink-0 text-center text-xs font-bold text-gray-400">
                    {rowNum}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tail */}
        <div className="mx-auto w-24 h-8 bg-gray-100 rounded-b-xl border border-t-0 border-gray-200 flex items-center justify-center">
          <span className="text-xs font-semibold text-gray-400">TRÁS</span>
        </div>
      </div>
    </div>
  );
}
