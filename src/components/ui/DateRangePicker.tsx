"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import { formatCurrency, DateAvailability } from "@/lib/mock-data";
import CalendarGrid, { CalendarDay } from "./CalendarGrid";

interface DateRangePickerProps {
  availability: DateAvailability[];
  departureDate: string | null;
  returnDate: string | null;
  onDepartureSelect: (date: string) => void;
  onReturnSelect: (date: string) => void;
  onClose: () => void;
}

function useCurrentMonth(): Date {
  return useSyncExternalStore(
    () => () => {},
    () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), 1);
    },
    () => new Date(2026, 7, 1)
  );
}

export default function DateRangePicker({
  availability,
  departureDate,
  returnDate,
  onDepartureSelect,
  onReturnSelect,
  onClose,
}: DateRangePickerProps) {
  const [selectingReturn, setSelectingReturn] = useState(false);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const currentMonth = useCurrentMonth();
  const nextMonth = useMemo(
    () => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    [currentMonth]
  );

  const availabilityMap = useMemo(() => {
    const map: Record<string, DateAvailability> = {};
    availability.forEach((a) => {
      map[a.date] = a;
    });
    return map;
  }, [availability]);

  const isInRange = (dateStr: string) => {
    if (!departureDate) return false;
    const end = selectingReturn ? returnDate || hoverDate : returnDate;
    if (!end) return false;
    return dateStr > departureDate && dateStr < end;
  };

  const handleDayClick = (dateStr: string, isPast: boolean) => {
    const available = availabilityMap[dateStr]?.hasFlights ?? false;
    if (isPast || !available) return;

    if (!selectingReturn) {
      onDepartureSelect(dateStr);
      onReturnSelect("");
      setSelectingReturn(true);
    } else {
      if (dateStr <= (departureDate || "")) {
        onDepartureSelect(dateStr);
        onReturnSelect("");
        setSelectingReturn(true);
      } else {
        onReturnSelect(dateStr);
        setSelectingReturn(false);
      }
    }
  };

  const handleDayHover = (dateStr: string) => {
    if (selectingReturn && departureDate && !returnDate) {
      setHoverDate(dateStr);
    }
  };

  const renderDay = ({ day, dateStr, isPast, isToday }: CalendarDay) => {
    const available = availabilityMap[dateStr]?.hasFlights ?? false;
    const inRange = isInRange(dateStr);
    const isDep = dateStr === departureDate;
    const isRet = dateStr === returnDate;
    const isHover = dateStr === hoverDate;
    const dayInfo = availabilityMap[dateStr];
    const isSelected = isDep || isRet;

    return (
      <div className="relative">
        {/* Range background */}
        {inRange && !isSelected && (
          <div className="absolute inset-0 bg-orange-50" />
        )}
        {isDep && returnDate && (
          <div className="absolute inset-0 bg-orange-50 rounded-l-full" />
        )}
        {isRet && (
          <div className="absolute inset-0 bg-orange-50 rounded-r-full" />
        )}
        {isDep && !returnDate && isHover && (
          <div className="absolute inset-0 bg-orange-50 rounded-l-full" />
        )}

        <button
          onClick={() => handleDayClick(dateStr, isPast)}
          onMouseEnter={() => handleDayHover(dateStr)}
          disabled={isPast || !available}
          className={`relative w-full h-16 flex flex-col items-center justify-center rounded-md transition-all p-2
            ${isSelected
              ? "bg-[#f97316] text-white shadow-sm shadow-orange-500/20"
              : isPast || !available
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-orange-50 cursor-pointer"
            }
            ${isToday && !isSelected ? "ring-1 ring-[#f97316]" : ""}
          `}
        >
          <span className="text-sm font-medium">{day}</span>
          {available && !isPast && dayInfo && (
            <span className={`text-[10px] font-semibold leading-none mt-1.5 ${
              isSelected ? "text-white" : "text-[#f97316]"
            }`}>
              {formatCurrency(dayInfo.minPrice)}
            </span>
          )}
        </button>
      </div>
    );
  };

  return (
    <div data-daterange-root className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden w-full" style={{ maxWidth: "95vw" }}>
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Selecionar Datas</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {selectingReturn
                ? "Agora selecione a data de volta"
                : "Selecione a data de ida"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            Fechar
          </button>
        </div>

        {/* Selection indicators */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${departureDate ? "bg-[#f97316]" : "bg-gray-200"}`} />
            <span className={`text-[11px] font-medium ${departureDate ? "text-gray-900" : "text-gray-400"}`}>
              Ida: {departureDate
                ? new Date(departureDate + "T12:00:00").toLocaleDateString("pt-AO", { day: "numeric", month: "short" })
                : "—"}
            </span>
          </div>
          <div className="flex-1 h-px bg-gray-100" />
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${returnDate ? "bg-[#f97316]" : "bg-gray-200"}`} />
            <span className={`text-[11px] font-medium ${returnDate ? "text-gray-900" : "text-gray-400"}`}>
              Volta: {returnDate
                ? new Date(returnDate + "T12:00:00").toLocaleDateString("pt-AO", { day: "numeric", month: "short" })
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Calendars */}
      <div className="px-3 py-2">
        <div className="flex flex-col md:flex-row gap-2">
          <CalendarGrid
            initialMonth={currentMonth}
            renderDay={renderDay}
          />
          <div className="w-px bg-gray-100" />
          <CalendarGrid
            initialMonth={nextMonth}
            renderDay={renderDay}
          />
        </div>
      </div>

      {/* Footer */}
      {departureDate && returnDate && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-900">
              {new Date(departureDate + "T12:00:00").toLocaleDateString("pt-AO", {
                day: "numeric",
                month: "short",
              })}{" "}
              →{" "}
              {new Date(returnDate + "T12:00:00").toLocaleDateString("pt-AO", {
                day: "numeric",
                month: "short",
              })}
            </p>
            <p className="text-[10px] text-gray-400">
              {Math.ceil(
                (new Date(returnDate).getTime() - new Date(departureDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              {Math.ceil(
                (new Date(returnDate).getTime() - new Date(departureDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              ) === 1
                ? "dia"
                : "dias"}{" "}
              de viagem
            </p>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] px-5 bg-[#f97316] hover:bg-[#ea580c] active:bg-[#dc2626] text-white font-semibold text-sm rounded-xl transition-colors flex items-center"
          >
            Confirmar
          </button>
        </div>
      )}
    </div>
  );
}
