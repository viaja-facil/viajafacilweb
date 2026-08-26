"use client";

import { useRouter } from "next/navigation";
import ScrollReveal from "@/components/ui/ScrollReveal";
import GradientButton from "@/components/ui/GradientButton";
import ParticleBackground from "@/components/ui/ParticleBackground";
import { Search, Phone } from "lucide-react";

export default function FinalCTA() {
  const router = useRouter();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      <ScrollReveal>
        <div className="bg-gradient-to-br from-[#0a1628] to-[#162544] rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <ParticleBackground className="opacity-20" particleCount={30} />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316] rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#f97316] rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Pronto para viajar?
              </h2>
              <p className="text-gray-400 max-w-md text-lg">
                Comece agora a planear a sua próxima viagem. É rápido, fácil e seguro.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <GradientButton
                onClick={() => router.push("/search")}
                icon={<Search className="w-5 h-5" />}
                size="lg"
              >
                Explorar Voos
              </GradientButton>
              <a
                href="https://wa.me/244923456789"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 whitespace-nowrap backdrop-blur-sm border border-white/10"
              >
                <Phone className="w-5 h-5" />
                Fale Connosco
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
