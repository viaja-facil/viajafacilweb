"use client";

import { useState } from "react";
import { Bell, Mail, Route, Check, Loader2 } from "lucide-react";

interface PriceAlertProps {
  className?: string;
}

export default function PriceAlert({ className = "" }: PriceAlertProps) {
  const [email, setEmail] = useState("");
  const [route, setRoute] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !route) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
    setEmail("");
    setRoute("");
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1628] to-[#162544] p-6 md:p-8 ${className}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#f97316] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#f97316] rounded-xl flex items-center justify-center animate-pulse-glow">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Alertas de Preço</h3>
            <p className="text-sm text-gray-400">Receba notificações quando os preços baixarem</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition-all"
                required
              />
            </div>
            <div className="relative">
              <Route className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ex: LAD → LIS"
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              isSuccess
                ? "bg-green-500 text-white"
                : "bg-[#f97316] hover:bg-[#ea580c] text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                A configurar...
              </>
            ) : isSuccess ? (
              <>
                <Check className="w-5 h-5" />
                Alerta Criado!
              </>
            ) : (
              <>
                <Bell className="w-5 h-5" />
                Criar Alerta
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-500">
          Notificamos quando os preços para a sua rota baixarem. Sem spam, apenas ofertas reais.
        </p>
      </div>
    </div>
  );
}