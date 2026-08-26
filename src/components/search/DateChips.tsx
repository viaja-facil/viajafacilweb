"use client";

import { DateAvailability } from "@/lib/mock-data";

interface DateChipsProps {
  availability: DateAvailability[];
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
}

export default function DateChips({
  availability,
  selectedDate,
  setSelectedDate,
}: DateChipsProps) {
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => setSelectedDate(null)}
        className={`px-4 py-2 min-h-[44px] rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
          !selectedDate
            ? "bg-[#f97316] text-white"
            : "bg-white border border-gray-200 text-gray-600 hover:border-[#f97316]"
        }`}
      >
        Todas as datas
      </button>
      {availability
        .filter((a) => a.hasFlights)
        .slice(0, 14)
        .map((a) => (
          <button
            key={a.date}
            onClick={() => setSelectedDate(a.date)}
            className={`px-4 py-2 min-h-[44px] rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
              selectedDate === a.date
                ? "bg-[#f97316] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#f97316]"
            }`}
          >
            {new Date(a.date + "T12:00:00").toLocaleDateString("pt-AO", {
              day: "numeric",
              month: "short",
            })}
            <span className="ml-1 opacity-70">{a.flightCount}v</span>
          </button>
        ))}
    </div>
  );
}
