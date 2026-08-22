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
          <main className={`flex-1 ${isAdmin ? "" : "pb-16 md:pb-0"}`}>{children}</main>
          {!isAdmin && (
            <>
              <div className="hidden md:block">
                <Footer />
              </div>
              <BottomNav />
            </>
          )}
        </div>
      </BookingProvider>
    </AuthProvider>
  );
}
