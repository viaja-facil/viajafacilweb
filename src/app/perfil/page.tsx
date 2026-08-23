"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { mockBookings } from "@/lib/mock-data";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  Plane,
  User,
  Phone,
  Mail,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Ticket,
} from "lucide-react";

function ProfileContent() {
  const { user, logout, isAdmin } = useAuth();
  const bookings = mockBookings.filter((b) => b.userId === user?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#162544] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-orange-500/25">
              {user?.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold truncate">{user?.name}</h1>
              <p className="text-gray-400 text-sm truncate">{user?.email}</p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-[#f97316]/20 text-[#f97316] text-xs font-semibold rounded-full border border-[#f97316]/30">
                  <ShieldCheck className="w-3 h-3" />
                  Administrador
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Reservas shortcut */}
        <Link
          href="/reservas"
          className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#f97316] transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <Ticket className="w-5 h-5 text-[#f97316]" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Minhas Reservas</p>
              <p className="text-xs text-gray-400">
                {bookings.length} {bookings.length === 1 ? "reserva" : "reservas"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#f97316] transition-colors" />
        </Link>

        {/* Account info */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Dados da conta</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-gray-500 w-20 shrink-0">E-mail</span>
              <span className="text-gray-900 font-medium truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-gray-500 w-20 shrink-0">Telefone</span>
              <span className="text-gray-900 font-medium">{user?.phone || "—"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-gray-500 w-20 shrink-0">Nome</span>
              <span className="text-gray-900 font-medium">{user?.name}</span>
            </div>
          </div>
        </section>

        {/* Admin shortcut */}
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#f97316] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#f97316]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Painel de Administração</p>
                <p className="text-xs text-gray-400">Gerir voos, reservas e utilizadores</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#f97316] transition-colors" />
          </Link>
        )}

        {/* Empty state hint for users without bookings */}
        {bookings.length === 0 && (
          <section className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <Plane className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-900 mb-1">Nenhuma reserva ainda</p>
            <p className="text-xs text-gray-400 mb-4">
              Quando fizer uma reserva, ela aparece em &quot;Minhas Reservas&quot;.
            </p>
            <Link
              href="/"
              className="inline-flex min-h-[40px] items-center px-5 bg-[#f97316] hover:bg-[#ea580c] text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Buscar voos
            </Link>
          </section>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-sm rounded-2xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Terminar sessão
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
