"use client";

import { Check } from "lucide-react";
import { useBooking } from "@/lib/booking-context";

const steps = [
  { key: "search", label: "Buscar" },
  { key: "select", label: "Voo" },
  { key: "seats", label: "Assentos" },
  { key: "checkout", label: "Pagamento" },
  { key: "confirmation", label: "Confirmação" },
] as const;

const stepOrder: Record<string, number> = {
  search: 0,
  select: 1,
  seats: 2,
  checkout: 3,
  confirmation: 4,
};

export default function BookingStepper() {
  const { booking } = useBooking();
  const currentIndex = stepOrder[booking.step] ?? 0;

  return (
    <div className="sticky top-16 z-40 bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        {steps.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isCompleted
                      ? "bg-[#f97316] text-white"
                      : isCurrent
                        ? "bg-[#f97316] text-white ring-4 ring-orange-100"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    isCurrent ? "text-[#f97316]" : isCompleted ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 mt-0 sm:mt-0 rounded-full ${
                    isCompleted ? "bg-[#f97316]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
