"use client";

import { ArrowLeft, ArrowRight, Calendar, MapPin, Users, X } from "lucide-react";
import { formatDate } from "@/lib/format";

interface SearchHeaderProps {
  origin: string;
  destination: string;
  selectedDate: string | null;
  passengers: number;
  adults: number;
  children: number;
  getOriginCity: () => string;
  getDestCity: () => string;
  onBack?: () => void;
  onClearDate?: () => void;
}

export default function SearchHeader({
  origin,
  destination,
  selectedDate,
  passengers,
  adults,
  children,
  getOriginCity,
  getDestCity,
  onBack,
  onClearDate,
}: SearchHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-[#0a1628] to-[#162544] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <button
          onClick={onBack}
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
              <span>{formatDate(selectedDate)}</span>
              <button
                onClick={onClearDate}
                className="ml-1 text-gray-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
            <Users className="w-4 h-4 text-[#f97316]" />
            <span>
              {children > 0
                ? `${adults} ${adults === 1 ? "adulto" : "adultos"} • ${children} ${children === 1 ? "criança" : "crianças"}`
                : `${passengers} ${passengers === 1 ? "passageiro" : "passageiros"}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
