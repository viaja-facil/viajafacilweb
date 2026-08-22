"use client";

import { useState, useMemo } from "react";
import { formatCurrency, DateAvailability } from "@/lib/mock-data";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateRangePickerProps {
  availability: DateAvailability[];
  departureDate: string | null;
  returnDate: string | null;
  onDepartureSelect: (date: string) => void;
  onReturnSelect: (date: string) => void;
  onClose: () => void;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

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

  const [monthLeft, setMonthLeft] = useState(() => new Date(2026, 7, 1));
  const [monthRight, setMonthRight] = useState(() => new Date(2026, 8, 1));

  const availabilityMap = useMemo(() => {
    const map: Record<string, DateAvailability> = {};
    availability.forEach((a) => {
      map[a.date] = a;
    });
    return map;
  }, [availability]);

  const today = new Date(2026, 7, 21);
  const todayStr = today.toISOString().split("T")[0];

  const generateDays = (month: Date) => {
    const year = month.getFullYear();
    const m = month.getMonth();
    const firstDay = new Date(year, m, 1).getDay();
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const result: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++) result.push(d);
    return result;
  };

  const getDateStr = (month: Date, day: number) => {
    return new Date(month.getFullYear(), month.getMonth(), day)
      .toISOString()
      .split("T")[0];
  };

  const isPast = (dateStr: string) => dateStr < todayStr;

  const isAvailable = (dateStr: string) => {
    const a = availabilityMap[dateStr];
    return a?.hasFlights ?? false;
  };

  const isInRange = (dateStr: string) => {
    if (!departureDate) return false;
    const end = selectingReturn
      ? returnDate || hoverDate
      : returnDate;
    if (!end) return false;
    const start = departureDate;
    return dateStr > start && dateStr < end;
  };

  const isDeparture = (dateStr: string) => dateStr === departureDate;
  const isReturn = (dateStr: string) => dateStr === returnDate;

  const handleDayClick = (dateStr: string) => {
    if (isPast(dateStr) || !isAvailable(dateStr)) return;

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

  const renderCalendar = (month: Date, side: "left" | "right") => {
    const days = generateDays(month);

    return (
      <div className="flex-1 min-w-0">
        {/* Month header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              if (side === "left") {
                setMonthLeft(new Date(monthLeft.getFullYear(), monthLeft.getMonth() - 1, 1));
              } else {
                setMonthRight(new Date(monthRight.getFullYear(), monthRight.getMonth() - 1, 1));
              }
            }}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <p className="text-sm font-bold text-gray-900">
            {MONTH_NAMES[month.getMonth()]} {month.getFullYear()}
          </p>
          <button
            onClick={() => {
              if (side === "left") {
                setMonthLeft(new Date(monthLeft.getFullYear(), monthLeft.getMonth() + 1, 1));
              } else {
                setMonthRight(new Date(monthRight.getFullYear(), monthRight.getMonth() + 1, 1));
              }
            }}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1 text-center text-[10px] font-bold text-gray-400 uppercase">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="h-9" />;
            }

            const dateStr = getDateStr(month, day);
            const past = isPast(dateStr);
            const available = isAvailable(dateStr);
            const inRange = isInRange(dateStr);
            const isDep = isDeparture(dateStr);
            const isRet = isReturn(dateStr);
            const isToday = dateStr === todayStr;
            const isHover = dateStr === hoverDate;

            const isSelected = isDep || isRet;

            return (
              <div key={dateStr} className="relative">
                {/* Range background */}
                {inRange && !isSelected && (
                  <div className="absolute inset-0 bg-orange-100" />
                )}
                {isDep && returnDate && (
                  <div className="absolute inset-0 bg-orange-100 rounded-l-full" />
                )}
                {isRet && (
                  <div className="absolute inset-0 bg-orange-100 rounded-r-full" />
                )}
                {isDep && !returnDate && isHover && (
                  <div className="absolute inset-0 bg-orange-100 rounded-l-full" />
                )}

                <button
                  onClick={() => handleDayClick(dateStr)}
                  onMouseEnter={() => handleDayHover(dateStr)}
                  disabled={past || !available}
                  className={`relative w-full h-9 flex items-center justify-center text-xs font-semibold transition-all
                    ${isSelected
                      ? "bg-[#f97316] text-white rounded-full z-10 shadow-md shadow-orange-500/30"
                      : past || !available
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-orange-50 cursor-pointer"
                    }
                    ${isToday && !isSelected ? "ring-1 ring-[#f97316]" : ""}
                  `}
                >
                  {day}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#162544] px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Selecionar Datas</h3>
            <p className="text-xs text-gray-300">
              {selectingReturn
                ? "Agora selecione a data de volta"
                : "Selecione a data de ida"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm font-semibold"
          >
            Fechar
          </button>
        </div>

        {/* Selection indicators */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${departureDate ? "bg-[#f97316]" : "bg-white/20"}`} />
            <span className={`text-xs font-medium ${departureDate ? "text-white" : "text-gray-400"}`}>
              Ida: {departureDate
                ? new Date(departureDate + "T12:00:00").toLocaleDateString("pt-AO", { day: "numeric", month: "short" })
                : "Selecionar"}
            </span>
          </div>
          <div className="flex-1 h-px bg-white/20" />
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${returnDate ? "bg-[#f97316]" : "bg-white/20"}`} />
            <span className={`text-xs font-medium ${returnDate ? "text-white" : "text-gray-400"}`}>
              Volta: {returnDate
                ? new Date(returnDate + "T12:00:00").toLocaleDateString("pt-AO", { day: "numeric", month: "short" })
                : "Selecionar"}
            </span>
          </div>
        </div>
      </div>

      {/* Calendars */}
      <div className="p-4">
        <div className="flex gap-4">
          {renderCalendar(monthLeft, "left")}
          <div className="w-px bg-gray-100" />
          {renderCalendar(monthRight, "right")}
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#f97316]" />
          <span className="text-gray-600">Selecionado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-orange-100 border border-orange-200" />
          <span className="text-gray-600">No período</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-600">Disponível</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-200" />
          <span className="text-gray-600">Indisponível</span>
        </div>
      </div>

      {/* Footer */}
      {departureDate && returnDate && (
        <div className="px-5 py-4 bg-orange-50 border-t border-orange-100 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(departureDate + "T12:00:00").toLocaleDateString("pt-AO", {
                  day: "numeric",
                  month: "long",
                })}{" "}
                →{" "}
                {new Date(returnDate + "T12:00:00").toLocaleDateString("pt-AO", {
                  day: "numeric",
                  month: "long",
                })}
              </p>
              <p className="text-xs text-gray-500">
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
              className="px-5 py-2.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-sm rounded-xl transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
