"use client";

import { ReactNode, useRef, MouseEvent } from "react";

interface GradientButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export default function GradientButton({
  children,
  className = "",
  onClick,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
}: GradientButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Update the glow position directly on the DOM node to avoid
  // re-rendering on every mousemove (60fps setState)
  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || !glowRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    glowRef.current.style.setProperty(
      "--mouse-x",
      `${e.clientX - rect.left}px`
    );
    glowRef.current.style.setProperty(
      "--mouse-y",
      `${e.clientY - rect.top}px`
    );
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white shadow-lg shadow-orange-500/30 hover:shadow-xl",
    secondary: "bg-white text-gray-900 border border-gray-200",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={variant === "primary" ? handleMouseMove : undefined}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 ${sizeClasses[size]} ${variantClasses[variant]} ${
        variant === "primary"
          ? "hover:scale-[1.03] [@media(hover:none)]:hover:scale-100"
          : ""
      } ${className}`}
    >
      {/* Mouse follow glow */}
      {variant === "primary" && (
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.3), transparent 40%)",
          }}
        />
      )}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {icon && iconPosition === "left" && icon}
        <span>{children}</span>
        {icon && iconPosition === "right" && icon}
      </div>
    </button>
  );
}
