"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import { Plane, Mail, Lock, User, Phone, AlertCircle, ArrowRight } from "lucide-react";

const passwordChecks = [
  { label: "6+ caracteres", test: (p: string) => p.length >= 6 },
  { label: "Maiúscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Número", test: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));

    // Mock registration - auto login with test user
    if (login("maria@teste.ao", "123")) {
      router.push("/");
    } else {
      setError("Erro ao criar conta. Tente novamente.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-xl flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Viaja<span className="text-[#f97316]">Fácil</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Criar sua conta</h1>
            <p className="text-gray-500">Comece a viajar com a ViajaFácil</p>
          </div>

          <SocialLoginButtons onSuccess={() => router.push("/")} />

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">ou com e-mail</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.ao"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Telefone
              </label>
              <div className="relative flex gap-2">
                <div className="flex items-center pl-3 pr-3 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 shrink-0">
                  <Phone className="w-5 h-5 text-gray-400 mr-2" />
                  +244
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
                  placeholder="9XX XXX XXX"
                  required
                  aria-label="Telefone (sem código de país)"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-password" className="text-sm font-semibold text-gray-700 mb-1 block">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  aria-describedby="password-strength"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                />
              </div>
              {password.length > 0 && (
                <div
                  id="password-strength"
                  className="flex items-center gap-2 mt-2"
                  aria-live="polite"
                >
                  <div className="flex-1 flex gap-1.5">
                    {passwordChecks.map((check) => {
                      const passed = check.test(password);
                      return (
                        <div
                          key={check.label}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            passed ? "bg-green-500" : "bg-gray-200"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {passwordChecks.filter((c) => c.test(password)).length}/
                    {passwordChecks.length}{" "}
                    {passwordChecks
                      .filter((c) => !c.test(password))
                      .map((c) => c.label)
                      .join(", ") || "— forte"}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Criar Conta
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            Ao criar uma conta, você concorda com nossos{" "}
            <Link href="/termos" className="text-[#f97316] hover:underline">Termos de Uso</Link>{" "}
            e{" "}
            <Link href="/privacidade" className="text-[#f97316] hover:underline">Política de Privacidade</Link>.
          </p>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Já tem conta?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-[#f97316] hover:text-[#ea580c]"
              >
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#0a1628] to-[#162544] items-center justify-center p-12">
        <div className="max-w-md text-center text-white">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Plane className="w-10 h-10 text-[#f97316]" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Junte-se a nós</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Crie sua conta e comece a explorar as melhores ofertas de voos para todo Angola.
          </p>
          <div className="mt-8 space-y-4">
            {["Ofertas exclusivas", "Check-in online", "Suporte 24/7"].map((feature) => (
              <div key={feature} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                <div className="w-2 h-2 bg-[#f97316] rounded-full" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
