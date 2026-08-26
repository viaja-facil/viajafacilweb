import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de privacidade da ViajaFácil. Saiba como recolhemos, usamos e protegemos os seus dados pessoais.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Política de Privacidade
        </h1>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              1. Informações que Recolhemos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Recolhemos informações que você nos fornece diretamente, como:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Nome completo e dados de contacto</li>
              <li>Endereço de email</li>
              <li>Número de telefone</li>
              <li>Dados de passaporte ou documento de identificação</li>
              <li>Informações de pagamento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              2. Como Usamos as Suas Informações
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Utilizamos as suas informações para:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Processar e confirmar as suas reservas</li>
              <li>Enviar bilhetes eletrónicos e informações de voo</li>
              <li>Comunicar alterações ou cancelamentos</li>
              <li>Melhorar os nossos serviços</li>
              <li>Enviar ofertas e promoções (com o seu consentimento)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              3. Proteção dos Dados
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Implementamos medidas de segurança técnicas e organizacionais para
              proteger os seus dados pessoais contra acesso não autorizado,
              alteração, divulgação ou destruição. Utilizamos encriptação SSL
              para todas as transmissões de dados sensíveis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              4. Partilha de Dados
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Podemos partilhar as suas informações com:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Companhias aéreas para processamento da reserva</li>
              <li>Processadores de pagamento para transações seguras</li>
              <li>Autoridades competentes quando exigido por lei</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Não vendemos os seus dados pessoais a terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              5. Cookies
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Utilizamos cookies para melhorar a sua experiência de navegação.
              Cookies são pequenos ficheiros armazenados no seu dispositivo que
              nos ajudam a recordar as suas preferências.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              6. Os Seus Direitos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Você tem o direito de:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Aceder aos seus dados pessoais</li>
              <li>Corrigir dados incorretos</li>
              <li>Solicitar a eliminação dos seus dados</li>
              <li>Oponhar-se ao processamento dos seus dados</li>
              <li>Solicitar a portabilidade dos dados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              7. Retenção de Dados
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Mantemos os seus dados pessoais apenas pelo tempo necessário para
              cumprir os fins para os quais foram recolhidos, ou conforme
              exigido por lei.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              8. Alterações a Esta Política
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Reservamo-nos o direito de alterar esta Política de Privacidade a
              qualquer momento. As alterações serão publicadas nesta página com
              a data de atualização.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              9. Contacto
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Para questões sobre privacidade, contacte-nos:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Email: privacidade@viajafacil.app</li>
              <li>Telefone: +244 923 456 789</li>
            </ul>
          </section>

          <p className="text-sm text-gray-500">
            Última atualização: {new Date().toLocaleDateString("pt-AO")}
          </p>
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
