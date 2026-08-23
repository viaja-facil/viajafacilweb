"use client";

import { mockBookings, flights, airlines, mockUsers, formatCurrency, getAirlineById } from "@/lib/mock-data";
import {
  BookOpen,
  Plane,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Clock,
} from "lucide-react";
import { useState } from "react";
import CustomSelect from "@/components/ui/CustomSelect";

export default function AdminBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBookings = mockBookings.filter((b) => {
    const flight = flights.find((f) => f.id === b.flightId);
    if (searchTerm && !b.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Reservas</h1>
          <p className="text-sm text-gray-500">{mockBookings.length} reservas no sistema</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
          />
        </div>
        <CustomSelect
          value={statusFilter}
          onChange={setStatusFilter}
          ariaLabel="Filtrar reservas por status"
          className="min-w-48"
          options={[
            { value: "all", label: "Todos os status" },
            { value: "confirmed", label: "Confirmadas" },
            { value: "pending", label: "Pendentes" },
            { value: "cancelled", label: "Canceladas" },
          ]}
        />
      </div>

      {/* Bookings list */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => {
          const flight = flights.find((f) => f.id === booking.flightId);
          const airline = flight ? getAirlineById(flight.airlineId) : null;
          const user = mockUsers.find((u) => u.id === booking.userId);

          return (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-gray-200 p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Booking info */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                    style={{ backgroundColor: airline?.color || "#666" }}
                  >
                    {airline?.logo || <Plane className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">#{booking.id.toUpperCase()}</p>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {booking.status === "confirmed" ? "Confirmada" : booking.status === "pending" ? "Pendente" : "Cancelada"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {flight?.flightNumber} • {flight?.origin} → {flight?.destination}
                    </p>
                  </div>
                </div>

                {/* User */}
                <div className="lg:ml-4">
                  <p className="text-sm font-semibold text-gray-900">{user?.name || "N/A"}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>

                {/* Date */}
                <div className="lg:ml-4">
                  <p className="text-xs text-gray-500">Data da reserva</p>
                  <p className="text-sm text-gray-900">
                    {new Date(booking.bookingDate).toLocaleDateString("pt-AO", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Seats */}
                <div className="lg:ml-4">
                  <p className="text-xs text-gray-500">Assentos</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {booking.seats.map((seat) => (
                      <span
                        key={seat}
                        className="px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-xs font-bold text-blue-700"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="lg:ml-auto text-right">
                  <p className="text-lg font-bold text-[#f97316]">
                    {formatCurrency(booking.totalPrice)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 lg:ml-4">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  {booking.status === "pending" && (
                    <>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
