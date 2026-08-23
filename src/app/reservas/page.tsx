"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { mockBookings } from "@/lib/mock-data";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BookingsList from "@/components/bookings/BookingsList";
import { ChevronRight } from "lucide-react";

function ReservasContent() {
  const { user } = useAuth();
  const bookings = mockBookings.filter((b) => b.userId === user?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#162544] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-bold">Minhas Reservas</h1>
          <p className="text-gray-400 text-sm mt-1">
            {bookings.length > 0
              ? `${bookings.length} ${bookings.length === 1 ? "reserva" : "reservas"}`
              : "Acompanhe aqui as suas viagens"}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <Link
          href="/perfil"
          className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 p-5 mb-6 hover:border-[#f97316] transition-colors group"
        >
          <span className="text-sm font-bold text-gray-900">Ver dados da conta</span>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#f97316] transition-colors" />
        </Link>

        <section className="bg-white rounded-2xl border border-gray-200 p-5">
          <BookingsList userId={user?.id || ""} />
        </section>
      </div>
    </div>
  );
}

export default function ReservasPage() {
  return (
    <ProtectedRoute>
      <ReservasContent />
    </ProtectedRoute>
  );
}
