"use client";

import { Smartphone, Apple, Play, Plane, MapPin, Shield, Ticket, CreditCard, Sparkles, Clock } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface AppDownloadProps {
  className?: string;
}

export default function AppDownload({ className = "" }: AppDownloadProps) {
  return (
    <section className={`relative overflow-hidden py-16 ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <ScrollReveal direction="left">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#f97316]/10 rounded-full px-4 py-2 mb-6">
                <Smartphone className="w-5 h-5 text-[#f97316]" />
                <span className="text-sm font-semibold text-[#f97316]">App Exclusivo • Em breve</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                O app ViajaFácil está chegando
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Em breve você vai poder comprar passagens, receber alertas de preço e gerenciar suas reservas direto do seu celular.
                Estará disponível para iOS e Android.
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {[
                  "Notificações de preço em tempo real",
                  "Check-in online direto pelo app",
                  "Cartão de embarque digital",
                  "Ofertas exclusivas para o app",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Coming soon notice */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-6 h-6 rounded-full bg-[#f97316]/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#f97316]" />
                </div>
                <span className="text-gray-600 font-medium">Lançamento previsto em breve — fique atento!</span>
              </div>

              {/* Store buttons (disabled until launch) */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button disabled aria-disabled className="flex items-center gap-3 bg-black/40 text-white px-6 py-3 rounded-xl cursor-not-allowed opacity-60">
                  <Apple className="w-8 h-8" />
                  <div className="text-left">
                    <div className="text-xs text-gray-300">Em breve na</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </button>
                <button disabled aria-disabled className="flex items-center gap-3 bg-black/40 text-white px-6 py-3 rounded-xl cursor-not-allowed opacity-60">
                  <Play className="w-8 h-8" />
                  <div className="text-left">
                    <div className="text-xs text-gray-300">Em breve no</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Right - Phone mockup */}
          <ScrollReveal direction="right" delay={200}>
            <div className="relative flex justify-center">
              {/* Phone frame */}
              <div className="relative w-64 h-[500px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-gray-400/50">
                {/* Screen */}
                <div className="w-full h-full bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-[2.5rem] overflow-hidden relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl" />

                  {/* App content preview */}
                  <div className="pt-10 px-4">
                    <div className="text-white text-center mb-6">
                      <div className="text-xs opacity-80">Bom dia, Viajante!</div>
                      <div className="text-lg font-bold">Para onde vamos?</div>
                    </div>

                    {/* Mini search card */}
                    <div className="bg-white rounded-xl p-3 shadow-lg">
                      <div className="flex items-center gap-2 text-gray-600 text-xs mb-2">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                        </div>
                        <span>LAD</span>
                        <span>→</span>
                        <span>LIS</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full mb-2" />
                      <div className="h-2 bg-gray-100 rounded-full w-2/3" />
                    </div>

                    {/* Mini destination cards */}
                    <div className="mt-4 space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white/20 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2">
                          <div className="w-10 h-10 bg-white/30 rounded-lg" />
                          <div className="flex-1">
                            <div className="h-2 bg-white/50 rounded-full w-2/3 mb-1" />
                            <div className="h-2 bg-white/30 rounded-full w-1/2" />
                          </div>
                          <div className="text-white text-xs font-bold">48.000 Kz</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements around the phone */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Existing badges */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-3 py-2 animate-bounce">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#f97316]" />
                    <div className="text-xs font-bold text-gray-900">Em breve</div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-3 animate-pulse">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-[#f97316]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">iOS & Android</div>
                      <div className="text-xs text-gray-500">Em breve</div>
                    </div>
                  </div>
                </div>

                {/* Floating travel icons */}
                <Plane className="absolute top-[5%] left-[5%] w-6 h-6 text-[#f97316]/35 animate-float" style={{ animationDelay: "0s" }} />
                <MapPin className="absolute top-[15%] right-[0%] w-5 h-5 text-[#f97316]/30 animate-float" style={{ animationDelay: "0.7s" }} />
                <Ticket className="absolute bottom-[20%] right-[2%] w-5 h-5 text-blue-400/35 animate-float" style={{ animationDelay: "1.4s" }} />
                <Sparkles className="absolute top-[45%] left-[-2%] w-4 h-4 text-yellow-400/40 animate-float" style={{ animationDelay: "0.3s" }} />
                <Clock className="absolute bottom-[10%] left-[8%] w-5 h-5 text-purple-400/30 animate-float" style={{ animationDelay: "1.8s" }} />
                <Shield className="absolute top-[0%] left-[35%] w-4 h-4 text-green-400/35 animate-float" style={{ animationDelay: "2.1s" }} />
                <CreditCard className="absolute bottom-[5%] right-[25%] w-4 h-4 text-blue-400/30 animate-float" style={{ animationDelay: "1.1s" }} />

                {/* Floating bubbles */}
                <div className="absolute top-[10%] left-[20%] w-2.5 h-2.5 bg-[#f97316]/25 rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
                <div className="absolute top-[50%] right-[5%] w-3 h-3 bg-[#f97316]/20 rounded-full animate-float" style={{ animationDelay: "1.3s" }} />
                <div className="absolute bottom-[15%] left-[0%] w-2 h-2 bg-blue-400/25 rounded-full animate-float" style={{ animationDelay: "2s" }} />
                <div className="absolute top-[30%] left-[-1%] w-2 h-2 bg-yellow-400/25 rounded-full animate-float" style={{ animationDelay: "0.9s" }} />
                <div className="absolute bottom-[30%] right-[8%] w-3.5 h-3.5 bg-[#f97316]/15 rounded-full animate-float" style={{ animationDelay: "1.6s" }} />

                {/* Floating mini glass cards */}
                <div className="absolute top-[8%] right-[-5%] glass-dark rounded-lg px-2.5 py-1.5 animate-float" style={{ animationDelay: "0.4s" }}>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    <span className="text-[9px] text-white/80 font-medium">Em breve</span>
                  </div>
                </div>
                <div className="absolute bottom-[25%] left-[-6%] glass-dark rounded-lg px-2.5 py-1.5 animate-float" style={{ animationDelay: "1.7s" }}>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-green-400" />
                    <span className="text-[9px] text-white/80 font-medium">100% seguro</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}