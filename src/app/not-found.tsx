import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página Não Encontrada",
  robots: {
    index: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Página não encontrada
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          A página que procura não existe ou foi movida. Verifique o URL ou
          volte ao início.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#f97316] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#ea580c] transition-colors"
          >
            Voltar ao Início
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Buscar Voos
          </Link>
        </div>
      </div>
    </div>
  );
}
