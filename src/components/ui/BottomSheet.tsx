"use client";

import { ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function BottomSheet({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: BottomSheetProps) {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [dragY, setDragY] = useState(0);
  const dragStartY = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!isMounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={dragY > 0 ? { transform: `translateY(${dragY}px)`, transition: "none" } : undefined}
        onTouchStart={(e) => {
          if ((e.target as HTMLElement).closest("[data-sheet-scroll]")) return;
          dragStartY.current = e.touches[0].clientY;
        }}
        onTouchMove={(e) => {
          if (dragStartY.current === null) return;
          const delta = e.touches[0].clientY - dragStartY.current;
          if (delta > 0) setDragY(delta);
        }}
        onTouchEnd={() => {
          if (dragY > 96) {
            onClose();
          }
          setDragY(0);
          dragStartY.current = null;
        }}
        className="absolute bottom-0 left-0 right-0 flex flex-col max-h-[88vh] rounded-t-2xl bg-white shadow-2xl animate-sheet-up mx-auto md:max-w-md"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2.5 pb-1 shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-gray-200" />
        </div>

        {(title || subtitle) && (
          <div className="flex items-start justify-between px-5 pb-3 pt-1 border-b border-gray-100 shrink-0">
            <div>
              {title && <h3 className="text-sm font-bold text-gray-900">{title}</h3>}
              {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="tap-target -mr-2 -mt-1 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div
          data-sheet-scroll
          className="overflow-y-auto flex-1 overscroll-contain px-5 py-4"
        >
          {children}
        </div>

        {footer && (
          <div className="border-t border-gray-100 bg-white px-5 pt-3 pb-safe shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
