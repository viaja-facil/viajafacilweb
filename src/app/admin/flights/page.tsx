"use client";

import { useState } from "react";
import { flights, airlines, airports, formatCurrency, getAirlineById, getAirportByCode } from "@/lib/mock-data";
import { Plane, Plus, Search, Edit2, Trash2, Eye } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import FlightsTable from "./components/FlightsTable";
import AddFlightModal from "./components/AddFlightModal";

export default function AdminFlightsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAirline, setSelectedAirline] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredFlights = flights.filter((f) => {
    if (searchTerm && !f.flightNumber.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedAirline !== "all" && f.airlineId !== selectedAirline) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Voos</h1>
          <p className="text-sm text-gray-500">{flights.length} voos cadastrados</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          Novo Voo
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por número do voo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
          />
        </div>
        <CustomSelect
          value={selectedAirline}
          onChange={setSelectedAirline}
          ariaLabel="Filtrar voos por companhia"
          className="min-w-56"
          options={[
            { value: "all", label: "Todas as companhias" },
            ...airlines.map((airline) => ({ value: airline.id, label: airline.name })),
          ]}
        />
      </div>

      <FlightsTable flights={filteredFlights} />

      <AddFlightModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
