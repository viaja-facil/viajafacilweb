"use client";

import { ReactNode, useState, useRef, MouseEvent } from "react";

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
        blur ? "bg-white/80 backdrop-blur-xl" : "bg-white"
      } ${border ? "border border-white/20" : ""} ${
        hover && isHovered ? "scale-[1.02] shadow-2xl" : "shadow-lg"
      } ${className}`}
      style={{
        boxShadow: isHovered
          ? `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(249, 115, 22, 0.1)`
          : undefined,
      }}
    >
      {/* Mouse follow gradient */}
      {hover && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 rounded-2xl"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(249, 115, 22, 0.1), transparent 40%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}