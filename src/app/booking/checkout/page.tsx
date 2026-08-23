"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatCurrency, getAirlineById, getAirportByCode } from "@/lib/mock-data";
import { useBooking, PaymentMethod } from "@/lib/booking-context";
import BookingStepper from "@/components/ui/BookingStepper";
import {
  ArrowLeft,
  ArrowRight,
  Plane,
  User,
  Phone,
  CreditCard,
  Lock,
  Check,
  Shield,
  AlertCircle,
  QrCode,
  Copy,
  CheckCircle2,
  Smartphone,
  Hash,
} from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flightId = searchParams.get("flightId") || "";
  const {
    booking,
    setPassengers,
    setPaymentMethod: ctxSetPaymentMethod,
    setPaymentReference,
  } = useBooking();

  const flight = booking.flight;
  const airline = flight ? getAirlineById(flight.airlineId) : null;

  // Use passengerCount from context or fall back to seats length
  const passengerCount = booking.passengerCount || booking.seats.length;

  const [passengerForms, setPassengerForms] = useState(
    booking.seats.slice(0, passengerCount).map((seat, i) => ({
      name: booking.passengers[i]?.name || "",
      document: booking.passengers[i]?.document || "",
      seat: seat.number,
    }))
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentGenerated, setPaymentGenerated] = useState(false);
  const [reference, setReference] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate mock reference (called from event handlers only)
  const makeReference = () => {
    const now = new Date();
    const datePart = now.getFullYear().toString().slice(-2) +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0");
    const rand = Math.floor(Math.random() * 900000 + 100000);
    return `VJ${datePart}${rand}`;
  };

  if (!flight || booking.seats.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Nenhum assento selecionado</h2>
          <p className="text-gray-500 mb-4">Por favor, selecione seus assentos primeiro.</p>
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

  const totalSeatPrice = booking.seats.reduce((sum, s) => sum + s.price, 0);
  const totalBasePrice = flight.price * passengerCount;
  const grandTotal = totalBasePrice + totalSeatPrice;

  const updatePassenger = (index: number, field: "name" | "document", value: string) => {
    setPassengerForms((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const isPassengerFormValid = passengerForms.every(
    (p) => p.name.trim().length > 2 && p.document.trim().length > 5
  );

  const isPaymentValid = () => {
    if (!paymentMethod) return false;
    if (paymentMethod === "multicaixa_express") {
      return phoneNumber.length >= 9;
    }
    return true;
  };

  const isFormValid = isPassengerFormValid && isPaymentValid();

  const generatePayment = () => {
    if (!isPassengerFormValid) return;

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const ref = makeReference();
      if (paymentMethod === "referencia") {
        setReference(ref);
      }
      setPaymentGenerated(true);
      setPaymentMethod(paymentMethod);
      ctxSetPaymentMethod(paymentMethod!);
      setPaymentReference(paymentMethod === "referencia" ? ref : phoneNumber);
      setIsProcessing(false);
    }, 1500);
  };

  const confirmPayment = () => {
    setIsProcessing(true);
    setPassengers(passengerForms);

    setTimeout(() => {
      router.push(`/booking/confirmation?flightId=${flight.id}`);
    }, 2000);
  };

  const handleCopyReference = () => {
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePhoneChange = (value: string) => {
    // Only allow numbers
    const cleaned = value.replace(/\D/g, "");
    setPhoneNumber(cleaned);
  };

  // QR Code SVG generator for reference payment
  const generateQRCode = (data: string) => {
    // Simple visual QR-like pattern for demo
    const size = 21;
    const cells: boolean[][] = [];
    for (let i = 0; i < size; i++) {
      cells[i] = [];
      for (let j = 0; j < size; j++) {
        // Finder patterns (corners)
        const isFinderArea =
          (i < 7 && j < 7) ||
          (i < 7 && j >= size - 7) ||
          (i >= size - 7 && j < 7);

        if (isFinderArea) {
          const fi = i < 7 ? i : i - (size - 7);
          const fj = j < 7 ? j : j - (size - 7);
          const isBorder = fi === 0 || fi === 6 || fj === 0 || fj === 6;
          const isInner = fi >= 2 && fi <= 4 && fj >= 2 && fj <= 4;
          cells[i][j] = isBorder || isInner;
        } else {
          // Pseudo-random based on data string
          const charCode = data.charCodeAt((i + j) % data.length);
          cells[i][j] = (charCode * (i + 1) * (j + 1)) % 3 === 0;
        }
      }
    }
    return cells;
  };

  const qrCells = paymentGenerated && paymentMethod === "referencia"
    ? generateQRCode(reference)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingStepper />

      <div className="bg-gradient-to-r from-[#0a1628] to-[#162544] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold">Finalizar Compra</h1>
          <p className="text-gray-400 text-sm mt-1">
            Preencha os dados e selecione o método de pagamento
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Passenger Forms */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Dados dos Passageiros</h2>
                  <p className="text-xs text-gray-500">
                    {passengerCount} {passengerCount === 1 ? "passageiro" : "passageiros"} •
                    Preencha conforme o documento de identidade
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {passengerForms.map((passenger, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-7 h-7 bg-[#f97316] text-white rounded-lg flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Passageiro {index + 1}
                      </h3>
                      <span className="ml-auto text-xs font-bold text-[#f97316] bg-orange-50 px-2.5 py-0.5 rounded-full">
                        Assento {passenger.seat}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          placeholder="Como no documento"
                          value={passenger.name}
                          onChange={(e) => updatePassenger(index, "name", e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Número do Documento
                        </label>
                        <input
                          type="text"
                          placeholder="Bilhete de Identidade / Passaporte"
                          value={passenger.document}
                          onChange={(e) => updatePassenger(index, "document", e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Selection */}
            {!paymentGenerated && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Método de Pagamento</h2>
                    <p className="text-xs text-gray-500">Escolha como deseja pagar</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* Multicaixa Express */}
                  <button
                    onClick={() => setPaymentMethod("multicaixa_express")}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      paymentMethod === "multicaixa_express"
                        ? "border-[#f97316] bg-orange-50 shadow-lg shadow-orange-500/10"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        paymentMethod === "multicaixa_express"
                          ? "bg-[#f97316] text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Multicaixa Express</p>
                        <p className="text-xs text-gray-500">Pague pelo telemóvel</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Receba uma notificação no seu telemóvel para confirmar o pagamento
                    </p>
                  </button>

                  {/* Referência Bancária */}
                  <button
                    onClick={() => setPaymentMethod("referencia")}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      paymentMethod === "referencia"
                        ? "border-[#f97316] bg-orange-50 shadow-lg shadow-orange-500/10"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        paymentMethod === "referencia"
                          ? "bg-[#f97316] text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        <Hash className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Referência Bancária</p>
                        <p className="text-xs text-gray-500">Pague no ATM ou app</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Gere uma referência para pagamento via Multicaixa, ATM ou app bancário
                    </p>
                  </button>
                </div>

                {/* Multicaixa Express Phone Input */}
                {paymentMethod === "multicaixa_express" && (
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-5 text-white animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                      <Phone className="w-5 h-5" />
                      <h3 className="font-bold">Número Multicaixa Express</h3>
                    </div>
                    <p className="text-sm text-green-100 mb-4">
                      Insira o número do telemóvel registado no Multicaixa Express. Irá receber uma notificação para confirmar o pagamento.
                    </p>
                    <div className="flex gap-2">
                      <div className="flex items-center bg-white/20 rounded-xl px-4 py-3">
                        <span className="text-sm font-bold">+244</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="9XX XXX XXX"
                        value={phoneNumber}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        maxLength={9}
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                    {phoneNumber.length > 0 && phoneNumber.length < 9 && (
                      <p className="text-xs text-green-200 mt-2">
                        {9 - phoneNumber.length} {9 - phoneNumber.length === 1 ? "dígito" : "dígitos"} restante(s)
                      </p>
                    )}
                  </div>
                )}

                {/* Referência Info */}
                {paymentMethod === "referencia" && (
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                      <Hash className="w-5 h-5" />
                      <h3 className="font-bold">Pagamento por Referência</h3>
                    </div>
                    <p className="text-sm text-blue-100 mb-2">
                      Uma referência única será gerada para o valor de{" "}
                      <span className="font-bold">{formatCurrency(grandTotal)}</span>.
                    </p>
                    <p className="text-sm text-blue-100">
                      Pode pagar via Multicaixa (ATM), aplicação bancária ou agência.
                    </p>
                  </div>
                )}

                {/* Generate Payment Button */}
                {paymentMethod && (
                  <button
                    onClick={generatePayment}
                    disabled={
                      (paymentMethod === "multicaixa_express" && phoneNumber.length < 9) ||
                      isProcessing
                    }
                    className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        A gerar pagamento...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Gerar Pagamento
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Payment Result - Multicaixa Express */}
            {paymentGenerated && paymentMethod === "multicaixa_express" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-fade-in">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Notificação Enviada!
                  </h3>
                  <p className="text-sm text-gray-500">
                    Uma notificação foi enviada para o número{" "}
                    <span className="font-bold text-gray-900">+244 {phoneNumber}</span>.
                    Abra o aplicativo Multicaixa Express para confirmar o pagamento.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-800">Aguardando confirmação</p>
                      <p className="text-xs text-green-600">
                        Verifique o seu telemóvel e confirme o pagamento de {formatCurrency(grandTotal)}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={confirmPayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/20 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Confirmando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Confirmar Pagamento
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Payment Result - Referência */}
            {paymentGenerated && paymentMethod === "referencia" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-fade-in">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Hash className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Referência Gerada!
                  </h3>
                  <p className="text-sm text-gray-500">
                    Use esta referência para pagar em qualquer ATM Multicaixa, aplicação bancária ou agência.
                  </p>
                </div>

                {/* Reference Display */}
                <div className="bg-gradient-to-r from-[#0a1628] to-[#162544] rounded-xl p-6 text-center mb-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                    A sua referência
                  </p>
                  <p className="text-3xl font-mono font-bold text-white tracking-widest">
                    {reference}
                  </p>
                  <button
                    onClick={handleCopyReference}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#f97316] hover:text-[#ea580c] font-semibold"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar referência
                      </>
                    )}
                  </button>
                </div>

                {/* QR Code */}
                <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Escaneie para pagar
                  </p>
                  {qrCells && (
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                      <svg
                        viewBox={`0 0 ${qrCells.length * 4 + 2} ${qrCells.length * 4 + 2}`}
                        className="w-40 h-40"
                      >
                        {qrCells.map((row, i) =>
                          row.map((cell, j) =>
                            cell ? (
                              <rect
                                key={`${i}-${j}`}
                                x={j * 4 + 1}
                                y={i * 4 + 1}
                                width="4"
                                height="4"
                                fill="#0a1628"
                              />
                            ) : null
                          )
                        )}
                      </svg>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-3">
                    Referência: {reference} • Valor: {formatCurrency(grandTotal)}
                  </p>
                </div>

                {/* How to pay */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Como pagar:</p>
                  <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Vá a qualquer ATM Multicaixa ou abra a aplicação bancária</li>
                    <li>Selecione &quot;Pagamento de Serviços&quot; ou &quot;Referência&quot;</li>
                    <li>Digite a referência: <span className="font-bold">{reference}</span></li>
                    <li>Confirme o pagamento de <span className="font-bold">{formatCurrency(grandTotal)}</span></li>
                  </ol>
                </div>

                <button
                  onClick={confirmPayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Confirmando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Já Paguei - Confirmar
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Resumo do Pedido</h3>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: airline?.color || "#666" }}
                  >
                    {airline?.logo || <Plane className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{flight.flightNumber}</p>
                    <p className="text-xs text-gray-500">{airline?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold">{flight.origin}</span>
                  <ArrowRight className="w-3 h-3 text-gray-400" />
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
                  {passengerForms.map((p, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs font-bold text-blue-700"
                    >
                      {p.seat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Passagem ({passengerCount}x)</span>
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

              {paymentGenerated && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-700">
                      Pagamento {paymentMethod === "multicaixa_express" ? "Multicaixa Express" : "por Referência"} selecionado
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 justify-center">
                <Shield className="w-3 h-3" />
                <span>Compra 100% segura e garantida</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky price bar */}
      {!paymentGenerated && (
        <div className="md:hidden fixed bottom-14 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-xl font-bold text-[#f97316]">{formatCurrency(grandTotal)}</p>
            </div>
            <button
              onClick={generatePayment}
              disabled={!isFormValid || isProcessing}
              className="flex-1 max-w-[200px] py-3 bg-gradient-to-r from-[#f97316] to-[#ea580c] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:shadow-none flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Pagar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#f97316] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Carregando...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
