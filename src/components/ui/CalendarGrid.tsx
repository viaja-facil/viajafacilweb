"use client";

import { useState, useMemo, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const TODAY = new Date(2026, 7, 21);
const TODAY_STR = TODAY.toISOString().split("T")[0];

export interface CalendarDay {
  day: number;
  dateStr: string;
  isPast: boolean;
  isToday: boolean;
}

interface CalendarGridProps {
  initialMonth?: Date;
  onMonthChange?: (month: Date) => void;
  renderDay: (day: CalendarDay) => ReactNode;
  headerExtra?: ReactNode;
}

export default function CalendarGrid({
  initialMonth,
  onMonthChange,
  renderDay,
  headerExtra,
}: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(() => initialMonth ?? new Date(2026, 7, 1));

  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const result: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++) result.push(d);
    return result;
  }, [currentMonth]);

  const getDateStr = (day: number) => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toISOString()
      .split("T")[0];
  };

  const navigateMonth = (direction: -1 | 1) => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1);
    setCurrentMonth(next);
    onMonthChange?.(next);
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Month header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900">
            {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </p>
          {headerExtra}
        </div>
        <button
          onClick={() => navigateMonth(1)}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1 text-center text-[10px] font-medium text-gray-400">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="h-16" />;
          }

          const dateStr = getDateStr(day);
          const calendarDay: CalendarDay = {
            day,
            dateStr,
            isPast: dateStr < TODAY_STR,
            isToday: dateStr === TODAY_STR,
          };

          return <div key={dateStr}>{renderDay(calendarDay)}</div>;
        })}
      </div>
    </div>
  );
}

export { MONTH_NAMES, TODAY_STR };
