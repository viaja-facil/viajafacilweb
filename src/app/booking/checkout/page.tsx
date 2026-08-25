"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import QRCode from "qrcode";
import { useRouter, useSearchParams } from "next/navigation";
import { formatCurrency, getAirlineById, getAirportByCode } from "@/lib/mock-data";
import { useBooking, PaymentMethod } from "@/lib/booking-context";
import BookingStepper from "@/components/ui/BookingStepper";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
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
        valor: flight ? flight.price * passengerCount : 0,
        moeda: "AOA",
        descricao: "Bilhete de voo ViajaFacil",
      });
      QRCode.toDataURL(payload, {
        width: 256,
        margin: 2,
        color: { dark: "#0a1628", light: "#ffffff" },
      }).then(setQrDataUrl);
    }
  }, [paymentGenerated, paymentMethod, reference, flight, passengerCount]);

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

  // BI lookup via internal proxy (/api/lookup-bi) — the upstream service
  // is only contacted server-side and never exposed to the browser
  const ANGOLAN_BI_REGEX = /^\d{9}[A-Z]{2}\d{3}$/;

  const lookupBI = async (index: number, rawDoc: string) => {
    const doc = rawDoc.trim().toUpperCase();
    if (!ANGOLAN_BI_REGEX.test(doc)) return;

    latestBIRequest.current[index] = doc;
    setBiStatus((prev) => ({ ...prev, [index]: { status: "loading" } }));
    try {
      const res = await fetch(`/api/lookup-bi?bi=${encodeURIComponent(doc)}`);
      // Ignore the response if the user already typed/pasted a different document
      if (latestBIRequest.current[index] !== doc) return;

      const data = await res.json();
      if (data.found && data.name) {
        updatePassenger(index, "name", data.name);
        setBiStatus((prev) => ({
          ...prev,
          [index]: { status: "found", message: data.name },
        }));
      } else {
        setBiStatus((prev) => ({
          ...prev,
          [index]: { status: "manual", message: data.error },
        }));
      }
    } catch {
      if (latestBIRequest.current[index] !== doc) return;
      setBiStatus((prev) => ({
        ...prev,
        [index]: { status: "manual", message: "Não foi possível validar o BI. Preencha o nome manualmente." },
      }));
    }
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
    } else if (cleaned.length >= 14) {
      // Full-length document that isn't an Angolan BI (e.g. passport)
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
                {passengerForms.map((passenger, index) => {
                  const status = biStatus[index];
                  const docFilled = passenger.document.trim().length > 0;
                  const inputBorder =
                    status?.status === "loading"
                      ? "border-[#f97316] ring-2 ring-[#f97316]/20"
                      : status?.status === "found"
                      ? "border-green-500 bg-green-50/50"
                      : status?.status === "manual"
                      ? "border-amber-400 bg-amber-50/40"
                      : docFilled
                      ? "border-gray-300"
                      : "border-gray-200";
                  return (
                    <div key={index} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                          status?.status === "found"
                            ? "bg-green-500 text-white"
                            : "bg-[#f97316] text-white"
                        }`}>
                          {status?.status === "found" ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            index + 1
                          )}
                        </span>
                        <h3 className="text-sm font-semibold text-gray-900">
                          Passageiro {index + 1}
                        </h3>
                        <span className="ml-auto text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-2 py-0.5">
                          Assento {passenger.seat}
                        </span>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-2">
                          Nº do BI / Passaporte
                          {status?.status === "loading" && (
                            <span className="inline-flex items-center gap-1 font-normal text-[#f97316]">
                              <span className="w-3 h-3 border-2 border-orange-200 border-t-[#f97316] rounded-full animate-spin" />
                              a validar...
                            </span>
                          )}
                        </label>
                        <div className="relative">
                          <input
                            ref={(el) => { docRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            placeholder="Ex.: 000217139NE013"
                            value={passenger.document}
                            onChange={(e) => handleDocumentChange(index, e.target.value)}
                            maxLength={14}
                            aria-invalid={status?.status === "manual"}
                            aria-describedby={`bi-status-${index}`}
                            className={`w-full pl-3 pr-10 py-2.5 bg-white border-2 rounded-xl text-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-all ${
                              attemptedGenerate && passenger.document.trim().length <= 5
                                ? "border-red-400 bg-red-50/40"
                                : inputBorder
                            }`}
                          />
                          {/* Interactive validation indicator */}
                          <span className="absolute right-3 top-1/2 -translate-y-1/2">
                            {status?.status === "loading" && (
                              <span className="block w-[18px] h-[18px] border-2 border-orange-200 border-t-[#f97316] rounded-full animate-spin" />
                            )}
                            {status?.status === "found" && (
                              <CheckCircle2 className="w-5 h-5 text-green-600 animate-fade-in" />
                            )}
                            {status?.status === "manual" && (
                              <AlertCircle className="w-5 h-5 text-amber-500 animate-fade-in" />
                            )}
                          </span>
                        </div>
                        {attemptedGenerate && passenger.document.trim().length <= 5 && (
                          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Introduza o BI ou passaporte (min. 6 caracteres)
                          </p>
                        )}
                      </div>

                      {/* Validated name confirmation panel */}
                      {status?.status === "found" && (
                        <div
                          id={`bi-status-${index}`}
                          aria-live="polite"
                          className="mt-3 bg-green-50 border-2 border-green-200 rounded-xl p-4 animate-fade-in"
                        >
                          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-green-600 mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Nome validado via BI
                          </p>
                          <p className="text-base font-bold text-gray-900 leading-snug">
                            {passenger.name}
                          </p>
                          <p className="text-xs text-green-700 mt-2">
                            Confirme que o nome está correto antes de pagar. É este que vai no bilhete.
                          </p>
                        </div>
                      )}

                      {/* Manual entry fallback */}
                      {status?.status === "manual" && (
                        <div
                          id={`bi-status-${index}`}
                          aria-live="polite"
                          className="mt-3 animate-fade-in"
                        >
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Nome Completo
                          </label>
                          <input
                            ref={(el) => { nameRefs.current[index] = el; }}
                            type="text"
                            placeholder="Introduza o nome como está no documento"
                            value={passenger.name}
                            onChange={(e) => updatePassenger(index, "name", e.target.value)}
                            className={`w-full px-3 py-2.5 bg-white border-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-all ${
                              attemptedGenerate && passenger.name.trim().length <= 2
                                ? "border-red-400 bg-red-50/40"
                                : passenger.name.trim().length > 2
                                ? "border-green-400"
                                : "border-amber-300"
                            }`}
                          />
                          {attemptedGenerate && passenger.name.trim().length <= 2 ? (
                            <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5">
                              <AlertCircle className="w-3 h-3" />
                              Introduza o nome completo (min. 3 caracteres)
                            </p>
                          ) : passenger.name.trim().length > 2 ? (
                            <p className="flex items-center gap-1.5 text-xs text-green-600 mt-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {passenger.name}
                            </p>
                          ) : (
                            status.message && (
                              <p className="flex items-start gap-1.5 text-xs text-amber-600 mt-1.5">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" />
                                {status.message}
                              </p>
                            )
                          )}
                        </div>
                      )}
                     </div>
                   );
                 })}
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
                        ref={phoneRef}
                        type="tel"
                        placeholder="9XX XXX XXX"
                        value={phoneNumber}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        maxLength={9}
                        className={`flex-1 px-4 py-3 bg-white/10 border rounded-xl text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                          attemptedGenerate && phoneNumber.length < 9
                            ? "border-red-400 bg-red-500/20"
                            : "border-white/30"
                        }`}
                      />
                    </div>
                    {attemptedGenerate && !/^9\d{8}$/.test(phoneNumber) && (
                      <p className="text-xs text-red-200 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Número inválido. Deve começar com 9 e ter 9 dígitos
                      </p>
                    )}
                    {phoneNumber.length > 0 && phoneNumber.length < 9 && !(attemptedGenerate && phoneNumber.length < 9) && (
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
                    disabled={isProcessing}
                    className="w-full mt-6 py-3.5 hidden md:flex bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:shadow-none items-center justify-center gap-2"
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
                  {qrDataUrl && (
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                      <img
                        src={qrDataUrl}
                        alt={`QR Code para pagamento - Referência ${reference}`}
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
              disabled={isProcessing}
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
      <ProtectedRoute>
        <CheckoutContent />
      </ProtectedRoute>
    </Suspense>
  );
}
