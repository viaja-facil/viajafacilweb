"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, MapPin, Users, X } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { TripLeg } from "@/lib/types";
import { airports } from "@/lib/mock-data";

interface SearchHeaderProps {
  origin: string;
  destination: string;
  selectedDate: string | null;
  passengers: number;
  adults: number;
  childrenCount: number;
  getOriginCity: () => string;
  getDestCity: () => string;
  onBack?: () => void;
  onClearDate?: () => void;
  returnDate?: string | null;
  tripType?: string;
  legs?: TripLeg[];
}

export default function SearchHeader({
  origin,
  destination,
  selectedDate,
  passengers,
  adults,
  childrenCount,
  getOriginCity,
  getDestCity,
  onBack,
  onClearDate,
  returnDate,
  tripType,
  legs,
}: SearchHeaderProps) {
  const router = useRouter();

  if (tripType === "multicity" && legs && legs.length > 0) {
    return (
      <div className="bg-gradient-to-r from-[#0a1628] to-[#162544] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <button
            onClick={onBack || (() => router.push("/"))}
            aria-label="Voltar para a página anterior"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            {legs.map((leg, index) => {
              const originCity = airports.find((a) => a.code === leg.origin)?.city || leg.origin;
              const destCity = airports.find((a) => a.code === leg.destination)?.city || leg.destination;
              return (
                <div key={leg.id} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                    <MapPin className="w-4 h-4 text-[#f97316]" />
                    <span className="font-semibold">{originCity}</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    <span className="font-semibold">{destCity}</span>
                    {leg.date && (
                      <span className="text-gray-400 text-xs ml-1">
                        {formatDate(leg.date)}
                      </span>
                    )}
                  </div>
                  {index < legs.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 mt-3 text-sm w-fit">
            <Users className="w-4 h-4 text-[#f97316]" />
            <span>
              {childrenCount > 0
                ? `${adults} ${adults === 1 ? "adulto" : "adultos"} • ${childrenCount} ${childrenCount === 1 ? "criança" : "crianças"}`
                : `${passengers} ${passengers === 1 ? "passageiro" : "passageiros"}`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#0a1628] to-[#162544] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <button
          onClick={onBack || (() => router.push("/"))}
          aria-label="Voltar para a página anterior"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
            <MapPin className="w-4 h-4 text-[#f97316]" />
            <span className="font-semibold">{getOriginCity()}</span>
            <ArrowRight className="w-3 h-3 text-gray-400" />
            <span className="font-semibold">{getDestCity()}</span>
          </div>
          {selectedDate && (
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <Calendar className="w-4 h-4 text-[#f97316]" />
              <span>{formatDate(selectedDate)}{returnDate ? ` → ${formatDate(returnDate)}` : ""}</span>
              {onClearDate && (
                <button
                  onClick={onClearDate}
                  className="ml-1 text-gray-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
            <Users className="w-4 h-4 text-[#f97316]" />
            <span>
              {childrenCount > 0
                ? `${adults} ${adults === 1 ? "adulto" : "adultos"} • ${childrenCount} ${childrenCount === 1 ? "criança" : "crianças"}`
                : `${passengers} ${passengers === 1 ? "passageiro" : "passageiros"}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
