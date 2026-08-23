"use client";

import { useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { flights, generateSeats, formatCurrency, getAirlineById, getAirportByCode, Seat } from "@/lib/mock-data";
import { useBooking } from "@/lib/booking-context";
import BookingStepper from "@/components/ui/BookingStepper";
import {
  ArrowLeft,
  ArrowRight,
  Plane,
  Info,
  AlertCircle,
} from "lucide-react";

export default function SeatsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#f97316] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Carregando assentos...</p>
          </div>
        </div>
      }
    >
      <SeatsContent />
    </Suspense>
  );
}

function SeatsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flightId = searchParams.get("flightId") || "";
  const { booking, setSeats } = useBooking();

  const flight = flights.find((f) => f.id === flightId) || booking.flight;
  const airline = flight ? getAirlineById(flight.airlineId) : null;
  const originAirport = flight ? getAirportByCode(flight.origin) : null;
  const destAirport = flight ? getAirportByCode(flight.destination) : null;

  const seats = useMemo(
    () => (flight ? generateSeats(flight.id, flight.class) : []),
    [flight]
  );
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Nenhum voo selecionado</h2>
          <p className="text-gray-500 mb-4">Por favor, selecione um voo primeiro.</p>
          <button
            onClick={() => router.push("/search")}
            className="px-6 py-2 bg-[#f97316] text-white rounded-lg font-semibold"
          >
            Buscar Voos
          </button>
        </div>
      </div>
    );
  }

  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable) return;

    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      }
      if (prev.length >= 9) return prev;
      return [...prev, seat];
    });
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    setSeats(selectedSeats);
    router.push(`/booking/checkout?flightId=${flight.id}`);
  };

  const totalSeatPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const totalBasePrice = flight.price * selectedSeats.length;
  const grandTotal = totalBasePrice + totalSeatPrice;

  // Group seats by row
  const rows: Record<number, Seat[]> = {};
  seats.forEach((seat) => {
    if (!rows[seat.row]) rows[seat.row] = [];
    rows[seat.row].push(seat);
  });

  const columns = flight.class === "economy" ? ["A", "B", "C", "D", "E", "F"] :
                  flight.class === "business" ? ["A", "B", "C", "D"] :
                  ["A", "B", "C"];

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingStepper />

      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#162544] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Selecione seus assentos</h1>
              <p className="text-gray-400 text-sm mt-1">
                {flight.flightNumber} • {airline?.name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-2xl font-bold text-[#f97316]">{formatCurrency(grandTotal)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              {/* Flight route */}
              <div className="flex items-center justify-center gap-4 mb-8 pb-6 border-b border-gray-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{flight.origin}</p>
                  <p className="text-xs text-gray-500">{originAirport?.city}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#f97316]" />
                  <div className="w-24 h-px bg-gray-300 relative">
                    <Plane className="w-4 h-4 text-[#f97316] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#f97316]" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{flight.destination}</p>
                  <p className="text-xs text-gray-500">{destAirport?.city}</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-100 border-2 border-green-500 rounded-md" />
                  <span className="text-gray-600">Disponível</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 border-2 border-blue-600 rounded-md" />
                  <span className="text-gray-600">Selecionado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 border-2 border-gray-300 rounded-md" />
                  <span className="text-gray-600">Ocupado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-yellow-50 border-2 border-yellow-400 rounded-md" />
                  <span className="text-gray-600">Espaço extra</span>
                </div>
              </div>

              {/* Aircraft body */}
              <div className="relative mx-auto max-w-md overflow-x-auto scrollbar-hide">
                {/* Nose */}
                <div className="mx-auto w-32 h-12 bg-gray-100 rounded-t-full border border-b-0 border-gray-200 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-400">FRENTE</span>
                </div>

                {/* Seat map: sticky row labels + sticky column headers on mobile */}
                <div className="min-w-[380px]">
                  {/* Column headers - sticky top on scroll */}
                  <div className="flex items-center sticky top-0 z-10 bg-white/95 backdrop-blur mb-2 px-1 pt-1">
                    <div className="w-8 shrink-0" />
                    {columns.map((col) => (
                      <div key={col} className="w-10 text-center shrink-0">
                        <span className="text-xs font-bold text-gray-500">{col}</span>
                      </div>
                    ))}
                    <div className="w-8 shrink-0" />
                  </div>

                  {/* Seats grid */}
                  <div className="bg-gray-100 border border-gray-200 rounded-xl p-3 space-y-1">
                    {Object.entries(rows).map(([rowNum, rowSeats]) => {
                      const isExtraLegroom = rowSeats[0]?.isExtraLegroom;
                      return (
                        <div key={rowNum} className="flex items-center gap-1">
                          {/* Row number - sticky left */}
                          <span className="w-8 shrink-0 text-center text-xs font-bold text-gray-400 sticky left-0 bg-gray-100 rounded z-10">
                            {rowNum}
                          </span>
                          {columns.map((col) => {
                            const seat = rowSeats.find((s) => s.column === col);
                            if (!seat) return <div key={col} className="w-10 shrink-0" />;

                            const isSelected = selectedSeats.some((s) => s.id === seat.id);
                            const isOccupied = !seat.isAvailable;

                            return (
                              <button
                                key={col}
                                onClick={() => handleSeatClick(seat)}
                                disabled={isOccupied}
                                title={`${seat.number} ${isOccupied ? "(Ocupado)" : seat.isExtraLegroom ? "(Espaço Extra)" : ""} ${!isOccupied && seat.price > 0 ? `+ ${formatCurrency(seat.price)}` : ""}`}
                                className={`w-10 h-10 shrink-0 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                                  isOccupied
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                                    : isSelected
                                    ? "bg-blue-500 text-white border-2 border-blue-600 shadow-lg shadow-blue-500/30 scale-110"
                                    : isExtraLegroom
                                    ? "bg-yellow-50 border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-100 hover:border-yellow-500 cursor-pointer"
                                    : "bg-green-100 border-2 border-green-500 text-green-700 hover:bg-green-200 hover:border-green-600 cursor-pointer"
                                }`}
                              >
                                {seat.number}
                              </button>
                            );
                          })}
                          {/* Row number right - sticky left (mirrors left for symmetry) */}
                          <span className="w-8 shrink-0 text-center text-xs font-bold text-gray-400">
                            {rowNum}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tail */}
                <div className="mx-auto w-24 h-8 bg-gray-100 rounded-b-xl border border-t-0 border-gray-200 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-400">TRÁS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Resumo do Voo</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: airline?.color || "#666" }}
                  >
                    {airline?.logo || <Plane className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{flight.flightNumber}</p>
                    <p className="text-xs text-gray-500">{airline?.name}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{flight.origin}</p>
                      <p className="text-xs text-gray-500">{formatTime(flight.departureTime)}</p>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-px bg-gray-300 relative">
                        <Plane className="w-4 h-4 text-[#f97316] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{flight.destination}</p>
                      <p className="text-xs text-gray-500">{formatTime(flight.arrivalTime)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">{flight.duration} • Direto</p>
                </div>
              </div>

              {/* Selected seats */}
              {selectedSeats.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Assentos Selecionados ({selectedSeats.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map((seat) => (
                      <div
                        key={seat.id}
                        className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5"
                      >
                        <span className="text-sm font-bold text-blue-700">{seat.number}</span>
                        {seat.isExtraLegroom && (
                          <span className="text-xs text-yellow-600">⚡</span>
                        )}
                        {seat.price > 0 && (
                          <span className="text-xs text-blue-500">+{formatCurrency(seat.price)}</span>
                        )}
                        <button
                          onClick={() => handleSeatClick(seat)}
                          className="ml-1 text-blue-400 hover:text-blue-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price breakdown */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Passagem ({selectedSeats.length}x)</span>
                  <span className="text-gray-900">{formatCurrency(totalBasePrice)}</span>
                </div>
                {totalSeatPrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Taxa de assento</span>
                    <span className="text-gray-900">{formatCurrency(totalSeatPrice)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-100">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#f97316]">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={selectedSeats.length === 0}
                className="w-full min-h-[48px] mt-6 py-3.5 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:shadow-none flex items-center justify-center gap-2"
              >
                Continuar
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 justify-center">
                <Info className="w-3 h-3" />
                <span>Seus assentos ficam reservados por 10 minutos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky price bar */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500">
              {selectedSeats.length > 0 ? `${selectedSeats.length} assento${selectedSeats.length > 1 ? "s" : ""}` : "Nenhum assento"}
            </p>
            <p className="text-xl font-bold text-[#f97316]">{formatCurrency(grandTotal)}</p>
          </div>
          <button
            onClick={handleContinue}
            disabled={selectedSeats.length === 0}
            className="min-h-[44px] px-6 py-2.5 bg-gradient-to-r from-[#f97316] to-[#ea580c] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:shadow-none flex items-center justify-center gap-2"
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" });
}
