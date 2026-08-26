"use client";

import { Clock, DollarSign, Zap } from "lucide-react";

type SortBy = "price" | "duration" | "departure";

interface SortBarProps {
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
}

const sortOptions = [
  { id: "price" as SortBy, label: "Menor Preço", Icon: DollarSign },
  { id: "duration" as SortBy, label: "Mais Rápido", Icon: Zap },
  { id: "departure" as SortBy, label: "Partida", Icon: Clock },
];

export default function SortBar({ sortBy, setSortBy }: SortBarProps) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-xs text-gray-500 font-medium">Ordenar:</span>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {sortOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSortBy(option.id)}
            className={`flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
              sortBy === option.id
                ? "bg-[#f97316] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#f97316]"
            }`}
          >
            <option.Icon className="w-3.5 h-3.5" />
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
