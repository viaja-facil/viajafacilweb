"use client";

import { ReactNode, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Minus, Plus, Users } from "lucide-react";
import { useMediaQuery } from "@/lib/use-media-query";
import BottomSheet from "./BottomSheet";

interface PassengerSelectProps {
  adults: number;
  childrenCount: number;
  onChange: (next: { adults: number; childrenCount: number }) => void;
}

const MAX_ADULTS = 9;
const MAX_CHILDREN = 8;

export default function PassengerSelect({ adults, childrenCount, onChange }: PassengerSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isMobileRef = useRef(isMobile);

  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  const total = adults + childrenCount;
  const summary = `${total} ${total === 1 ? "passageiro" : "passageiros"}`;

  useEffect(() => {
    if (!isOpen || isMobileRef.current) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [isOpen]);

  const update = (field: "adults" | "childrenCount", delta: -1 | 1) => {
    if (field === "adults") {
      onChange({ adults: Math.min(MAX_ADULTS, Math.max(1, adults + delta)), childrenCount });
    } else {
      onChange({ adults, childrenCount: Math.min(MAX_CHILDREN, Math.max(0, childrenCount + delta)) });
    }
  };

  const renderRow = (
    field: "adults" | "childrenCount",
    label: string,
    hint: string,
    count: number,
    min: number,
    max: number
  ) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-400">{hint}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          aria-label={`Remover ${label.toLowerCase()}`}
          disabled={count <= min}
          onClick={() => update(field, -1)}
          className="tap-target flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 transition-colors hover:border-[#f97316] hover:text-[#f97316] disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span aria-live="polite" className="w-6 text-center text-sm font-bold text-gray-900">
          {count}
        </span>
        <button
          type="button"
          aria-label={`Adicionar ${label.toLowerCase()}`}
          disabled={count >= max}
          onClick={() => update(field, 1)}
          className="tap-target flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 transition-colors hover:border-[#f97316] hover:text-[#f97316] disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const panel = (id?: string) => (
    <div
      id={id}
      role="listbox"
      aria-label="Passageiros"
      className={
        id
          ? "absolute z-50 mt-2 right-0 w-full min-w-[280px] rounded-xl border border-gray-100 bg-white p-4 shadow-xl shadow-slate-900/10 animate-fade-in"
          : ""
      }
    >
      {renderRow("adults", "Adultos", "12+ anos", adults, 1, MAX_ADULTS)}
      {renderRow("childrenCount", "Crianças", "2 - 11 anos", childrenCount, 0, MAX_CHILDREN)}
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="mt-3 w-full min-h-[44px] rounded-xl bg-[#f97316] hover:bg-[#ea580c] active:bg-[#dc2626] text-white font-semibold text-sm transition-colors"
      >
        Confirmar
      </button>
    </div>
  );

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Passageiros"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
        }}
        className="w-full flex items-center gap-3 px-4 py-[1.1rem] rounded-xl border border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-900 shadow-sm transition-all hover:border-orange-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
      >
        <Users className="h-5 w-5 shrink-0 text-gray-400" />
        <span className="min-w-0 flex-1 truncate">
          {summary}
          {childrenCount > 0 && (
            <span className="block text-xs font-normal text-gray-400 truncate">
              {adults} {adults === 1 ? "adulto" : "adultos"} • {childrenCount}{" "}
              {childrenCount === 1 ? "criança" : "crianças"}
            </span>
          )}
        </span>
      </button>

      {isOpen &&
        (isMobile ? (
          createPortal(
            <BottomSheet
              open={isOpen}
              onClose={() => setIsOpen(false)}
              title="Passageiros"
              subtitle="Selecione adultos e crianças"
            >
              {panel()}
            </BottomSheet>,
            document.body
          )
        ) : (
          panel(listboxId)
        ))}
    </div>
  );
}
