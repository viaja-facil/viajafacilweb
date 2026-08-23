"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, getAirlineById, getAirportByCode } from "@/lib/mock-data";
import { useBooking } from "@/lib/booking-context";
import BookingStepper from "@/components/ui/BookingStepper";
import {
  Check,
  Download,
  Plane,
  ArrowRight,
  Share2,
  MapPin,
  Calendar,
  Clock,
  Users,
  Smartphone,
  Hash,
  CheckCircle2,
} from "lucide-react";

export default function ConfirmationPage() {
  const router = useRouter();
  const { booking, resetBooking } = useBooking();

  const flight = booking.flight;
  const airline = flight ? getAirlineById(flight.airlineId) : null;
  const originAirport = flight ? getAirportByCode(flight.origin) : null;
  const destAirport = flight ? getAirportByCode(flight.destination) : null;

  useEffect(() => {
    if (!flight) {
      router.push("/search");
    }
  }, [flight, router]);

  if (!flight) return null;

  const bookingId = `VJ${flight.id.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(-6)}${String(booking.seats.length).padStart(2, "0")}`;

  const totalSeatPrice = booking.seats.reduce((sum, s) => sum + s.price, 0);
  const totalBasePrice = flight.price * booking.seats.length;
  const grandTotal = totalBasePrice + totalSeatPrice;

  const handleNewBooking = () => {
    resetBooking();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingStepper />

      {/* Success Header */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Reserva Confirmada!</h1>
          <p className="text-green-100 text-lg">
            Seu voo foi reservado com sucesso. Boa viagem!
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6 pb-12">
        {/* Booking Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Booking ID */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Código da Reserva</p>
                <p className="text-xl font-mono font-bold text-gray-900">{bookingId}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Status</p>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  <Check className="w-3 h-3" />
                  Confirmada
                </span>
              </div>
            </div>
          </div>

          {/* Flight Info */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                style={{ backgroundColor: airline?.color || "#666" }}
              >
                {airline?.logo || <Plane className="w-5 h-5 text-gray-400" />}
              </div>
              <div>
                <p className="font-bold text-gray-900">{flight.flightNumber}</p>
                <p className="text-sm text-gray-500">{airline?.name}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#0a1628] to-[#162544] rounded-xl p-6 text-white mb-6">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-3xl font-bold">{flight.origin}</p>
                  <p className="text-sm text-gray-300">{originAirport?.city}</p>
                  <p className="text-sm text-gray-300 mt-1">
                    {new Date(flight.departureTime).toLocaleTimeString("pt-AO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex-1 mx-6">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-white/30" />
                    <Plane className="w-5 h-5 text-[#f97316] -rotate-45" />
                    <div className="flex-1 h-px bg-white/30" />
                  </div>
                  <p className="text-center text-xs text-gray-400 mt-2">{flight.duration} • Direto</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{flight.destination}</p>
                  <p className="text-sm text-gray-300">{destAirport?.city}</p>
                  <p className="text-sm text-gray-300 mt-1">
                    {new Date(flight.arrivalTime).toLocaleTimeString("pt-AO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                  <Calendar className="w-3 h-3" />
                  Data
                </div>
                <p className="font-semibold text-gray-900">
                  {new Date(flight.departureTime).toLocaleDateString("pt-AO", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                  <Users className="w-3 h-3" />
                  Passageiros
                </div>
                <p className="font-semibold text-gray-900">
                  {booking.passengers.length} {booking.passengers.length === 1 ? "passageiro" : "passageiros"}
                </p>
              </div>
            </div>

            {/* Passengers */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Passageiros</h3>
              <div className="space-y-2">
                {booking.passengers.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#f97316] text-white rounded-lg flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.document}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#f97316]">Assento {booking.seats[i]?.number}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="bg-orange-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Total Pago</span>
                <span className="text-2xl font-bold text-[#f97316]">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Payment Method */}
            {booking.paymentMethod && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    {booking.paymentMethod === "multicaixa_express" ? (
                      <Smartphone className="w-5 h-5 text-white" />
                    ) : (
                      <Hash className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      Pago via {booking.paymentMethod === "multicaixa_express" ? "Multicaixa Express" : "Referência Bancária"}
                    </p>
                    <p className="text-xs text-green-600">
                      {booking.paymentMethod === "multicaixa_express"
                        ? `Número: +244 ${booking.paymentReference}`
                        : `Referência: ${booking.paymentReference}`}
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 py-3 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Baixar Bilhete
              </button>
              <button className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Partilhar
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">Próximos passos:</p>
          <ul className="space-y-1 text-blue-700">
            <li>• Você receberá um e-mail de confirmação em breve</li>
            <li>• Apresente o código <strong>{bookingId}</strong> no balcão do aeroporto</li>
            <li>• Check-in disponível 24 horas antes do voo</li>
          </ul>
        </div>

        {/* New booking */}
        <div className="mt-6 text-center">
          <button
            onClick={handleNewBooking}
            className="inline-flex items-center gap-2 text-[#f97316] hover:text-[#ea580c] font-semibold text-sm"
          >
            <Plane className="w-4 h-4" />
            Fazer uma nova reserva
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
