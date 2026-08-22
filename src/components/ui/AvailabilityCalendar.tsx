"use client";

import { useState, useMemo } from "react";
import { formatCurrency, DateAvailability } from "@/lib/mock-data";
import { ChevronLeft, ChevronRight, Plane, AlertCircle } from "lucide-react";

interface AvailabilityCalendarProps {
  availability: DateAvailability[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  isLoading?: boolean;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function AvailabilityCalendar({
  availability,
  selectedDate,
  onDateSelect,
  isLoading = false,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date(2026, 7, 1);
    return now;
  });

  const availabilityMap = useMemo(() => {
    const map: Record<string, DateAvailability> = {};
    availability.forEach((a) => {
      map[a.date] = a;
    });
    return map;
  }, [availability]);

  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const result: (number | null)[] = [];

    // Empty slots before first day
    for (let i = 0; i < startDayOfWeek; i++) {
      result.push(null);
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      result.push(d);
    }

    return result;
  }, [currentMonth]);

  const getDateStr = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return new Date(year, month, day).toISOString().split("T")[0];
  };

  const today = new Date(2026, 7, 21);
  const todayStr = today.toISOString().split("T")[0];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isCurrentMonthToday = (day: number) => {
    return getDateStr(day) === todayStr;
  };

  const isPast = (day: number) => {
    return getDateStr(day) < todayStr;
  };

  const hasAvailable = (day: number) => {
    const avail = availabilityMap[getDateStr(day)];
    return avail?.hasFlights ?? false;
  };

  const getDayInfo = (day: number) => {
    return availabilityMap[getDateStr(day)];
  };

  const cheapestInMonth = useMemo(() => {
    const monthAvail = availability.filter((a) => {
      const d = new Date(a.date);
      return (
        d.getMonth() === currentMonth.getMonth() &&
        d.getFullYear() === currentMonth.getFullYear() &&
        a.hasFlights
      );
    });
    if (monthAvail.length === 0) return null;
    return monthAvail.reduce((min, curr) =>
      curr.minPrice < min.minPrice ? curr : min
    );
  }, [availability, currentMonth]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#162544] px-5 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h3 className="text-lg font-bold text-white">
              {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            {cheapestInMonth && (
              <p className="text-xs text-gray-300 mt-0.5">
                A partir de <span className="text-[#f97316] font-bold">{formatCurrency(cheapestInMonth.minPrice)}</span>
              </p>
            )}
          </div>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-600">Disponível</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="text-gray-600">Poucos lugares</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <span className="text-gray-600">Quase esgotado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-200" />
          <span className="text-gray-600">Indisponível</span>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2.5 text-center text-xs font-bold text-gray-500 uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {isLoading ? (
        <div className="p-8 text-center">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-[#f97316] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Carregando disponibilidade...</p>
        </div>
      ) : (
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="h-16 border-b border-r border-gray-50" />;
            }

            const dateStr = getDateStr(day);
            const isPastDate = isPast(day);
            const isToday = isCurrentMonthToday(day);
            const available = hasAvailable(day);
            const dayInfo = getDayInfo(day);
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
                key={dateStr}
                onClick={() => {
                  if (!isPastDate && available) {
                    onDateSelect(dateStr);
                  }
                }}
                disabled={isPastDate || !available}
                className={`h-16 border-b border-r border-gray-50 relative flex flex-col items-center justify-center transition-all group
                  ${isSelected ? "bg-[#f97316] text-white ring-2 ring-[#f97316] ring-inset z-10" : ""}
                  ${!isPastDate && available && !isSelected ? "hover:bg-orange-50 cursor-pointer" : ""}
                  ${isPastDate ? "text-gray-300 cursor-not-allowed" : ""}
                  ${!available && !isPastDate ? "text-gray-300 cursor-not-allowed" : ""}
                  ${isToday && !isSelected ? "ring-2 ring-[#f97316] ring-inset" : ""}
                `}
              >
                <span
                  className={`text-sm font-semibold ${
                    isToday && !isSelected ? "text-[#f97316]" : ""
                  }`}
                >
                  {day}
                </span>

                {available && !isPastDate && (
                  <div className="mt-0.5">
                    {/* Availability dot */}
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected
                          ? "bg-white"
                          : seatStatus === "good"
                          ? "bg-green-500"
                          : seatStatus === "low"
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                    />
                    {/* Price on hover / selected */}
                    {dayInfo && (
                      <span
                        className={`text-[9px] font-bold mt-0.5 block leading-none ${
                          isSelected ? "text-white" : "text-[#f97316] opacity-0 group-hover:opacity-100 transition-opacity"
                        }`}
                      >
                        {formatCurrency(dayInfo.minPrice)}
                      </span>
                    )}
                  </div>
                )}

                {!available && !isPastDate && (
                  <div className="mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Selected date info */}
      {selectedDate && availabilityMap[selectedDate] && (
        <div className="px-5 py-4 bg-orange-50 border-t border-orange-100 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-AO", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {availabilityMap[selectedDate].flightCount} {availabilityMap[selectedDate].flightCount === 1 ? "voo disponível" : "voos disponíveis"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">A partir de</p>
              <p className="text-lg font-bold text-[#f97316]">
                {formatCurrency(availabilityMap[selectedDate].minPrice)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
