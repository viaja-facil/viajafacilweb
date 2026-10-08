"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { useRouter, useSearchParams } from "next/navigation";
import { formatCurrency, getAirlineById } from "@/lib/mock-data";
import { useBooking, PaymentMethod } from "@/lib/booking-context";
import ItinerarySummary from "@/components/booking/ItinerarySummary";
import BookingStepper from "@/components/ui/BookingStepper";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PassengerFormCard from "@/components/booking/PassengerFormCard";
import PaymentMethodSelector from "@/components/booking/PaymentMethodSelector";
import OrderSummarySidebar from "@/components/booking/OrderSummarySidebar";
import MobileStickyBar from "@/components/booking/MobileStickyBar";
import {
  ArrowLeft,
  User,
  Check,
  AlertCircle,
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
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [attemptedGenerate, setAttemptedGenerate] = useState(false);
  const nameRefs = useRef<(HTMLInputElement | null)[]>([]);
  const docRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneRef = useRef<HTMLInputElement | null>(null);

  // Callback refs (avoids reading ref.current during render)
  const setNameRef = (index: number) => (el: HTMLInputElement | null) => {
    nameRefs.current[index] = el;
  };
  const setDocRef = (index: number) => (el: HTMLInputElement | null) => {
    docRefs.current[index] = el;
  };
  const [biStatus, setBiStatus] = useState<
    Record<number, { status: "loading" | "found" | "manual"; message?: string }>
  >({});
  // Tracks the last document requested per passenger so stale responses
  // (e.g. after pasting a different BI over another) are discarded
  const latestBIRequest = useRef<Record<number, string>>({});

  // Generate mock reference (called from event handlers only)
  const makeReference = () => {
    const now = new Date();
    const datePart = now.getFullYear().toString().slice(-2) +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0");
    const rand = Math.floor(Math.random() * 900000 + 100000);
    return `VJ${datePart}${rand}`;
  };

  // Generate real QR code when reference payment is ready
  useEffect(() => {
    if (paymentGenerated && paymentMethod === "referencia" && reference) {
      const payload = JSON.stringify({
        referencia: reference,
        valor: booking.totalPrice,
        moeda: "AOA",
        descricao: "Simulação de viagem ViajaFacil — sem pagamento",
      });
      QRCode.toDataURL(payload, {
        width: 256,
        margin: 2,
        color: { dark: "#0a1628", light: "#ffffff" },
      }).then(setQrDataUrl);
    }
  }, [paymentGenerated, paymentMethod, reference, booking.totalPrice]);

  if (!flight || booking.seats.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Nenhum assento selecionado</h2>
          <p className="text-gray-500 mb-4">Por favor, selecione seus assentos primeiro.</p>
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

  const totalSeatPrice = (booking.allSeats.length ? booking.allSeats.flat() : booking.seats).reduce((sum, s) => sum + s.price, 0);
  const totalBasePrice = (booking.flights.length ? booking.flights : [flight]).reduce((sum, f) => sum + f.price * passengerCount, 0);
  const grandTotal = totalBasePrice + totalSeatPrice;

  const updatePassenger = (index: number, field: "name" | "document", value: string) => {
    setPassengerForms((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  // Identity lookup remains simulated until a verified integration is configured.
  const ANGOLAN_BI_REGEX = /^\d{9}[A-Z]{2}\d{3}$/;

  const lookupBI = async (index: number, rawDoc: string) => {
    const doc = rawDoc.trim().toUpperCase();
    if (!ANGOLAN_BI_REGEX.test(doc)) return;

    latestBIRequest.current[index] = doc;
    setBiStatus((prev) => ({
      ...prev,
      [index]: {
        status: "manual",
        message: "A validação automática está desativada nesta demonstração. Preencha o nome manualmente.",
      },
    }));
  };

  const handleDocumentChange = (index: number, value: string) => {
    // Sanitize paste input: strip spaces, dashes and anything non-alphanumeric
    const cleaned = value.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
    updatePassenger(index, "document", cleaned);
    // Clear previous lookup result when the document changes
    setBiStatus((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
    if (ANGOLAN_BI_REGEX.test(cleaned)) {
      lookupBI(index, cleaned);
    } else if (cleaned.length >= 6) {
      // Allow manual entry for passports and fictitious demo documents.
      setBiStatus((prev) => ({
        ...prev,
        [index]: { status: "manual", message: "Documento não é um BI angolano. Preencha o nome manualmente." },
      }));
    }
  };

  const isPassengerFormValid = passengerForms.every(
    (p) => p.name.trim().length > 2 && p.document.trim().length > 5
  );

  const isPaymentValid = () => {
    if (!paymentMethod) return false;
    if (paymentMethod === "multicaixa_express") {
      return /^9\d{8}$/.test(phoneNumber);
    }
    return true;
  };

  const isFormValid = isPassengerFormValid && isPaymentValid();

  const generatePayment = () => {
    if (!isPassengerFormValid || !isPaymentValid()) {
      setAttemptedGenerate(true);
      // Focus the first invalid field
      for (let i = 0; i < passengerForms.length; i++) {
        if (passengerForms[i].name.trim().length <= 2) {
          nameRefs.current[i]?.focus();
          return;
        }
        if (passengerForms[i].document.trim().length <= 5) {
          docRefs.current[i]?.focus();
          return;
        }
      }
      if (paymentMethod === "multicaixa_express" && phoneNumber.length < 9) {
        phoneRef.current?.focus();
      }
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const ref = makeReference();
      if (paymentMethod === "referencia") {
        setReference(ref);
      }
      setPaymentGenerated(true);
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

  const handleBack = () => {
    // Warn before leaving with an unfinished payment
    if (paymentGenerated && !window.confirm("Tem certeza que deseja sair? A simulação em curso será perdida.")) {
      return;
    }
    router.push(`/booking/seats?flightId=${flightId || flight?.id || ""}`);
  };

  const handleCopyReference = () => {
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingStepper />
      <div className="mx-auto max-w-7xl px-4 sm:px-6"><ItinerarySummary flights={booking.flights.length ? booking.flights : [flight]} allSeats={booking.allSeats} passengerCount={booking.passengerCount} /></div>

      <div className="bg-gradient-to-r from-[#0a1628] to-[#162544] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold">Checkout de demonstração</h1>
          <nav aria-label="Progresso da reserva" className="mt-2">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-gray-400">
              <li>Buscar</li>
              <li aria-hidden="true">›</li>
              <li>Assentos</li>
              <li aria-hidden="true">›</li>
              <li aria-current="step" className="text-white font-semibold">
                Checkout
              </li>
              <li aria-hidden="true">›</li>
              <li>Confirmação</li>
            </ol>
          </nav>
          <p className="text-gray-400 text-sm mt-1">
            Explore o fluxo com dados fictícios. Não será feita nenhuma reserva ou cobrança.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-40 md:pb-6">

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
                  <PassengerFormCard
                    key={index}
                    index={index}
                    passenger={passenger}
                    updatePassenger={updatePassenger}
                    handleDocumentChange={handleDocumentChange}
                    lookupBI={lookupBI}
                    biStatus={biStatus[index]}
                    attemptedGenerate={attemptedGenerate}
                    nameRef={setNameRef(index)}
                    docRef={setDocRef(index)}
                  />
                ))}
              </div>
             </div>

            {!paymentGenerated && (
              <PaymentMethodSelector
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                grandTotal={grandTotal}
                isProcessing={isProcessing}
                attemptedGenerate={attemptedGenerate}
                generatePayment={generatePayment}
                phoneRef={phoneRef}
              />
            )}

            {/* Payment Result - Multicaixa Express */}
            {paymentGenerated && paymentMethod === "multicaixa_express" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-fade-in">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Notificação simulada
                  </h3>
                  <p className="text-sm text-gray-500">
                    Esta demonstração representa uma notificação para o número{" "}
                    <span className="font-bold text-gray-900">+244 {phoneNumber}</span>.
                    Nenhuma notificação foi enviada e nenhum pagamento será cobrado.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-800">Estado simulado</p>
                      <p className="text-xs text-green-600">
                        Total da simulação: {formatCurrency(grandTotal)}. Não confirme no telemóvel.
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
                      A concluir simulação...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Simular confirmação
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
                    Referência de demonstração
                  </h3>
                  <p className="text-sm text-gray-500">
                    Esta referência é fictícia. Não a use num ATM, aplicação bancária ou agência.
                  </p>
                </div>

                {/* Reference Display */}
                <div className="bg-gradient-to-r from-[#0a1628] to-[#162544] rounded-xl p-6 text-center mb-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                    Referência fictícia
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
                    QR de demonstração · não pagar
                  </p>
                  {qrDataUrl && (
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                      <Image
                        src={qrDataUrl}
                        width={160}
                        height={160}
                        unoptimized
                        alt={`QR fictício de demonstração - Referência ${reference}`}
                        className="w-40 h-40"
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-3">
                    Referência: {reference} • Valor: {formatCurrency(grandTotal)}
                  </p>
                </div>

                {/* How to pay */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-sm font-semibold text-blue-800 mb-1">Demonstração sem pagamento</p>
                  <p className="text-xs text-blue-700">A referência, o QR e o valor são fictícios. Não existe ligação a bancos nem cobrança real.</p>
                </div>

                <button
                  onClick={confirmPayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-[var(--action)] to-[var(--action)] hover:from-[var(--action-hover)] hover:to-[var(--action-hover)] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      A concluir simulação...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Simular confirmação
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <OrderSummarySidebar
            flight={flight}
            airline={airline}
            booking={booking}
            passengerCount={passengerCount}
            grandTotal={grandTotal}
            paymentGenerated={paymentGenerated}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>

      {!paymentGenerated && (
        <MobileStickyBar
          grandTotal={grandTotal}
          isFormValid={isFormValid}
          isProcessing={isProcessing}
          handlePayment={generatePayment}
        />
      )}
    </div>
  );
}

function RestoredCheckout() {
  const { booking } = useBooking();
  return <CheckoutContent key={`${booking.flight?.id ?? "loading"}-${booking.seats.length}`} />;
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
      <ProtectedRoute>
        <RestoredCheckout />
      </ProtectedRoute>
    </Suspense>
  );
}
