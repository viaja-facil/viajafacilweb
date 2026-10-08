"use client";

import { ReactNode, useId } from "react";
import { ChevronDown } from "lucide-react";

export type SelectOption = { value: string; label: string; description?: string };
type CustomSelectProps = {
  options: SelectOption[]; value?: string; defaultValue?: string;
  onChange?: (value: string) => void; placeholder?: string; ariaLabel?: string;
  disabled?: boolean; leadingIcon?: ReactNode; className?: string; buttonClassName?: string;
};

export default function CustomSelect({ options, value, defaultValue, onChange, placeholder = "Selecionar opção", ariaLabel, disabled, leadingIcon, className = "", buttonClassName = "" }: CustomSelectProps) {
  const id = useId();
  return (
    <div className={`relative ${className}`}>
      {leadingIcon && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-600">{leadingIcon}</span>}
      <select id={id} value={value} defaultValue={defaultValue} onChange={(e) => onChange?.(e.target.value)} aria-label={ariaLabel ?? placeholder} disabled={disabled}
        className={`min-h-12 w-full min-w-0 appearance-none rounded-xl border border-slate-300 bg-white py-3 pr-9 text-sm font-medium text-slate-900 disabled:bg-slate-100 disabled:text-slate-500 ${leadingIcon ? "pl-10" : "pl-3"} ${buttonClassName}`}>
        {!options.some((option) => option.value === "") && <option value="">{placeholder}</option>}
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
    </div>
  );
}
