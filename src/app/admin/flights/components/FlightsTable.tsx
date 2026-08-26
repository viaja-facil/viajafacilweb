"use client";

import type { Flight } from "@/lib/types";
import { formatCurrency, getAirlineById, getAirportByCode } from "@/lib/mock-data";
import { Plane, Eye, Edit2, Trash2 } from "lucide-react";

interface FlightsTableProps {
  flights: Flight[];
}

export default function FlightsTable({ flights }: FlightsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Voo</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rota</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Horário</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Preço</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lugares</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Classe</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {flights.map((flight) => {
              const airline = getAirlineById(flight.airlineId);
              const originAirport = getAirportByCode(flight.origin);
              const destAirport = getAirportByCode(flight.destination);
              const seatPercentage = Math.round((flight.availableSeats / flight.totalSeats) * 100);

              return (
                <tr key={flight.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: airline?.color || "#666" }}>
                        {airline?.logo || <Plane className="w-5 h-5 text-gray-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{flight.flightNumber}</p>
                        <p className="text-xs text-gray-500">{airline?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{originAirport?.city} ({flight.origin})</p>
                    <p className="text-xs text-gray-500">→ {destAirport?.city} ({flight.destination})</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{new Date(flight.departureTime).toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" })}</p>
                    <p className="text-xs text-gray-500">{flight.duration}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-[#f97316]">{formatCurrency(flight.price)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${seatPercentage > 50 ? "bg-green-500" : seatPercentage > 20 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${seatPercentage}%` }} />
                      </div>
                      <span className="text-xs text-gray-600">{flight.availableSeats}/{flight.totalSeats}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${flight.class === "economy" ? "bg-blue-100 text-blue-700" : flight.class === "business" ? "bg-purple-100 text-purple-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {flight.class === "economy" ? "Económica" : flight.class === "business" ? "Business" : "Primeira"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 text-gray-400 hover:text-[#f97316] hover:bg-orange-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
