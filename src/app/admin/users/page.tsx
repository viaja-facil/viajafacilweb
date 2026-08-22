"use client";

import { mockUsers, mockBookings, flights, formatCurrency } from "@/lib/mock-data";
import {
  Users,
  Search,
  Edit2,
  Trash2,
  Shield,
  UserCheck,
  Mail,
  Phone,
} from "lucide-react";
import { useState } from "react";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = mockUsers.filter((u) => {
    if (searchTerm && !u.name.toLowerCase().includes(searchTerm.toLowerCase()) && !u.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getUserStats = (userId: string) => {
    const userBookings = mockBookings.filter((b) => b.userId === userId);
    const totalSpent = userBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    return {
      bookings: userBookings.length,
      totalSpent,
    };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
          <p className="text-sm text-gray-500">{mockUsers.length} usuários cadastrados</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
          />
        </div>
      </div>

      {/* Users grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const stats = getUserStats(user.id);
          return (
            <div
              key={user.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-full flex items-center justify-center text-white text-lg font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{user.name}</p>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "Usuário"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 text-gray-400 hover:text-[#f97316] hover:bg-orange-50 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {user.email}
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {user.phone}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Reservas</p>
                  <p className="text-lg font-bold text-gray-900">{stats.bookings}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Gasto</p>
                  <p className="text-lg font-bold text-[#f97316]">
                    {stats.totalSpent > 0 ? formatCurrency(stats.totalSpent) : "0 Kz"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
