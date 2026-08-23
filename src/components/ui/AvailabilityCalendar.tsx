"use client";

import { useMemo } from "react";
import { formatCurrency, DateAvailability } from "@/lib/mock-data";
import CalendarGrid, { CalendarDay } from "./CalendarGrid";

interface AvailabilityCalendarProps {
  availability: DateAvailability[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  isLoading?: boolean;
}

export default function AvailabilityCalendar({
  availability,
  selectedDate,
  onDateSelect,
  isLoading = false,
}: AvailabilityCalendarProps) {
  const availabilityMap = useMemo(() => {
    const map: Record<string, DateAvailability> = {};
    availability.forEach((a) => {
      map[a.date] = a;
    });
    return map;
  }, [availability]);

  const cheapestInMonth = useMemo(() => {
    const monthAvail = availability.filter((a) => a.hasFlights);
    if (monthAvail.length === 0) return null;
    return monthAvail.reduce((min, curr) =>
      curr.minPrice < min.minPrice ? curr : min
    );
  }, [availability]);

  const renderDay = ({ day, dateStr, isPast, isToday }: CalendarDay) => {
    const available = availabilityMap[dateStr]?.hasFlights ?? false;
    const dayInfo = availabilityMap[dateStr];
    const isSelected = selectedDate === dateStr;

    const seatStatus = dayInfo
      ? dayInfo.flightCount > 3
        ? "good"
        : dayInfo.flightCount > 1
        ? "low"
        : "critical"
      : null;

    return (
      <button
        onClick={() => {
          if (!isPast && available) {
            onDateSelect(dateStr);
          }
        }}
        disabled={isPast || !available}
        className={`relative w-full h-16 flex flex-col items-center justify-center rounded-lg transition-all text-center p-2
          ${isSelected ? "bg-[#f97316] text-white shadow-md shadow-orange-500/20" : ""}
          ${!isPast && available && !isSelected ? "hover:bg-orange-50 cursor-pointer" : ""}
          ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
          ${!available && !isPast ? "text-gray-300 cursor-not-allowed" : ""}
          ${isToday && !isSelected ? "ring-1 ring-[#f97316]" : ""}
        `}
      >
        <span className={`text-sm font-semibold ${isToday && !isSelected ? "text-[#f97316]" : ""}`}>
          {day}
        </span>

        {available && !isPast && dayInfo && (
          <span className={`text-[10px] font-semibold leading-none mt-1.5 ${
            isSelected ? "text-white" : "text-[#f97316]"
          }`}>
            {formatCurrency(dayInfo.minPrice)}
          </span>
        )}

        {available && !isPast && (
          <div className="absolute top-1.5 right-1.5">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isSelected
                  ? "bg-white/80"
                  : seatStatus === "good"
                  ? "bg-green-400"
                  : seatStatus === "low"
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}
            />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden w-full" style={{ maxWidth: "90vw" }}>
      {isLoading ? (
        <div className="p-6 text-center">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-[#f97316] rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-400">Carregando...</p>
        </div>
      ) : (
        <div className="px-4 py-3">
          <CalendarGrid
            headerExtra={
              cheapestInMonth && (
                <p className="text-[10px] text-gray-400 mt-0.5">
                  A partir de <span className="text-[#f97316] font-semibold">{formatCurrency(cheapestInMonth.minPrice)}</span>
                </p>
              )
            }
            renderDay={renderDay}
          />
        </div>
      )}

      {/* Legend */}
      <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-center gap-3 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-gray-500">Disponível</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <span className="text-gray-500">Poucos</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-gray-500">Esgotado</span>
        </div>
      </div>
    </div>
  );
}
