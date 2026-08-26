"use client";

import { ReactNode, useRef, MouseEvent } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  blur?: boolean;
  border?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
  blur = true,
  border = true,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  // Update the glow position directly on the DOM node to avoid
  // re-rendering the whole card on every mousemove (60fps setState)
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !gradientRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    gradientRef.current.style.setProperty(
      "--mouse-x",
      `${e.clientX - rect.left}px`
    );
    gradientRef.current.style.setProperty(
      "--mouse-y",
      `${e.clientY - rect.top}px`
    );
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={hover ? handleMouseMove : undefined}
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
        blur ? "bg-white/80 backdrop-blur-xl" : "bg-white"
      } ${border ? "border border-white/20" : ""} ${
        hover ? "hover:shadow-2xl hover:scale-[1.02] shadow-lg" : "shadow-lg"
      } ${className}`}
    >
      {/* Mouse follow gradient */}
      {hover && (
        <div
          ref={gradientRef}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(249, 115, 22, 0.1), transparent 40%)",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
