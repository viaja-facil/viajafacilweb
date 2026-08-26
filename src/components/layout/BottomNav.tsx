"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plane, User } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/search", icon: Search, label: "Buscar" },
  { href: "/reservas", icon: Plane, label: "Viagens" },
  { href: "/perfil", icon: User, label: "Perfil" },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/reservas") return pathname === "/reservas";
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around h-14" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 h-14 transition-colors ${
                active ? "text-[#f97316]" : "text-gray-400"
              }`}
            >
              <item.icon className={`w-5 h-5 ${active ? "stroke-[2.5px]" : "stroke-[1.5px]"}`} aria-hidden="true" />
              <span className={`text-xs ${active ? "font-semibold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
