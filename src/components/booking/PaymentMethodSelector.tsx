"use client";

import { RefObject } from "react";
import { formatCurrency } from "@/lib/mock-data";
import { PaymentMethod } from "@/lib/booking-context";
import {
  CreditCard,
  Smartphone,
  Hash,
  Phone,
  Lock,
  AlertCircle,
} from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethod: PaymentMethod | null;
  setPaymentMethod: (method: PaymentMethod) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  grandTotal: number;
  isProcessing: boolean;
  attemptedGenerate: boolean;
  generatePayment: () => void;
  phoneRef?: RefObject<HTMLInputElement | null>;
}

export default function PaymentMethodSelector({
  paymentMethod,
  setPaymentMethod,
  phoneNumber,
  setPhoneNumber,
  grandTotal,
  isProcessing,
  attemptedGenerate,
  generatePayment,
  phoneRef,
}: PaymentMethodSelectorProps) {
  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    setPhoneNumber(cleaned);
  };

  return (
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

      <div
        role="radiogroup"
        aria-label="Método de Pagamento"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
      >
        {/* Multicaixa Express */}
        <button
          onClick={() => setPaymentMethod("multicaixa_express")}
          role="radio"
          aria-checked={paymentMethod === "multicaixa_express"}
          className={`p-5 rounded-xl border-2 text-left transition-all ${
            paymentMethod === "multicaixa_express"
              ? "border-[#f97316] bg-orange-50 shadow-lg shadow-orange-500/10"
              : "border-gray-200 hover:border-gray-300 bg-white"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                paymentMethod === "multicaixa_express"
                  ? "bg-[#f97316] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
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
          role="radio"
          aria-checked={paymentMethod === "referencia"}
          className={`p-5 rounded-xl border-2 text-left transition-all ${
            paymentMethod === "referencia"
              ? "border-[#f97316] bg-orange-50 shadow-lg shadow-orange-500/10"
              : "border-gray-200 hover:border-gray-300 bg-white"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                paymentMethod === "referencia"
                  ? "bg-[#f97316] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
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
              id="multicaixa-phone"
              type="tel"
              placeholder="9XX XXX XXX"
              aria-label="Número de telemóvel Multicaixa Express"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              maxLength={9}
              className={`flex-1 px-4 py-3 bg-white/10 border rounded-xl text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                attemptedGenerate && phoneNumber.length < 9
                  ? "border-red-400 bg-red-500/20"
                  : "border-white/30"
              }`}
              aria-describedby={
                attemptedGenerate && !/^9\d{8}$/.test(phoneNumber)
                  ? "multicaixa-phone-error"
                  : undefined
              }
            />
          </div>
          {attemptedGenerate && !/^9\d{8}$/.test(phoneNumber) && (
            <p
              id="multicaixa-phone-error"
              role="alert"
              className="text-xs text-red-200 mt-2 flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              Número inválido. Deve começar com 9 e ter 9 dígitos
            </p>
          )}
          {phoneNumber.length > 0 &&
            phoneNumber.length < 9 &&
            !(attemptedGenerate && phoneNumber.length < 9) && (
              <p className="text-xs text-green-200 mt-2">
                {9 - phoneNumber.length}{" "}
                {9 - phoneNumber.length === 1 ? "dígito" : "dígitos"} restante(s)
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
  );
}
