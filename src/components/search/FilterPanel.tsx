"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Airline } from "@/lib/mock-data";
import CollapsibleFilter from "@/components/ui/CollapsibleFilter";
import {
  SlidersHorizontal,
  ArrowUpDown,
  CircleDot,
  LuggageIcon,
  HandMetal,
  Sun,
  Moon,
  Sunset,
  Clock,
  Luggage,
  ChevronsUpDown,
  RotateCcw,
} from "lucide-react";

interface FilterPanelProps {
  stops: string;
  setStops: (v: string) => void;
  baggage: string;
  setBaggage: (v: string) => void;
  selectedClass: string;
  setSelectedClass: (v: string) => void;
  minPrice: number;
  setMinPrice: (v: number) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  availableAirlines: Airline[];
  selectedAirlines: string[];
  toggleAirline: (id: string) => void;
  selectedTimeOfDay: string[];
  toggleTimeOfDay: (slot: string) => void;
  clearFilters: () => void;
}

const PRICE_MIN = 0;
const PRICE_MAX = 7000000;
const PRICE_STEP = 50000;

function formatPrice(value: number): string {
  if (value >= 1000000) {
    const m = value / 1000000;
    return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
  }
  if (value >= 1000) {
    const k = value / 1000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(0)}K`;
  }
  return `${value}`;
}

function formatPriceFull(value: number): string {
  return value.toLocaleString("pt-AO");
}

export default function FilterPanel({
  stops,
  setStops,
  baggage,
  setBaggage,
  selectedClass,
  setSelectedClass,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  availableAirlines,
  selectedAirlines,
  toggleAirline,
  selectedTimeOfDay,
  toggleTimeOfDay,
  clearFilters,
}: FilterPanelProps) {
  const [allExpanded, setAllExpanded] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    stops: true,
    price: true,
    class: false,
    airlines: false,
    time: false,
    baggage: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => {
    const expanded: Record<string, boolean> = {};
    Object.keys(openSections).forEach((k) => (expanded[k] = true));
    setOpenSections(expanded);
    setAllExpanded(true);
  };

  const collapseAll = () => {
    const collapsed: Record<string, boolean> = {};
    Object.keys(openSections).forEach((k) => (collapsed[k] = false));
    setOpenSections(collapsed);
    setAllExpanded(false);
  };

  const activeFilterCount =
    selectedAirlines.length +
    selectedTimeOfDay.length +
    (selectedClass !== "all" ? 1 : 0) +
    (stops !== "all" ? 1 : 0) +
    (baggage !== "all" ? 1 : 0) +
    (minPrice > 0 ? 1 : 0) +
    (maxPrice < PRICE_MAX ? 1 : 0);

  const hasStopsActive = stops !== "all";
  const hasPriceActive = minPrice > 0 || maxPrice < PRICE_MAX;

  const minPercent = ((minPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPercent = ((maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const hasClassActive = selectedClass !== "all";
  const hasAirlinesActive = selectedAirlines.length > 0;
  const hasTimeActive = selectedTimeOfDay.length > 0;
  const hasBaggageActive = baggage !== "all";

  const trackRef = useRef<HTMLDivElement>(null);
  const minThumbRef = useRef<HTMLDivElement>(null);
  const maxThumbRef = useRef<HTMLDivElement>(null);
  const activeRangeRef = useRef<HTMLDivElement>(null);
  const minLabelRef = useRef<HTMLSpanElement>(null);
  const maxLabelRef = useRef<HTMLSpanElement>(null);
  const dragState = useRef<{ thumb: "min" | "max"; startVal: number } | null>(null);

  const getValueFromPosition = useCallback((clientX: number) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = PRICE_MIN + percent * (PRICE_MAX - PRICE_MIN);
    return Math.round(raw / PRICE_STEP) * PRICE_STEP;
  }, []);

  const updateThumbVisual = useCallback((thumb: "min" | "max", value: number) => {
    const percent = ((value - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
    const thumbEl = thumb === "min" ? minThumbRef.current : maxThumbRef.current;
    if (thumbEl) {
      thumbEl.style.left = `calc(${percent}% - 10px)`;
    }
  }, []);

  const updateTrackVisual = useCallback((minVal: number, maxVal: number) => {
    const minP = ((minVal - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
    const maxP = ((maxVal - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
    if (activeRangeRef.current) {
      activeRangeRef.current.style.left = `${minP}%`;
      activeRangeRef.current.style.width = `${maxP - minP}%`;
    }
    if (minLabelRef.current) {
      minLabelRef.current.textContent = formatPrice(minVal) + " Kz";
    }
    if (maxLabelRef.current) {
      maxLabelRef.current.textContent = formatPrice(maxVal) + " Kz";
    }
  }, []);

  const handlePointerDown = useCallback((thumb: "min" | "max", e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragState.current = { thumb, startVal: thumb === "min" ? minPrice : maxPrice };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [minPrice, maxPrice]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.current) return;
    const { thumb } = dragState.current;
    const val = getValueFromPosition(e.clientX);

    if (thumb === "min") {
      const clamped = Math.min(val, maxPrice - PRICE_STEP);
      updateThumbVisual("min", clamped);
      const minP = ((clamped - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
      const maxP = ((maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
      if (activeRangeRef.current) {
        activeRangeRef.current.style.left = `${minP}%`;
        activeRangeRef.current.style.width = `${maxP - minP}%`;
      }
      if (minLabelRef.current) minLabelRef.current.textContent = formatPrice(clamped) + " Kz";
    } else {
      const clamped = Math.max(val, minPrice + PRICE_STEP);
      updateThumbVisual("max", clamped);
      const minP = ((minPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
      const maxP = ((clamped - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
      if (activeRangeRef.current) {
        activeRangeRef.current.style.left = `${minP}%`;
        activeRangeRef.current.style.width = `${maxP - minP}%`;
      }
      if (maxLabelRef.current) maxLabelRef.current.textContent = formatPrice(clamped) + " Kz";
    }
  }, [getValueFromPosition, minPrice, maxPrice, updateThumbVisual]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragState.current) return;
    const { thumb } = dragState.current;
    const val = getValueFromPosition(e.clientX);
    if (thumb === "min") {
      setMinPrice(Math.min(val, maxPrice - PRICE_STEP));
    } else {
      setMaxPrice(Math.max(val, minPrice + PRICE_STEP));
    }
    dragState.current = null;
  }, [getValueFromPosition, minPrice, maxPrice, setMinPrice, setMaxPrice]);

  useEffect(() => {
    if (minLabelRef.current) minLabelRef.current.textContent = formatPrice(minPrice) + " Kz";
    if (maxLabelRef.current) maxLabelRef.current.textContent = formatPrice(maxPrice) + " Kz";
  }, [minPrice, maxPrice]);

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-1">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#f97316]" />
          <span className="text-sm font-bold text-gray-900">Filtros</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 bg-[#f97316] text-white text-[10px] font-bold rounded-full leading-none">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-gray-500 hover:text-[#f97316] hover:bg-orange-50 rounded-md transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Limpar
            </button>
          )}
          <button
            onClick={allExpanded ? collapseAll : expandAll}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronsUpDown className="w-3 h-3" />
            {allExpanded ? "Recolher" : "Expandir"}
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-200/60 mb-2" />

      {/* Escalas */}
      <CollapsibleFilter
        title="Escalas"
        icon={<CircleDot className="w-3.5 h-3.5 text-[#f97316]" />}
        isOpen={openSections.stops}
        onToggle={() => toggleSection("stops")}
        hasActive={hasStopsActive}
        badge={
          stops !== "all"
            ? stops === "direct"
              ? "Direto"
              : stops === "1"
              ? "1"
              : "2+"
            : undefined
        }
      >
        <div className="flex gap-1.5">
          {[
            { id: "all", label: "Todas" },
            { id: "direct", label: "Direto" },
            { id: "1", label: "1 escala" },
            { id: "2+", label: "2+ escalas" },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setStops(option.id)}
              className={`flex-1 px-2 py-2 rounded-lg text-[11px] font-semibold border transition-all min-h-[36px] ${
                stops === option.id
                  ? "bg-[#0a1628] border-[#0a1628] text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-600 hover:border-[#f97316] hover:text-gray-800"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </CollapsibleFilter>

      {/* Faixa de Preço - Range Slider */}
      <CollapsibleFilter
        title="Faixa de Preço"
        icon={<span className="text-xs font-bold text-[#f97316]">Kz</span>}
        isOpen={openSections.price}
        onToggle={() => toggleSection("price")}
        hasActive={hasPriceActive}
        badge={
          hasPriceActive
            ? minPrice > 0 && maxPrice < PRICE_MAX
              ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
              : minPrice > 0
              ? `Acima de ${formatPrice(minPrice)}`
              : `Até ${formatPrice(maxPrice)}`
            : undefined
        }
      >
        <div className="space-y-3">
          {/* Valores */}
          <div className="flex items-center justify-between">
            <span ref={minLabelRef} className="text-xs font-semibold text-[#0a1628] bg-gray-100 px-2 py-0.5 rounded">
              {formatPrice(minPrice)} Kz
            </span>
            <span className="text-[10px] text-gray-400">até</span>
            <span ref={maxLabelRef} className="text-xs font-semibold text-[#0a1628] bg-gray-100 px-2 py-0.5 rounded">
              {formatPrice(maxPrice)} Kz
            </span>
          </div>

          {/* Dual Range Slider */}
          <div
            ref={trackRef}
            className="relative pt-1 pb-2 h-8 touch-none select-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* Track background */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-gray-200 rounded-full" />

            {/* Active range */}
            <div
              ref={activeRangeRef}
              className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`,
              }}
            />

            {/* Min thumb */}
            <div
              ref={minThumbRef}
              onPointerDown={(e) => handlePointerDown("min", e)}
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-[#f97316] rounded-full shadow-md cursor-grab z-10 hover:scale-110 active:scale-125 active:shadow-lg transition-shadow"
              style={{ left: `calc(${minPercent}% - 10px)` }}
            />

            {/* Max thumb */}
            <div
              ref={maxThumbRef}
              onPointerDown={(e) => handlePointerDown("max", e)}
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-[#f97316] rounded-full shadow-md cursor-grab z-20 hover:scale-110 active:scale-125 active:shadow-lg transition-shadow"
              style={{ left: `calc(${maxPercent}% - 10px)` }}
            />
          </div>

          {/* Labels */}
          <div className="flex justify-between text-[10px] text-gray-400 -mt-1">
            <span>0</span>
            <span>1.75M</span>
            <span>3.5M</span>
            <span>5.25M</span>
            <span>7M</span>
          </div>

          {/* Presets */}
          <div className="flex gap-1.5 pt-1">
            {[
              { label: "Até 500K", min: 0, max: 500000 },
              { label: "500K - 2M", min: 500000, max: 2000000 },
              { label: "2M - 5M", min: 2000000, max: 5000000 },
              { label: "Acima 5M", min: 5000000, max: PRICE_MAX },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setMinPrice(preset.min);
                  setMaxPrice(preset.max);
                }}
                className={`flex-1 px-1 py-1.5 rounded-md text-[10px] font-medium border transition-all ${
                  minPrice === preset.min && maxPrice === preset.max
                    ? "bg-[#0a1628] border-[#0a1628] text-white"
                    : "bg-white border-gray-200 text-gray-500 hover:border-[#f97316] hover:text-gray-700"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </CollapsibleFilter>

      {/* Classe */}
      <CollapsibleFilter
        title="Classe"
        icon={<ArrowUpDown className="w-3.5 h-3.5 text-[#f97316]" />}
        isOpen={openSections.class}
        onToggle={() => toggleSection("class")}
        hasActive={hasClassActive}
        badge={
          selectedClass !== "all"
            ? selectedClass === "economy"
              ? "Eco"
              : selectedClass === "business"
              ? "Bus"
              : "1ª"
            : undefined
        }
      >
        <div className="flex flex-wrap gap-1.5">
          {["all", "economy", "business", "first"].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-2.5 py-1.5 min-h-[32px] rounded-lg text-[11px] font-medium border transition-colors ${
                selectedClass === cls
                  ? "bg-[#0a1628] border-[#0a1628] text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {cls === "all"
                ? "Todas"
                : cls === "economy"
                ? "Económica"
                : cls === "business"
                ? "Business"
                : "Primeira"}
            </button>
          ))}
        </div>
      </CollapsibleFilter>

      {/* Companhia Aérea */}
      <CollapsibleFilter
        title="Companhia Aérea"
        isOpen={openSections.airlines}
        onToggle={() => toggleSection("airlines")}
        hasActive={hasAirlinesActive}
        badge={
          selectedAirlines.length > 0 ? `${selectedAirlines.length}` : undefined
        }
      >
        <div className="space-y-0.5">
          {availableAirlines.map((airline) => (
            <label
              key={airline.id}
              className="flex items-center gap-2.5 cursor-pointer group select-none py-1 min-h-[32px] hover:bg-gray-50/80 rounded-md px-1 -mx-1 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedAirlines.includes(airline.id)}
                onChange={() => toggleAirline(airline.id)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center transition-all shrink-0 ${
                  selectedAirlines.includes(airline.id)
                    ? "border-[#f97316] bg-[#f97316]"
                    : "border-gray-300 group-hover:border-gray-400"
                }`}
              >
                {selectedAirlines.includes(airline.id) && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-5 h-5 rounded flex items-center justify-center text-[9px] text-white"
                  style={{ backgroundColor: airline.color }}
                >
                  {airline.logo}
                </span>
                <span className="text-[12px] text-gray-600 group-hover:text-gray-800 transition-colors">
                  {airline.name}
                </span>
              </div>
            </label>
          ))}
        </div>
      </CollapsibleFilter>

      {/* Horário de Partida */}
      <CollapsibleFilter
        title="Horário de Partida"
        isOpen={openSections.time}
        onToggle={() => toggleSection("time")}
        hasActive={hasTimeActive}
        badge={
          selectedTimeOfDay.length > 0
            ? `${selectedTimeOfDay.length}`
            : undefined
        }
      >
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: "morning", label: "Manhã", icon: Sun, time: "06h - 12h" },
            { id: "afternoon", label: "Tarde", icon: Sunset, time: "12h - 18h" },
            { id: "evening", label: "Noite", icon: Clock, time: "18h - 22h" },
            { id: "night", label: "Madrugada", icon: Moon, time: "22h - 06h" },
          ].map((slot) => (
            <button
              key={slot.id}
              onClick={() => toggleTimeOfDay(slot.id)}
              className={`flex items-center gap-1.5 px-2 py-2 min-h-[36px] rounded-lg border text-[11px] font-medium transition-all ${
                selectedTimeOfDay.includes(slot.id)
                  ? "bg-[#0a1628] border-[#0a1628] text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-600 hover:border-[#f97316]"
              }`}
            >
              <slot.icon className="w-3 h-3 shrink-0" />
              <span>{slot.label}</span>
            </button>
          ))}
        </div>
      </CollapsibleFilter>

      {/* Bagagem */}
      <CollapsibleFilter
        title="Bagagem"
        icon={<LuggageIcon className="w-3.5 h-3.5 text-[#f97316]" />}
        isOpen={openSections.baggage}
        onToggle={() => toggleSection("baggage")}
        hasActive={hasBaggageActive}
        badge={
          baggage !== "all"
            ? baggage === "with"
              ? "Com despacho"
              : "Só mão"
            : undefined
        }
      >
        <div className="flex gap-1.5">
          {[
            { id: "all", label: "Todas", icon: Luggage },
            { id: "with", label: "Com bagagem", icon: Luggage },
            { id: "without", label: "Só mão", icon: HandMetal },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setBaggage(option.id)}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 min-h-[36px] rounded-lg text-[11px] font-semibold border transition-all ${
                baggage === option.id
                  ? "bg-[#0a1628] border-[#0a1628] text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-600 hover:border-[#f97316]"
              }`}
            >
              <option.icon className="w-3 h-3 shrink-0" />
              <span className="truncate">{option.label}</span>
            </button>
          ))}
        </div>
      </CollapsibleFilter>
    </div>
  );
}
