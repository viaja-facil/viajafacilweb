"use client";

import { Smartphone, Star, Download, Apple, Play } from "lucide-react";
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
                <span className="text-sm font-semibold text-[#f97316]">App Exclusivo</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Baixe o app ViajaFácil
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Compre passagens, receba alertas de preço e gerencie suas reservas direto do seu celular.
                Disponível para iOS e Android.
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

              {/* Rating */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">4.8/5 • 50k+ downloads</span>
              </div>

              {/* Download buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all hover:scale-105 shadow-lg">
                  <Apple className="w-8 h-8" />
                  <div className="text-left">
                    <div className="text-xs text-gray-300">Disponível na</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all hover:scale-105 shadow-lg">
                  <Play className="w-8 h-8" />
                  <div className="text-left">
                    <div className="text-xs text-gray-300">Disponível no</div>
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

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center animate-bounce">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#f97316]">-30%</div>
                  <div className="text-[10px] text-gray-500">OFF</div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-3 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Download className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">50k+</div>
                    <div className="text-[10px] text-gray-500">Downloads</div>
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