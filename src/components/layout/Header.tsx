"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useId, useState } from "react";
import { User, LogOut, ChevronDown, Search } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const menuId = useId();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-xl text-gray-900 sticky top-0 z-50 border-b border-white/20 shadow-sm">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[80] focus:rounded-lg focus:bg-white focus:p-3">Saltar para o conteúdo</a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/viajafacil.png"
              alt="ViajaFácil"
              width={1536}
              height={1024}
              className="h-14 w-auto"
              preload
            />
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all"
            >
              Início
            </Link>
            <Link
              href="/search"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all"
            >
              Voos
            </Link>
            <Link href="/reservas" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Minhas viagens</Link>
            <Link href="/#perguntas" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Ajuda</Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label={`Menu do utilizador ${user.name}`}
                  aria-controls={menuId}
                  aria-expanded={userMenuOpen}
                  onKeyDown={(event) => { if (event.key === "Escape") setUserMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:block">{user.name.split(" ")[0]}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div
                      id={menuId}
                      onKeyDown={(event) => { if (event.key === "Escape") { setUserMenuOpen(false); document.querySelector<HTMLButtonElement>(`[aria-controls="${menuId}"]`)?.focus(); } }}
                      aria-label="Menu do utilizador"
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        href="/perfil"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4" />
                        Minha Conta
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/register"
                  className="hidden sm:block px-4 py-2 text-sm font-semibold bg-[var(--action)] hover:bg-[var(--action-hover)] text-white rounded-lg transition-colors shadow-lg shadow-orange-500/25"
                >
                  Criar Conta
                </Link>
              </div>
            )}

            {/* Mobile search icon */}
            <Link
              href="/search"
              aria-label="Pesquisar voos"
              className="md:hidden min-h-11 min-w-11 flex items-center justify-center p-2 text-gray-500 hover:text-gray-900"
            >
              <Search className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
