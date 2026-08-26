import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Termos de uso da plataforma ViajaFácil. Leia os termos e condições para utilizar o nosso serviço de reserva de passagens aéreas.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Termos de Uso
        </h1>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              1. Aceitação dos Termos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Ao utilizar a plataforma ViajaFácil (viajafacil.app), você concorda
              com estes Termos de Uso. Se não concordar com algum dos termos,
              não utilize o nosso serviço.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              2. Descrição do Serviço
            </h2>
            <p className="text-gray-600 leading-relaxed">
              A ViajaFácil é uma plataforma online que permite a compra de
              passagens aéreas de múltiplas companhias aéreas. Oferecemos
              comparação de preços, reserva e emissão de bilhetes eletrónicos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              3. Responsabilidades do Utilizador
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Fornecer informações verdadeiras e atualizadas</li>
              <li>Manter a confidencialidade da sua conta</li>
              <li>Notificar-nos imediatamente de qualquer uso não autorizado</li>
              <li>Não utilizar o serviço para fins ilegais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              4. Preços e Pagamentos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Os preços exibidos são provenientes das companhias aéreas e podem
              variar sem aviso prévio. A ViajaFácil não cobra taxas adicionais
              além do valor da passagem. O pagamento é processado de forma segura
              através dos métodos disponíveis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              5. Cancelamento e Alterações
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Cancelamentos e alterações seguem as políticas da companhia aérea
              escolhida. A ViajaFácil atua como intermediária e não se
              responsabiliza por políticas de cancelamento das companhias aéreas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              6. Propriedade Intelectual
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Todo o conteúdo da plataforma ViajaFácil, incluindo textos,
              gráficos, logótipos e software, é propriedade da ViajaFácil e está
              protegido por leis de direitos de autor.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              7. Limitação de Responsabilidade
            </h2>
            <p className="text-gray-600 leading-relaxed">
              A ViajaFácil não se responsabiliza por danos indirectos, incidentais
              ou consequenciais decorrentes do uso do serviço. A nossa
              responsabilidade é limitada ao valor da passagem adquirida.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              8. Alterações aos Termos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Reservamo-nos o direito de alterar estes termos a qualquer momento.
              As alterações entrarão em vigor imediatamente após a publicação na
              plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              9. Contacto
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Para questões sobre estes Termos de Uso, contacte-nos:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Email: info@viajafacil.app</li>
              <li>Telefone: +244 923 456 789</li>
              <li>WhatsApp: +244 923 456 789</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/"
            className="text-[#f97316] hover:text-[#ea580c] font-semibold"
          >
            ← Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}
