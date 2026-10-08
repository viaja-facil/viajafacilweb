"use client";

import { useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { flights, generateSeats, formatCurrency, Seat } from "@/lib/mock-data";
import { useBooking } from "@/lib/booking-context";
import BookingStepper from "@/components/ui/BookingStepper";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ItinerarySummary from "@/components/booking/ItinerarySummary";
import SeatMap from "@/components/booking/seats/SeatMap";
import FlightSummarySidebar from "@/components/booking/seats/FlightSummarySidebar";
import MobilePriceBar from "@/components/booking/seats/MobilePriceBar";
import { ArrowLeft, AlertCircle } from "lucide-react";

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
      <ProtectedRoute>
        <SeatsContent />
      </ProtectedRoute>
    </Suspense>
  );
}

function SeatsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flightId = searchParams.get("flightId") || "";
  const { booking, setLegSeats } = useBooking();

  const [seatLegIndex, setSeatLegIndex] = useState(0);
  const itinerary = booking.flights.length ? booking.flights : (booking.flight ? [booking.flight] : []);
  const flight = itinerary[seatLegIndex] || flights.find((f) => f.id === flightId);

  const seats = useMemo(
    () => (flight ? generateSeats(flight.id, flight.class) : []),
    [flight]
  );
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [showMaxAlert, setShowMaxAlert] = useState(false);

  const passengerCount = booking.passengerCount > 0 ? booking.passengerCount : 1;
  const allSeatsSelected = selectedSeats.length === passengerCount;

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Nenhum voo selecionado</h2>
          <p className="text-gray-500 mb-4">Por favor, selecione um voo primeiro.</p>
          <button
            onClick={() => router.push("/search")}
            className="px-6 py-2 bg-[var(--action)] text-white rounded-lg font-semibold"
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
      if (prev.length >= passengerCount) {
        setShowMaxAlert(true);
        setTimeout(() => setShowMaxAlert(false), 2000);
        return prev;
      }
      return [...prev, seat];
    });
  };

  const handleContinue = () => {
    if (!allSeatsSelected) return;
    setLegSeats(seatLegIndex, selectedSeats);
    if (seatLegIndex < itinerary.length - 1) {
      setSeatLegIndex((index) => index + 1);
      setSelectedSeats([]);
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      router.push(`/booking/checkout?flightId=${itinerary[0]?.id || flight.id}`);
    }
  };

  const totalSeatPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const totalBasePrice = flight.price * passengerCount;
  const grandTotal = totalBasePrice + totalSeatPrice;

  const columns =
    flight.class === "economy"
      ? ["A", "B", "C", "D", "E", "F"]
      : flight.class === "business"
      ? ["A", "B", "C", "D"]
      : ["A", "B", "C"];

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingStepper />

      {showMaxAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          Selecionou o máximo de assentos permitidos
        </div>
      )}

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
              <h1 className="text-2xl font-bold">Selecione os lugares · trecho {seatLegIndex + 1} de {Math.max(1, itinerary.length)}</h1>
              <p className="text-gray-400 text-sm mt-1">
                {flight.flightNumber} • {passengerCount}{" "}
                {passengerCount === 1 ? "passageiro" : "passageiros"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-300">Total deste trecho</p>
                <p className="text-2xl font-bold text-[#f97316]">{formatCurrency(grandTotal)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-40 lg:pb-6">
        <ItinerarySummary flights={itinerary} allSeats={booking.allSeats} passengerCount={passengerCount} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SeatMap
              seats={seats}
              selectedSeats={selectedSeats}
              passengerCount={passengerCount}
              handleSeatClick={handleSeatClick}
              columns={columns}
              flightClass={flight.class}
            />
          </div>

          <FlightSummarySidebar
            flight={flight}
            selectedSeats={selectedSeats}
            passengerCount={passengerCount}
            grandTotal={grandTotal}
            allSeatsSelected={allSeatsSelected}
            handleContinue={handleContinue}
            handleSeatClick={handleSeatClick}
          />
        </div>
      </div>

      <MobilePriceBar
        grandTotal={grandTotal}
        allSeatsSelected={allSeatsSelected}
        selectedSeatsCount={selectedSeats.length}
        passengerCount={passengerCount}
        handleContinue={handleContinue}
      />
    </div>
  );
}
