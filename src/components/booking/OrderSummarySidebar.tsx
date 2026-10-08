"use client";

import { formatCurrency } from "@/lib/mock-data";
import { Flight, Airline } from "@/lib/types";
import { PaymentMethod } from "@/lib/booking-context";
import { Plane, ArrowRight, Shield, CheckCircle2 } from "lucide-react";

interface OrderSummarySidebarProps {
  flight: Flight;
  airline: Airline | null | undefined;
  booking: {
    flights?: Flight[];
    allSeats?: { number: string; price: number }[][];
    seats: { number: string; price: number }[];
  };
  passengerCount: number;
  grandTotal: number;
  paymentGenerated?: boolean;
  paymentMethod?: PaymentMethod | null;
}

export default function OrderSummarySidebar({
  flight,
  airline,
  booking,
  passengerCount,
  grandTotal,
  paymentGenerated = false,
  paymentMethod = null,
}: OrderSummarySidebarProps) {
  const totalSeatPrice = (booking.allSeats?.length ? booking.allSeats.flat() : booking.seats).reduce((sum, s) => sum + s.price, 0);
  const totalBasePrice = (booking.flights?.length ? booking.flights : [flight]).reduce((sum, f) => sum + f.price * passengerCount, 0);

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
        <h3 className="font-bold text-gray-900 mb-4">Resumo do Pedido</h3>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: airline?.color || "#666" }}
            >
              {airline?.logo || <Plane className="w-5 h-5 text-gray-600" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {flight.flightNumber}
              </p>
              <p className="text-xs text-gray-500">{airline?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold">{flight.origin}</span>
            <ArrowRight className="w-3 h-3 text-gray-600" />
            <span className="font-bold">{flight.destination}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(flight.departureTime).toLocaleDateString("pt-AO", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Passageiros ({passengerCount})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {booking.seats.slice(0, passengerCount).map((s, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs font-bold text-blue-700"
              >
                {s.number}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Passagens ({passengerCount}x · {booking.flights?.length || 1} trechos)</span>
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
            <span className="text-[var(--action)]">{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        {paymentGenerated && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-green-700">
                Pagamento{" "}
                {paymentMethod === "multicaixa_express"
                  ? "Multicaixa Express"
                  : "por Referência"}{" "}
                selecionado
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 text-xs text-gray-600 justify-center">
          <Shield className="w-3 h-3" />
          <span>Pagamento de demonstração; sem cobrança real</span>
        </div>
      </div>
    </div>
  );
}
