"use client";

import { KeyboardEvent, ReactNode, useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
};

type CustomSelectProps = {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
  leadingIcon?: ReactNode;
  className?: string;
  buttonClassName?: string;
};

export default function CustomSelect({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Selecionar opção",
  ariaLabel,
  disabled = false,
  leadingIcon,
  className = "",
  buttonClassName = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value ?? "");
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selectedValue = value ?? internalValue;
  const selectedOption = options.find((option) => option.value === selectedValue);

  useEffect(() => {
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, []);

  const selectOption = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onChange?.(nextValue);
    setIsOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((open) => !open);
      return;
    }

    const currentIndex = Math.max(0, options.findIndex((option) => option.value === selectedValue));
    const nextIndex =
      event.key === "ArrowDown"
        ? Math.min(currentIndex + 1, options.length - 1)
        : event.key === "ArrowUp"
        ? Math.max(currentIndex - 1, 0)
        : event.key === "Home"
        ? 0
        : event.key === "End"
        ? options.length - 1
        : -1;

    if (nextIndex >= 0 && options[nextIndex]) {
      event.preventDefault();
      selectOption(options[nextIndex].value);
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={handleKeyDown}
        className={`w-full flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-left text-sm font-medium text-gray-900 shadow-sm transition-all hover:border-orange-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 ${buttonClassName}`}
      >
        {leadingIcon && <span className="shrink-0 text-gray-400">{leadingIcon}</span>}
        <span className={`min-w-0 flex-1 truncate ${selectedOption ? "" : "text-gray-400"}`}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#f97316]" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel ?? placeholder}
          className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl shadow-slate-900/10 animate-fade-in"
        >
          {options.map((option) => {
            const isSelected = option.value === selectedValue;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => selectOption(option.value)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  isSelected
                    ? "bg-orange-50 font-semibold text-[#ea580c]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{option.label}</span>
                  {option.description && (
                    <span className="mt-0.5 block truncate text-xs font-normal text-gray-400">
                      {option.description}
                    </span>
                  )}
                </span>
                {isSelected && <Check aria-hidden="true" className="h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
