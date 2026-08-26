"use client";

import { airlines, airports } from "@/lib/mock-data";
import CustomSelect from "@/components/ui/CustomSelect";

interface AddFlightModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddFlightModal({ open, onClose }: AddFlightModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Novo Voo</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">×</button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Número do Voo</label>
            <input type="text" placeholder="DT 999" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Origem</label>
              <CustomSelect ariaLabel="Aeroporto de origem" options={airports.map((a) => ({ value: a.code, label: `${a.city} (${a.code})` }))} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Destino</label>
              <CustomSelect ariaLabel="Aeroporto de destino" options={airports.map((a) => ({ value: a.code, label: `${a.city} (${a.code})` }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Data/Hora Partida</label>
              <input type="datetime-local" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Duração</label>
              <input type="text" placeholder="1h 30min" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Preço (Kz)</label>
              <input type="number" placeholder="45000" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Lugares</label>
              <input type="number" placeholder="180" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Companhia</label>
            <CustomSelect ariaLabel="Companhia aérea" options={airlines.map((a) => ({ value: a.id, label: a.name }))} />
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors">Cancelar</button>
            <button onClick={onClose} className="flex-1 py-2.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold rounded-xl transition-colors">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
