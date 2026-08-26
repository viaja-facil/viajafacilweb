"use client";

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
} from "lucide-react";

interface FilterPanelProps {
  stops: string;
  setStops: (v: string) => void;
  baggage: string;
  setBaggage: (v: string) => void;
  priceRange: string;
  setPriceRange: (v: string) => void;
  selectedClass: string;
  setSelectedClass: (v: string) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  availableAirlines: Airline[];
  selectedAirlines: string[];
  toggleAirline: (id: string) => void;
  selectedTimeOfDay: string[];
  toggleTimeOfDay: (slot: string) => void;
  clearFilters: () => void;
}

export default function FilterPanel({
  stops,
  setStops,
  baggage,
  setBaggage,
  priceRange,
  setPriceRange,
  selectedClass,
  setSelectedClass,
  maxPrice,
  setMaxPrice,
  availableAirlines,
  selectedAirlines,
  toggleAirline,
  selectedTimeOfDay,
  toggleTimeOfDay,
  clearFilters,
}: FilterPanelProps) {
  return (
    <>
      <CollapsibleFilter
        title="Escalas"
        icon={<CircleDot className="w-4 h-4 text-[#f97316]" />}
        defaultOpen={true}
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
        <div className="flex gap-2">
          {[
            { id: "all", label: "Todas" },
            { id: "direct", label: "Direto" },
            { id: "1", label: "1 escala" },
            { id: "2+", label: "2+ escalas" },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setStops(option.id)}
              className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all min-h-[44px] ${
                stops === option.id
                  ? "bg-[#0a1628] border-[#0a1628] text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-[#f97316]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </CollapsibleFilter>

      <CollapsibleFilter
        title="Faixa de Preço"
        icon={<span className="text-sm font-bold text-[#f97316]">Kz</span>}
        defaultOpen={true}
        badge={
          priceRange !== "all"
            ? priceRange === "100"
              ? "Até 100K"
              : priceRange === "200"
              ? "100-200K"
              : priceRange === "500"
              ? "200-500K"
              : "500K+"
            : undefined
        }
      >
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "all", label: "Qualquer" },
            { id: "100", label: "Até 100.000 Kz" },
            { id: "200", label: "100K - 200.000 Kz" },
            { id: "500", label: "200K - 500.000 Kz" },
            { id: "500+", label: "Acima de 500K" },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setPriceRange(option.id)}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all min-h-[44px] ${
                priceRange === option.id
                  ? "bg-[#0a1628] border-[#0a1628] text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-[#f97316]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </CollapsibleFilter>

      <CollapsibleFilter
        title="Classe"
        icon={<ArrowUpDown className="w-4 h-4 text-[#f97316]" />}
        defaultOpen={true}
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
        <div className="flex flex-wrap gap-2">
          {["all", "economy", "business", "first"].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-2 min-h-[44px] rounded-lg text-xs font-medium border transition-colors ${
                selectedClass === cls
                  ? "bg-[#0a1628] border-[#0a1628] text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 active:border-[#f97316]"
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

      <CollapsibleFilter
        title="Companhia Aérea"
        defaultOpen={false}
        badge={
          selectedAirlines.length > 0 ? `${selectedAirlines.length}` : undefined
        }
      >
        <div className="space-y-1">
          {availableAirlines.map((airline) => (
            <label
              key={airline.id}
              className="flex items-center gap-3 cursor-pointer group select-none py-1.5 min-h-[44px]"
            >
              <input
                type="checkbox"
                checked={selectedAirlines.includes(airline.id)}
                onChange={() => toggleAirline(airline.id)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                  selectedAirlines.includes(airline.id)
                    ? "border-[#f97316] bg-[#f97316]"
                    : "border-gray-300 group-hover:border-gray-400"
                }`}
              >
                {selectedAirlines.includes(airline.id) && (
                  <svg
                    className="w-3 h-3 text-white"
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
              <div className="flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded flex items-center justify-center text-xs text-white"
                  style={{ backgroundColor: airline.color }}
                >
                  {airline.logo}
                </span>
                <span className="text-sm text-gray-700">{airline.name}</span>
              </div>
            </label>
          ))}
        </div>
      </CollapsibleFilter>

      <CollapsibleFilter
        title="Horário de Partida"
        defaultOpen={false}
        badge={
          selectedTimeOfDay.length > 0
            ? `${selectedTimeOfDay.length}`
            : undefined
        }
      >
        <div className="flex gap-2 flex-wrap">
          {[
            { id: "morning", label: "Manhã", icon: Sun, time: "06h - 12h" },
            {
              id: "afternoon",
              label: "Tarde",
              icon: Sunset,
              time: "12h - 18h",
            },
            { id: "evening", label: "Noite", icon: Clock, time: "18h - 22h" },
            {
              id: "night",
              label: "Madrugada",
              icon: Moon,
              time: "22h - 06h",
            },
          ].map((slot) => (
            <button
              key={slot.id}
              onClick={() => toggleTimeOfDay(slot.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-xl border text-xs font-medium transition-all ${
                selectedTimeOfDay.includes(slot.id)
                  ? "bg-[#0a1628] border-[#0a1628] text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-[#f97316]"
              }`}
            >
              <slot.icon className="w-3.5 h-3.5" />
              {slot.label}
            </button>
          ))}
        </div>
      </CollapsibleFilter>

      <CollapsibleFilter
        title="Bagagem"
        icon={<LuggageIcon className="w-4 h-4 text-[#f97316]" />}
        defaultOpen={false}
        badge={
          baggage !== "all"
            ? baggage === "with"
              ? "Com despacho"
              : "Só mão"
            : undefined
        }
      >
        <div className="flex gap-2">
          {[
            { id: "all", label: "Todas", icon: Luggage },
            { id: "with", label: "Com bagagem", icon: Luggage },
            { id: "without", label: "Só mão", icon: HandMetal },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setBaggage(option.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold border transition-all ${
                baggage === option.id
                  ? "bg-[#0a1628] border-[#0a1628] text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-[#f97316]"
              }`}
            >
              <option.icon className="w-3.5 h-3.5" />
              {option.label}
            </button>
          ))}
        </div>
      </CollapsibleFilter>
    </>
  );
}
