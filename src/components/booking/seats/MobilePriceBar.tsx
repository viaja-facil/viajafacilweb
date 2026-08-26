"use client";

import { ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/mock-data";

interface MobilePriceBarProps {
  grandTotal: number;
  allSeatsSelected: boolean;
  selectedSeatsCount: number;
  passengerCount: number;
  handleContinue: () => void;
}

export default function MobilePriceBar({
  grandTotal,
  allSeatsSelected,
  selectedSeatsCount,
  passengerCount,
  handleContinue,
}: MobilePriceBarProps) {
  const remainingSeats = passengerCount - selectedSeatsCount;

  return (
    <div className="lg:hidden fixed bottom-14 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-500">
            {allSeatsSelected
              ? `${selectedSeatsCount} assento${selectedSeatsCount > 1 ? "s" : ""}`
              : remainingSeats === passengerCount
              ? "Nenhum assento"
              : `Faltam ${remainingSeats} lugar${remainingSeats > 1 ? "es" : ""}`}
          </p>
          <p className="text-xl font-bold text-[#f97316]">{formatCurrency(grandTotal)}</p>
        </div>
        <button
          onClick={handleContinue}
          disabled={!allSeatsSelected}
          className="min-h-[44px] px-6 py-2.5 bg-gradient-to-r from-[#f97316] to-[#ea580c] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:shadow-none flex items-center justify-center gap-2"
        >
          Continuar
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
