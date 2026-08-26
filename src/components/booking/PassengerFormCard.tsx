"use client";

import { RefObject } from "react";
import {
  Check,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export interface BiStatus {
  status: "loading" | "found" | "manual";
  message?: string;
}

interface PassengerFormCardProps {
  index: number;
  passenger: { name: string; document: string; seat: string };
  updatePassenger: (index: number, field: "name" | "document", value: string) => void;
  handleDocumentChange: (index: number, value: string) => void;
  lookupBI: (index: number, rawDoc: string) => void;
  biStatus?: BiStatus;
  attemptedGenerate: boolean;
  nameRef?: RefObject<HTMLInputElement | null>;
  docRef?: RefObject<HTMLInputElement | null>;
}

export default function PassengerFormCard({
  index,
  passenger,
  updatePassenger,
  handleDocumentChange,
  biStatus,
  attemptedGenerate,
  nameRef,
  docRef,
}: PassengerFormCardProps) {
  const status = biStatus;
  const docFilled = passenger.document.trim().length > 0;

  const inputBorder =
    status?.status === "loading"
      ? "border-[#f97316] ring-2 ring-[#f97316]/20"
      : status?.status === "found"
        ? "border-green-500 bg-green-50/50"
        : status?.status === "manual"
          ? "border-amber-400 bg-amber-50/40"
          : docFilled
            ? "border-gray-300"
            : "border-gray-200";

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
            status?.status === "found"
              ? "bg-green-500 text-white"
              : "bg-[#f97316] text-white"
          }`}
        >
          {status?.status === "found" ? (
            <Check className="w-4 h-4" />
          ) : (
            index + 1
          )}
        </span>
        <h3 className="text-sm font-semibold text-gray-900">
          Passageiro {index + 1}
        </h3>
        <span className="ml-auto text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-2 py-0.5">
          Assento {passenger.seat}
        </span>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-2">
          Nº do BI / Passaporte
          {status?.status === "loading" && (
            <span className="inline-flex items-center gap-1 font-normal text-[#f97316]">
              <span className="w-3 h-3 border-2 border-orange-200 border-t-[#f97316] rounded-full animate-spin" />
              a validar...
            </span>
          )}
        </label>
        <div className="relative">
          <input
            ref={docRef}
            type="text"
            inputMode="numeric"
            placeholder="Ex.: 000217139NE013"
            value={passenger.document}
            onChange={(e) => handleDocumentChange(index, e.target.value)}
            maxLength={14}
            aria-invalid={status?.status === "manual"}
            aria-describedby={`bi-status-${index}`}
            className={`w-full pl-3 pr-10 py-2.5 bg-white border-2 rounded-xl text-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-all ${
              attemptedGenerate && passenger.document.trim().length <= 5
                ? "border-red-400 bg-red-50/40"
                : inputBorder
            }`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {status?.status === "loading" && (
              <span className="block w-[18px] h-[18px] border-2 border-orange-200 border-t-[#f97316] rounded-full animate-spin" />
            )}
            {status?.status === "found" && (
              <CheckCircle2 className="w-5 h-5 text-green-600 animate-fade-in" />
            )}
            {status?.status === "manual" && (
              <AlertCircle className="w-5 h-5 text-amber-500 animate-fade-in" />
            )}
          </span>
        </div>
        {attemptedGenerate && passenger.document.trim().length <= 5 && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Introduza o BI ou passaporte (min. 6 caracteres)
          </p>
        )}
      </div>

      {status?.status === "found" && (
        <div
          id={`bi-status-${index}`}
          aria-live="polite"
          className="mt-3 bg-green-50 border-2 border-green-200 rounded-xl p-4 animate-fade-in"
        >
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-green-600 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Nome validado via BI
          </p>
          <p className="text-base font-bold text-gray-900 leading-snug">
            {passenger.name}
          </p>
          <p className="text-xs text-green-700 mt-2">
            Confirme que o nome está correto antes de pagar. É este que vai no bilhete.
          </p>
        </div>
      )}

      {status?.status === "manual" && (
        <div
          id={`bi-status-${index}`}
          aria-live="polite"
          className="mt-3 animate-fade-in"
        >
          <label className="text-xs font-semibold text-gray-600 mb-1 block">
            Nome Completo
          </label>
          <input
            ref={nameRef}
            type="text"
            placeholder="Introduza o nome como está no documento"
            value={passenger.name}
            onChange={(e) => updatePassenger(index, "name", e.target.value)}
            className={`w-full px-3 py-2.5 bg-white border-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-all ${
              attemptedGenerate && passenger.name.trim().length <= 2
                ? "border-red-400 bg-red-50/40"
                : passenger.name.trim().length > 2
                  ? "border-green-400"
                  : "border-amber-300"
            }`}
          />
          {attemptedGenerate && passenger.name.trim().length <= 2 ? (
            <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5">
              <AlertCircle className="w-3 h-3" />
              Introduza o nome completo (min. 3 caracteres)
            </p>
          ) : passenger.name.trim().length > 2 ? (
            <p className="flex items-center gap-1.5 text-xs text-green-600 mt-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {passenger.name}
            </p>
          ) : (
            status.message && (
              <p className="flex items-start gap-1.5 text-xs text-amber-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" />
                {status.message}
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}
