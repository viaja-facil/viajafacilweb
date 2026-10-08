import type { ReactNode } from "react";
interface ScrollRevealProps { children: ReactNode; className?: string; delay?: number; direction?: "up" | "down" | "left" | "right" | "fade"; duration?: number; once?: boolean }
export default function ScrollReveal({ children, className = "" }: ScrollRevealProps) {
  return <div className={className}>{children}</div>;
}
