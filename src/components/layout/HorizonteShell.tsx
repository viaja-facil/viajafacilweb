"use client";
import { useState, createContext, useContext, type ReactNode } from "react";
import Image from "next/image";
import { Phone } from "lucide-react";
import { useSearchForm } from "@/hooks/useSearchForm";
import { DM_Sans, DM_Serif_Display, Manrope } from "next/font/google";
import { useAuth } from "@/lib/auth-context";
import "@/app/horizonte.css";
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const heading = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const editorial = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-editorial",
});
const FormContext = createContext<ReturnType<typeof useSearchForm> | null>(
  null,
);
export function useHorizonteForm() {
  const form = useContext(FormContext);
  if (!form) throw new Error("Homepage form provider missing");
  return form;
}
export default function HorizonteShell({ children }: { children: ReactNode }) {
  const form = useSearchForm({ origin: "LAD", tripType: "roundtrip" });
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  return (
    <FormContext.Provider value={form}>
      <div
        className={`horizonte-home ${sans.variable} ${heading.variable} ${editorial.variable}`}
      >
        <svg
          aria-hidden="true"
          className="icon-defs"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <symbol id="i-plane" viewBox="0 0 24 24">
              <path d="m22 2-7 20-4-9-9-4Z"></path>
              <path d="M22 2 11 13"></path>
            </symbol>
            <symbol id="i-pin" viewBox="0 0 24 24">
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"></path>
              <circle cx="12" cy="10" r="2.5"></circle>
            </symbol>
            <symbol id="i-calendar" viewBox="0 0 24 24">
              <rect height={16} rx="3" width={18} x="3" y="5"></rect>
              <path d="M16 3v4M8 3v4M3 11h18"></path>
            </symbol>
            <symbol id="i-user" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4"></circle>
              <path d="M4 21v-2a8 8 0 0 1 16 0v2"></path>
            </symbol>
            <symbol id="i-search" viewBox="0 0 24 24">
              <circle cx="10.5" cy="10.5" r="7.5"></circle>
              <path d="m16 16 5 5"></path>
            </symbol>
            <symbol id="i-swap" viewBox="0 0 24 24">
              <path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4 4-4-4 4-4"></path>
            </symbol>
            <symbol id="i-check" viewBox="0 0 24 24">
              <path d="m5 12 4 4L19 6"></path>
            </symbol>
            <symbol id="i-shield" viewBox="0 0 24 24">
              <path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6Z"></path>
              <path d="m8 12 3 3 5-6"></path>
            </symbol>
            <symbol id="i-heart" viewBox="0 0 24 24">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"></path>
            </symbol>
            <symbol id="i-chat" viewBox="0 0 24 24">
              <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H3l1.8-5.2A8.5 8.5 0 1 1 21 11.5Z"></path>
              <path d="M8 10h8M8 14h5"></path>
            </symbol>
            <symbol id="i-chevron" viewBox="0 0 24 24">
              <path d="m8 10 4 4 4-4"></path>
            </symbol>
            <symbol id="i-close" viewBox="0 0 24 24">
              <path d="m6 6 12 12M6 18 18 6"></path>
            </symbol>
          </defs>
        </svg>
        <a className="skip" href="#pesquisa">
          Ir para a pesquisa de voos
        </a>
        <header className="header shell">
          <a aria-label="ViajaFácil — Início" className="brand" href="#inicio">
            <Image
              alt="ViajaFácil"
              height={70}
              src="/viajafacil.png"
              width={98}
            />
          </a>
          <nav aria-label="Navegação principal" className="nav">
            <a className="active" href="#pesquisa">
              Voos
            </a>
            <a href="#destinos">Destinos</a>
            <a href="#vantagens">Porquê ViajaFácil?</a>
            {isAdmin && <a href="/admin">Administração</a>}
          </nav>
          <div className="header-actions">
            <a className="help-link" href="#ajuda">
              <svg className="icon" aria-hidden="true">
                <use href="#i-chat"></use>
              </svg>
              Ajuda
            </a>
            <a className="account-link" href={user ? "/perfil" : "/auth/login"}>
              <svg className="icon" aria-hidden="true">
                <use href="#i-user"></use>
              </svg>
              {user ? user.name.split(" ")[0] : "Entrar"}
            </a>
            <button
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menu"
              className="menu-toggle"
            >
              <span></span>
              <span></span>
            </button>
          </div>
          <nav
            aria-label="Navegação móvel"
            className="mobile-menu"
            hidden={!menuOpen}
            id="mobile-menu"
            onClick={() => setMenuOpen(false)}
          >
            <a href="#pesquisa">Pesquisar voos</a>
            <a href="#destinos">Destinos</a>
            <a href="#vantagens">Porquê ViajaFácil?</a>
            <a href="#ajuda">Ajuda</a>
            <a href={user ? "/perfil" : "/auth/login"}>A minha conta</a>
            {user && (
              <>
                <a href="/reservas">Minhas reservas</a>
                <button type="button" onClick={logout}>
                  Sair
                </button>
              </>
            )}
            {isAdmin && <a href="/admin">Administração</a>}
          </nav>
        </header>
        <main id="inicio">{children}</main>
        <footer className="footer shell">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#inicio">
                <Image
                  alt="ViajaFácil"
                  height={75}
                  src="/viajafacil.png"
                  width={100}
                />
              </a>
              <p>
                De Angola, para onde
                <br />a vida o levar.
              </p>
            </div>
            <div className="footer-links">
              <strong>Explore</strong>
              <a href="#pesquisa">Pesquisar voos</a>
              <a href="#destinos">Destinos</a>
              <a href="#vantagens">Porquê ViajaFácil?</a>
            </div>
            <div className="footer-links">
              <strong>Informações</strong>
              <a href="#ajuda">Perguntas frequentes</a>
              <a href="/termos">Termos de uso</a>
              <a href="/privacidade">Privacidade</a>
            </div>
            <div className="footer-links footer-contact">
              <strong>Fale connosco</strong>
              <a href="tel:+244928243835">
                <Phone size={18} aria-hidden="true" />
                +244 928 243 835
              </a>
              <a
                href="https://wa.me/244928243835"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M20.52 3.48A11.91 11.91 0 0 0 12.04 0C5.46 0 .1 5.35.1 11.94c0 2.1.55 4.15 1.6 5.96L0 24l6.26-1.64a11.9 11.9 0 0 0 5.77 1.47h.01c6.58 0 11.94-5.35 11.94-11.94 0-3.19-1.24-6.18-3.46-8.41ZM12.04 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.97.99-3.63-.24-.37a9.88 9.88 0 0 1-1.51-5.24c0-5.47 4.45-9.91 9.92-9.91a9.83 9.83 0 0 1 7.01 2.9 9.85 9.85 0 0 1 2.9 7.02c0 5.46-4.45 9.91-9.95 9.85Zm5.44-7.42c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.49-.89-.8-1.49-1.79-1.67-2.09-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.18-1.42-.08-.12-.28-.2-.58-.35Z" />
                </svg>
                WhatsApp
              </a>
              <a
                href="https://www.instagram.com/viajafacilapp/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@viajafacil.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.89-2.89c.3 0 .59.05.86.13V9.4a6.34 6.34 0 1 0 5.48 6.27V8.68a8.2 8.2 0 0 0 4.79 1.54V6.77c-.35 0-.69-.03-1.02-.08Z" />
                </svg>
                TikTok
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © <span id="year">2026</span> ViajaFácil.
            </span>
            <span>Português · Kwanza (Kz)</span>
          </div>
        </footer>
      </div>
    </FormContext.Provider>
  );
}
