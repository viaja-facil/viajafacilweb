"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import BottomSheet from "./BottomSheet";
import { useMediaQuery } from "@/lib/use-media-query";

const isoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const parseDate = (date: string) => new Date(`${date}T12:00:00`);
const weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function DateSelect({
  value,
  min,
  onChange,
  ariaLabel,
}: {
  value: string | null;
  min: string;
  onChange: (date: string) => void;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() =>
    parseDate(value && value >= min ? value : min),
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const mobile = useMediaQuery("(max-width: 767px)");
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open || mobile) return;
    panelRef.current
      ?.querySelector<HTMLButtonElement>(`[data-date="${value || min}"]`)
      ?.focus();
    const outside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open, mobile, close, value, min]);

  const year = month.getFullYear();
  const index = month.getMonth();
  const first = (new Date(year, index, 1).getDay() + 6) % 7;
  const length = new Date(year, index + 1, 0).getDate();
  const previousAllowed = isoDate(new Date(year, index, 0)) >= min;
  const pick = (date: string) => {
    onChange(date);
    close();
  };
  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, date: string) => {
    const delta = (
      { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 } as Record<
        string,
        number
      >
    )[event.key];
    if (delta === undefined) return;
    event.preventDefault();
    const next = parseDate(date);
    next.setDate(next.getDate() + delta);
    const nextDate = isoDate(next);
    if (nextDate < min) return;
    if (next.getMonth() !== index || next.getFullYear() !== year) {
      setMonth(next);
      requestAnimationFrame(() =>
        panelRef.current
          ?.querySelector<HTMLButtonElement>(`[data-date="${nextDate}"]`)
          ?.focus(),
      );
    } else
      panelRef.current
        ?.querySelector<HTMLButtonElement>(`[data-date="${nextDate}"]`)
        ?.focus();
  };
  const panel = (
    <div ref={panelRef} className="date-select-calendar">
      <div className="date-select-month">
        <button
          type="button"
          aria-label="Mês anterior"
          disabled={!previousAllowed}
          onClick={() => setMonth(new Date(year, index - 1, 1))}
        >
          <ChevronLeft size={18} />
        </button>
        <p aria-live="polite">
          {month.toLocaleDateString("pt-AO", {
            month: "long",
            year: "numeric",
          })}
        </p>
        <button
          type="button"
          aria-label="Próximo mês"
          onClick={() => setMonth(new Date(year, index + 1, 1))}
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="date-select-grid">
        {weekdays.map((day) => (
          <span key={day} aria-hidden="true">
            {day}
          </span>
        ))}
        {Array.from({ length: first }, (_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {Array.from({ length }, (_, i) => {
          const date = isoDate(new Date(year, index, i + 1));
          return (
            <button
              type="button"
              key={date}
              data-date={date}
              aria-label={parseDate(date).toLocaleDateString("pt-AO", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              aria-pressed={date === value}
              disabled={date < min}
              onClick={() => pick(date)}
              onKeyDown={(event) => moveFocus(event, date)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <p className="date-select-hint">Escolha uma data para a sua viagem.</p>
    </div>
  );
  return (
    <div ref={rootRef} className="date-select">
      <button
        ref={triggerRef}
        type="button"
        className="home-control"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setMonth(parseDate(value && value >= min ? value : min));
          setOpen(!open);
        }}
      >
        <Calendar size={17} aria-hidden="true" />
        <span>
          {value
            ? parseDate(value).toLocaleDateString("pt-AO", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "Escolher data"}
        </span>
      </button>
      {open &&
        (mobile ? (
          <BottomSheet open={open} onClose={close} title={ariaLabel}>
            <div id={id}>{panel}</div>
          </BottomSheet>
        ) : (
          <div
            className="date-select-popover"
            id={id}
            role="dialog"
            aria-label={ariaLabel}
            onBlur={(event) => {
              if (
                !event.currentTarget.parentElement?.contains(
                  event.relatedTarget,
                )
              )
                setOpen(false);
            }}
          >
            <div className="date-select-title">
              <strong>{ariaLabel}</strong>
              <button
                type="button"
                aria-label="Fechar calendário"
                onClick={close}
              >
                <X size={17} />
              </button>
            </div>
            {panel}
          </div>
        ))}
    </div>
  );
}
