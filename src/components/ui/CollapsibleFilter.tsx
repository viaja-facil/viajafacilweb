"use client";

import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleFilterProps {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  badge?: string;
  hasActive?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  children: ReactNode;
}

export default function CollapsibleFilter({
  title,
  icon,
  defaultOpen = true,
  badge,
  hasActive = false,
  isOpen: controlledIsOpen,
  onToggle,
  children,
}: CollapsibleFilterProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <div
      className={`border-b border-gray-100/80 last:border-b-0 transition-colors ${
        hasActive ? "bg-orange-50/40" : ""
      }`}
    >
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between py-2.5 px-1 text-left group hover:bg-gray-50/60 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="shrink-0">{icon}</span>}
          <span className="text-[13px] font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
            {title}
          </span>
          {badge && (
            <span className="px-1.5 py-0.5 bg-[#f97316] text-white text-[10px] font-bold rounded-full leading-none">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:text-gray-600 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? "600px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-1 pb-2.5">{children}</div>
      </div>
    </div>
  );
}
