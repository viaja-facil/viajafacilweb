"use client";

import { formatCurrency } from "@/lib/mock-data";
import { Lock } from "lucide-react";

interface MobileStickyBarProps {
  grandTotal: number;
  isFormValid: boolean;
  isProcessing: boolean;
  handlePayment: () => void;
}

export default function MobileStickyBar({
  grandTotal,
  isProcessing,
  handlePayment,
}: MobileStickyBarProps) {
  return (
    <div className="md:hidden fixed bottom-14 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl font-bold text-[#f97316]">
            {formatCurrency(grandTotal)}
          </p>
        </div>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex-1 max-w-[200px] py-3 bg-gradient-to-r from-[#f97316] to-[#ea580c] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:shadow-none flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" />
          Pagar
        </button>
      </div>
    </div>
  );
}
