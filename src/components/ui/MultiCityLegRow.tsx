"use client";

import { useRef, useSyncExternalStore, useState } from "react";
import { createPortal } from "react-dom";
import { airports } from "@/lib/mock-data";
import type { DateAvailability, TripLeg } from "@/lib/types";
import { useMediaQuery } from "@/lib/use-media-query";
import CustomSelect from "@/components/ui/CustomSelect";
import AvailabilityCalendar from "@/components/ui/AvailabilityCalendar";
import BottomSheet from "@/components/ui/BottomSheet";
import { MapPin, Calendar, X } from "lucide-react";

interface MultiCityLegRowProps {
  leg: TripLeg;
  index: number;
  totalLegs: number;
  canRemove: boolean;
  availability: DateAvailability[];
  onUpdate: (index: number, field: "origin" | "destination", value: string) => void;
  onRemove: (index: number) => void;
  onDateSelect: (index: number, date: string) => void;
  showCalendar: number | null;
  setShowCalendar: (show: number | null) => void;
}

const airportOptions = [
  { value: "", label: "Selecionar aeroporto" },
  ...airports.map((airport) => ({
    value: airport.code,
    label: `${airport.city} (${airport.code})`,
  })),
];

export default function MultiCityLegRow({
  leg,
  index,
  totalLegs,
  canRemove,
  availability,
  onUpdate,
  onRemove,
  onDateSelect,
  showCalendar,
  setShowCalendar,
}: MultiCityLegRowProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isMobile = useMediaQuery("(max-width: 767px)");
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const formatDateDisplay = (dateStr: string) => {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-AO", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const hasRoute = leg.origin && leg.destination && leg.origin !== leg.destination;
  const hasAvailability = availability.some((a) => a.hasFlights);

  return (
    <div className={`flex flex-col sm:flex-row gap-2 sm:gap-3 p-3 rounded-xl border transition-all ${
      isFocused ? "border-[#f97316] bg-orange-50/50" : "border-gray-200 bg-gray-50/50"
    }`}>
      {/* Leg number indicator */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#f97316] text-white text-xs font-bold shrink-0">
          {index + 1}
        </div>

        {/* Origin */}
        <div className="flex-1 min-w-0">
          <CustomSelect
            value={leg.origin}
            onChange={(value) => onUpdate(index, "origin", value)}
            placeholder="Origem"
            ariaLabel={`Origem do trecho ${index + 1}`}
            leadingIcon={<MapPin className="h-4 w-4" />}
            buttonClassName="py-2 text-sm"
            options={airportOptions}
          />
        </div>

        {/* Destination */}
        <div className="flex-1 min-w-0">
          <CustomSelect
            value={leg.destination}
            onChange={(value) => onUpdate(index, "destination", value)}
            placeholder="Destino"
            ariaLabel={`Destino do trecho ${index + 1}`}
            leadingIcon={<MapPin className="h-4 w-4 text-[#f97316]" />}
            buttonClassName="py-2 text-sm"
            options={airportOptions}
          />
        </div>
      </div>

      {/* Date picker */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:w-32">
          <button
            ref={dateButtonRef}
            type="button"
            onClick={() => {
              if (hasRoute) {
                setShowCalendar(showCalendar === index ? null : index);
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={!hasRoute}
            className={`w-full flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-all ${
              !hasRoute
                ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                : leg.date
                ? "bg-orange-50 border-[#f97316] text-[#f97316]"
                : "bg-white border-gray-200 text-gray-500 hover:border-[#f97316]"
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="truncate text-xs">
              {leg.date ? formatDateDisplay(leg.date) : "Data"}
            </span>
            {leg.date && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Limpar data"
                className="ml-auto p-1 -m-1 shrink-0 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onDateSelect(index, "");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    onDateSelect(index, "");
                  }
                }}
              >
                <X className="w-3 h-3" />
              </span>
            )}
          </button>

          {hasRoute && !hasAvailability && (
            <p className="text-xs text-amber-600 mt-1 px-1">
              Sem voos disponíveis nesta rota
            </p>
          )}

          {/* Calendar popover (desktop) */}
          {showCalendar === index && hasRoute && mounted && !isMobile && createPortal(
            <div
              className="fixed inset-x-0 mx-auto w-full max-w-[320px] px-4 sm:px-0 animate-slide-up z-50"
              style={{ top: dateButtonRef.current ? dateButtonRef.current.getBoundingClientRect().bottom + 8 : 0 }}
            >
              <AvailabilityCalendar
                availability={availability}
                selectedDate={leg.date}
                onDateSelect={(date) => onDateSelect(index, date)}
              />
            </div>,
            document.body
          )}

          {/* Calendar bottom sheet (mobile) */}
          {showCalendar === index && hasRoute && mounted && isMobile && createPortal(
            <BottomSheet
              open={showCalendar === index}
              onClose={() => setShowCalendar(null)}
              title={`Data - Trecho ${index + 1}`}
              subtitle="Toque num dia para ver os melhores preços"
            >
              <AvailabilityCalendar
                availability={availability}
                selectedDate={leg.date}
                onDateSelect={(date) => onDateSelect(index, date)}
              />
            </BottomSheet>,
            document.body
          )}
        </div>

        {/* Remove button */}
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
            aria-label={`Remover trecho ${index + 1}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
