"use client";

import { flights, mockBookings, mockUsers, airlines, formatCurrency } from "@/lib/mock-data";
import {
  Plane,
  BookOpen,
  Users,
  TrendingUp,
  ArrowUpRight,
  DollarSign,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const totalRevenue = mockBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const confirmedBookings = mockBookings.filter((b) => b.status === "confirmed").length;
  const totalSeats = flights.reduce((sum, f) => sum + f.totalSeats, 0);
  const availableSeats = flights.reduce((sum, f) => sum + f.availableSeats, 0);

  const stats = [
    {
      label: "Receita Total",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: "from-green-400 to-green-600",
      change: "+12%",
    },
    {
      label: "Voos Ativos",
      value: flights.length.toString(),
      icon: Plane,
      color: "from-blue-400 to-blue-600",
      change: "+3",
    },
    {
      label: "Reservas",
      value: `${confirmedBookings}/${mockBookings.length}`,
      icon: BookOpen,
      color: "from-purple-400 to-purple-600",
      change: "+8%",
    },
    {
      label: "Usuários",
      value: mockUsers.length.toString(),
      icon: Users,
      color: "from-orange-400 to-orange-600",
      change: "+24",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Visão geral da plataforma ViajaFácil</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900">Reservas Recentes</h2>
            <Link
              href="/admin/bookings"
              className="text-sm font-semibold text-[#f97316] hover:text-[#ea580c] flex items-center gap-1"
            >
              Ver todas
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {mockBookings.slice(0, 5).map((booking) => {
              const flight = flights.find((f) => f.id === booking.flightId);
              const airline = flight ? airlines.find((a) => a.id === flight.airlineId) : null;
              return (
                <div
                  key={booking.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: airline?.color || "#666" }}
                  >
                    {airline?.logo || <Plane className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {flight?.flightNumber} • {flight?.origin} → {flight?.destination}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.bookingDate).toLocaleDateString("pt-AO")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(booking.totalPrice)}
                    </p>
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Routes */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900">Voos Disponíveis</h2>
            <Link
              href="/admin/flights"
              className="text-sm font-semibold text-[#f97316] hover:text-[#ea580c] flex items-center gap-1"
            >
              Ver todos
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {flights.slice(0, 5).map((flight) => {
              const airline = airlines.find((a) => a.id === flight.airlineId);
              return (
                <div
                  key={flight.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: airline?.color || "#666" }}
                  >
                    {airline?.logo || <Plane className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {flight.flightNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                      {flight.origin} → {flight.destination} • {flight.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#f97316]">
                      {formatCurrency(flight.price)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {flight.availableSeats} lugares
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Capacity overview */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:col-span-2">
          <h2 className="font-bold text-gray-900 mb-6">Capacidade por Companhia</h2>
          <div className="space-y-4">
            {airlines.map((airline) => {
              const airlineFlights = flights.filter((f) => f.airlineId === airline.id);
              const totalCapacity = airlineFlights.reduce((sum, f) => sum + f.totalSeats, 0);
              const available = airlineFlights.reduce((sum, f) => sum + f.availableSeats, 0);
              const percentage = totalCapacity > 0 ? Math.round((available / totalCapacity) * 100) : 0;

              return (
                <div key={airline.id} className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: airline.color }}
                  >
                    {airline.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900">{airline.name}</p>
                      <p className="text-sm text-gray-500">
                        {available}/{totalCapacity} lugares
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: airline.color,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
