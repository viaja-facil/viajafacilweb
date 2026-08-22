"use client";

import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleFilterProps {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  badge?: string;
  children: ReactNode;
}

export default function CollapsibleFilter({
  title,
  icon,
  defaultOpen = true,
  badge,
  children,
}: CollapsibleFilterProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-left group"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-gray-700">{title}</span>
          {badge && (
            <span className="px-1.5 py-0.5 bg-[#f97316] text-white text-[10px] font-bold rounded-full">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-[500px] opacity-100 pb-3" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
