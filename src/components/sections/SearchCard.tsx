"use client";

import { useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { airports } from "@/lib/mock-data";
import type { DateAvailability, TripLeg } from "@/lib/types";
import { useMediaQuery } from "@/lib/use-media-query";
import AvailabilityCalendar from "@/components/ui/AvailabilityCalendar";
import PassengerSelect from "@/components/ui/PassengerSelect";
import DateRangePicker from "@/components/ui/DateRangePicker";
import CustomSelect from "@/components/ui/CustomSelect";
import MultiCityLegRow from "@/components/ui/MultiCityLegRow";
import BottomSheet from "@/components/ui/BottomSheet";
import {
  Plane,
  Calendar,
  ArrowRight,
  Search,
  MapPin,
  X,
  ArrowLeftRight,
  Plus,
} from "lucide-react";

type TripType = "oneway" | "roundtrip" | "multicity";

interface SearchCardProps {
  origin: string;
  setOrigin: (v: string) => void;
  destination: string;
  setDestination: (v: string) => void;
  date: string | null;
  setDate: (v: string | null) => void;
  departureDate: string | null;
  returnDate: string | null;
  setDepartureDate: (v: string | null) => void;
  setReturnDate: (v: string | null) => void;
  adults: number;
  setAdults: (v: number) => void;
  children: number;
  setChildren: (v: number) => void;
  passengers: number;
  tripType: TripType;
  setTripType: (v: TripType) => void;
  showCalendar: boolean;
  setShowCalendar: (v: boolean) => void;
  showDateRange: boolean;
  setShowDateRange: (v: boolean) => void;
  availability: DateAvailability[];
  hasRouteSelected: boolean;
  handleDateSelect: (date: string) => void;
  handleDepartureSelect: (date: string) => void;
  handleReturnSelect: (date: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  legs?: TripLeg[];
  addLeg?: () => void;
  removeLeg?: (index: number) => void;
  updateLeg?: (index: number, field: "origin" | "destination", value: string) => void;
  getLegAvailability?: (index: number) => DateAvailability[];
  showLegCalendar?: number | null;
  setShowLegCalendar?: (show: number | null) => void;
  handleLegDateSelect?: (index: number, date: string) => void;
  hasAllLegsValid?: boolean;
}

export default function SearchCard({
  origin,
  setOrigin,
  destination,
  setDestination,
  date,
  setDate,
  departureDate,
  returnDate,
  setDepartureDate,
  setReturnDate,
  adults,
  setAdults,
  children,
  setChildren,
  tripType,
  setTripType,
  showCalendar,
  setShowCalendar,
  showDateRange,
  setShowDateRange,
  availability,
  hasRouteSelected,
  handleDateSelect,
  handleDepartureSelect,
  handleReturnSelect,
  handleSearch,
  legs = [],
  addLeg,
  removeLeg,
  updateLeg,
  getLegAvailability,
  showLegCalendar,
  setShowLegCalendar,
  handleLegDateSelect,
  hasAllLegsValid = false,
}: SearchCardProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isMobile = useMediaQuery("(max-width: 767px)");
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const dateRangeButtonRef = useRef<HTMLButtonElement>(null);

  const formatDateDisplay = (dateStr: string) => {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-AO", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const canSubmit = tripType === "multicity" ? hasAllLegsValid : hasRouteSelected;

  return (
    <div className="w-full relative">
      <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-4">
        {/* Trip type - Segmented control */}
        <div className="p-3 pt-3 md:p-5 md:pb-2">
          <div
            role="radiogroup"
            aria-label="Tipo de viagem"
            className="grid grid-cols-3 gap-1 bg-gray-100 rounded-xl p-1 md:inline-flex md:gap-0"
          >
            {[
              { value: "oneway" as const, label: "Só Ida", icon: Plane },
              { value: "roundtrip" as const, label: "Ida e Volta", icon: ArrowRight },
              { value: "multicity" as const, label: "Multi-Cidade", icon: MapPin },
            ].map((option) => {
              const selected = tripType === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex items-center justify-center gap-1.5 cursor-pointer select-none min-h-[44px] rounded-lg px-1 transition-all active:scale-[0.97] ${
                    selected
                      ? "bg-[#f97316] text-white shadow-md shadow-orange-500/25"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="tripType"
                    value={option.value}
                    checked={selected}
                    onChange={() => {
                      setTripType(option.value);
                      if (option.value !== "roundtrip") {
                        setDepartureDate(null);
                        setReturnDate(null);
                        setShowDateRange(false);
                      }
                      if (option.value !== "oneway") {
                        setDate(null);
                        setShowCalendar(false);
                      }
                    }}
                    className="sr-only"
                  />
                  <option.icon className={`w-4 h-4 shrink-0 ${
                    selected ? "text-white" : "text-gray-400"
                  }`} />
                  <span className={`text-xs md:text-sm font-semibold whitespace-nowrap`}>
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSearch} className="px-4 pb-4 pt-1 md:p-5 md:pt-3">
          {tripType === "multicity" ? (
            /* Multi-city form */
            <div className="space-y-3">
              <div className="space-y-2">
                {legs.map((leg, index) => (
                  <MultiCityLegRow
                    key={leg.id}
                    leg={leg}
                    index={index}
                    totalLegs={legs.length}
                    canRemove={legs.length > 2}
                    availability={getLegAvailability?.(index) || []}
                    onUpdate={updateLeg || (() => {})}
                    onRemove={removeLeg || (() => {})}
                    onDateSelect={handleLegDateSelect || (() => {})}
                    showCalendar={showLegCalendar ?? null}
                    setShowCalendar={setShowLegCalendar || (() => {})}
                  />
                ))}
              </div>

              {/* Add leg button */}
              {legs.length < 6 && addLeg && (
                <button
                  type="button"
                  onClick={addLeg}
                  className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:border-[#f97316] hover:text-[#f97316] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar trecho
                </button>
              )}

              {/* Passengers + Search */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="flex-1">
                  <PassengerSelect
                    adults={adults}
                    childrenCount={children}
                    onChange={(next) => {
                      setAdults(next.adults);
                      setChildren(next.childrenCount);
                    }}
                  />
                </div>
                <div className="flex-1 sm:flex-none">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`w-full min-h-[48px] py-[1.1rem] font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm ${
                      canSubmit
                        ? "bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 active:from-[#dc2626] active:to-[#dc2626] active:scale-[0.98]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Search className="w-5 h-5" />
                    Buscar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* One-way / Roundtrip form */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-end">
              {/* Origin */}
              <div className="md:col-span-3 relative">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 block px-1">
                  De onde?
                </label>
                <CustomSelect
                    value={origin}
                    onChange={(nextOrigin) => {
                      setOrigin(nextOrigin);
                      setDate(null);
                      setDepartureDate(null);
                      setReturnDate(null);
                    }}
                    placeholder="Selecionar aeroporto"
                    ariaLabel="Aeroporto de origem"
                    leadingIcon={<MapPin className="h-5 w-5" />}
                    buttonClassName="py-[1.1rem]"
                    options={[
                      { value: "", label: "Selecionar aeroporto" },
                      ...airports.map((airport) => ({
                        value: airport.code,
                        label: `${airport.city} (${airport.code})`,
                      })),
                    ]}
                  />
              </div>

              {/* Destination */}
              <div className="md:col-span-3 relative">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 block px-1">
                  Para onde?
                </label>
                <CustomSelect
                    value={destination}
                    onChange={(nextDestination) => {
                      setDestination(nextDestination);
                      setDate(null);
                      setDepartureDate(null);
                      setReturnDate(null);
                    }}
                    placeholder="Selecionar aeroporto"
                    ariaLabel="Aeroporto de destino"
                    leadingIcon={<MapPin className="h-5 w-5 text-[#f97316]" />}
                    buttonClassName="py-[1.1rem]"
                    options={[
                      { value: "", label: "Selecionar aeroporto" },
                      ...airports.map((airport) => ({
                        value: airport.code,
                        label: `${airport.city} (${airport.code})`,
                      })),
                    ]}
                  />
              </div>

              {/* Date with Calendar */}
              {tripType === "roundtrip" ? (
                <div className="md:col-span-4 relative">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 block px-1">
                    Datas
                  </label>
                  <button
                    ref={dateRangeButtonRef}
                    type="button"
                    onClick={() => {
                      if (hasRouteSelected) {
                        setShowDateRange(!showDateRange);
                        setShowCalendar(false);
                      }
                    }}
                    disabled={!hasRouteSelected}
                    title={
                      !hasRouteSelected
                        ? "Selecione origem e destino primeiro"
                        : undefined
                    }
                    className={`w-full flex items-center gap-2 px-4 py-[1.1rem] border rounded-xl text-sm font-medium transition-all ${
                      !hasRouteSelected
                        ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                        : departureDate || returnDate
                        ? "bg-orange-50 border-[#f97316] text-[#f97316]"
                        : "bg-gray-50 border-gray-200 text-gray-500 hover:border-[#f97316]"
                    }`}
                  >
                    <ArrowLeftRight className="w-5 h-5 shrink-0" />
                    <span className="truncate">
                      {departureDate && returnDate
                        ? `${formatDateDisplay(departureDate)} → ${formatDateDisplay(returnDate)}`
                        : departureDate
                        ? `${formatDateDisplay(departureDate)} → Sel. volta`
                        : "Selecionar datas"}
                    </span>
                    {(departureDate || returnDate) && (
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label="Limpar datas"
                        className="p-2 -m-2 shrink-0 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDepartureDate(null);
                          setReturnDate(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation();
                            setDepartureDate(null);
                            setReturnDate(null);
                          }
                        }}
                      >
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </button>

                  {/* Date Range: popover (desktop) / bottom sheet (mobile) */}
                  {showDateRange && hasRouteSelected && mounted && !isMobile && createPortal(
                    <div
                      data-daterange-root
                      className="fixed inset-x-0 mx-auto w-full max-w-[640px] px-4 sm:px-0 animate-slide-up z-50"
                    >
                      <DateRangePicker
                        availability={availability}
                        departureDate={departureDate}
                        returnDate={returnDate}
                        onDepartureSelect={handleDepartureSelect}
                        onReturnSelect={handleReturnSelect}
                        onClose={() => setShowDateRange(false)}
                      />
                    </div>,
                    document.body
                  )}
                  {showDateRange && hasRouteSelected && mounted && isMobile && createPortal(
                    <BottomSheet
                      open={showDateRange}
                      onClose={() => setShowDateRange(false)}
                      title="Selecionar datas"
                      subtitle="Escolha a ida e a volta"
                    >
                      <DateRangePicker
                        availability={availability}
                        departureDate={departureDate}
                        returnDate={returnDate}
                        onDepartureSelect={handleDepartureSelect}
                        onReturnSelect={handleReturnSelect}
                        onClose={() => setShowDateRange(false)}
                      />
                    </BottomSheet>,
                    document.body
                  )}
                </div>
              ) : (
                <div className="md:col-span-2 relative">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 block px-1">
                    Data
                  </label>
                  <button
                    ref={dateButtonRef}
                    type="button"
                    onClick={() => {
                      if (hasRouteSelected) {
                        setShowCalendar(!showCalendar);
                        setShowDateRange(false);
                      }
                    }}
                    disabled={!hasRouteSelected}
                    title={
                      !hasRouteSelected
                        ? "Selecione origem e destino primeiro"
                        : undefined
                    }
                    className={`w-full flex items-center gap-2 px-4 py-[1.1rem] border rounded-xl text-sm font-medium transition-all ${
                      !hasRouteSelected
                        ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                        : date
                        ? "bg-orange-50 border-[#f97316] text-[#f97316]"
                        : "bg-gray-50 border-gray-200 text-gray-500 hover:border-[#f97316]"
                    }`}
                  >
                    <Calendar className="w-5 h-5 shrink-0" />
                    <span className="truncate">
                      {date ? formatDateDisplay(date) : "Selecionar"}
                    </span>
                    {date && (
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label="Limpar data"
                        className="ml-auto p-2 -m-2 shrink-0 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDate(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation();
                            setDate(null);
                          }
                        }}
                      >
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </button>

                  {/* Calendar: popover (desktop) / bottom sheet (mobile) */}
                  {showCalendar && hasRouteSelected && mounted && !isMobile && createPortal(
                    <div
                      data-calendar-root
                      className="fixed inset-x-0 mx-auto w-full max-w-[320px] px-4 sm:px-0 animate-slide-up z-50"
                    >
                      <AvailabilityCalendar
                        availability={availability}
                        selectedDate={date}
                        onDateSelect={handleDateSelect}
                      />
                    </div>,
                    document.body
                  )}
                  {showCalendar && hasRouteSelected && mounted && isMobile && createPortal(
                    <BottomSheet
                      open={showCalendar}
                      onClose={() => setShowCalendar(false)}
                      title="Selecionar data"
                      subtitle="Toque num dia para ver os melhores preços"
                    >
                      <AvailabilityCalendar
                        availability={availability}
                        selectedDate={date}
                        onDateSelect={handleDateSelect}
                      />
                    </BottomSheet>,
                    document.body
                  )}
                </div>
              )}

              {/* Passengers: adults + children */}
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 block px-1">
                  Passageiros
                </label>
                <PassengerSelect
                  adults={adults}
                  childrenCount={children}
                  onChange={(next) => {
                    setAdults(next.adults);
                    setChildren(next.childrenCount);
                  }}
                />
              </div>

              {/* Search Button */}
              <div className="md:col-span-2">
                <span className="hidden md:block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 px-1 invisible">
                  &nbsp;
                </span>
                <button
                  type="submit"
                  className="w-full min-h-[48px] py-[1.1rem] bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center justify-center gap-2 text-sm active:from-[#dc2626] active:to-[#dc2626] active:scale-[0.98]"
                >
                  <Search className="w-5 h-5" />
                  Buscar
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
