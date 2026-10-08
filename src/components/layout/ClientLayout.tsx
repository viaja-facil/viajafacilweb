"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/lib/auth-context";
import { BookingProvider } from "@/lib/booking-context";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <BookingProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          {!isAdmin && <Header />}
          {!isAdmin && <div className="border-b border-orange-200 bg-orange-50 px-4 py-2 text-center text-xs leading-relaxed text-orange-900">Demonstração: voos, contas e pagamentos simulados. Sem cobrança ou emissão de bilhetes.</div>}
          <main id="conteudo" className={`flex-1 ${isAdmin || pathname === "/" ? "" : "pb-16 md:pb-0"}`}>{children}</main>
          {!isAdmin && (
            <>
              <div className={pathname === "/" ? "" : "pb-20 md:pb-0"}>
                <Footer />
              </div>
              {pathname !== "/" && <BottomNav />}
            </>
          )}
        </div>
      </BookingProvider>
    </AuthProvider>
  );
}
