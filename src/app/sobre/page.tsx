import type { Metadata } from "next";
import { Plane, Shield, Clock, CreditCard, Users, MapPin, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description:
    "Conheça a ViajaFácil, a plataforma líder para compra de passagens aéreas em Angola. Fundada em 2024, já atendemos mais de 10.000 viajantes.",
  openGraph: {
    title: "Sobre Nós | ViajaFácil",
    description:
      "Conheça a ViajaFácil, a plataforma líder para compra de passagens aéreas em Angola.",
  },
};

const stats = [
  { value: "10.000+", label: "Viajantes atendidos" },
  { value: "6", label: "Companhias aéreas" },
  { value: "16", label: "Aeroportos cobertos" },
  { value: "4.8/5", label: "Avaliação média" },
];

const values = [
  {
    icon: Shield,
    title: "Transparência",
    description:
      "Sem taxas escondidas. O preço que vê é o preço que paga. Trabalhamos com honestidade e integridade em cada transação.",
  },
  {
    icon: Clock,
    title: "Segurança",
    description:
      "Seus dados estão protegidos com criptografia de ponta. Pagamentos seguros e confirmação instantânea.",
  },
  {
    icon: CreditCard,
    title: "Excelência",
    description:
      "Comprometidos com a satisfação de cada viajante. Equipa dedicada disponível 24/7 para ajudá-lo.",
  },
];

const team = [
  {
    name: "Fundador ViajaFácil",
    role: "CEO & Fundador",
    description:
      "Profissional do sector da aviação e tecnologia, com mais de 10 anos de experiência no mercado de viagens em Angola.",
  },
  {
    name: "Director de Operações",
    role: "COO",
    description:
      "Especialista em operações de aviação e logística, garantindo que cada voo é processado com eficiência.",
  },
];

export default function SobrePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Sobre a ViajaFácil",
    description:
      "Conheça a ViajaFácil, a plataforma líder para compra de passagens aéreas em Angola.",
    url: "https://viajafacil.app/sobre",
    mainEntity: {
      "@type": "Organization",
      name: "ViajaFácil",
      url: "https://viajafacil.app",
      foundingDate: "2024",
      description:
        "Plataforma angolana de reserva de passagens aéreas que conecta viajantes às melhores companhias aéreas com preços competitivos.",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0a1628] to-[#162544] py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-[#f97316]/10 rounded-full px-4 py-2 mb-6">
              <Plane className="w-4 h-4 text-[#f97316]" />
              <span className="text-sm font-semibold text-[#f97316]">
                Nossa História
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Sobre a ViajaFácil
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
              ViajaFácil é a plataforma angolana líder para compra de passagens
              aéreas, fundada em 2024 em Luanda. Conectamos viajantes às
              melhores companhias aéreas com preços competitivos e reserva
              instantânea.
            </p>
          </div>
        </section>

        {/* Números */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
              A ViajaFácil em Números
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm"
                >
                  <span className="text-3xl font-bold text-[#f97316]">
                    {stat.value}
                  </span>
                  <p className="text-sm text-gray-500 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nossa História */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Nossa História
            </h2>
            <div className="prose prose-lg text-gray-600 space-y-4">
              <p>
                A ViajaFácil nasceu da necessidade de simplificar a compra de
                passagens aéreas em Angola. Fundada por profissionais do sector
                da aviação e tecnologia, começámos com um objectivo claro:
                tornar o voo acessível a todos os angolanos.
              </p>
              <p>
                Antes da ViajaFácil, comprar uma passagem aérea em Angola era
                um processo complicado e caro. Os viajantes tinham que ligar
                para múltiplas agências, comparar preços manualmente e muitas
                vezes pagavam taxas ocultas.
              </p>
              <p>
                Hoje, com apenas alguns cliques, você compara preços de 6
                companhias aéreas, escolhe o melhor voo e reserva com
                confirmação instantânea. Já atendemos mais de 10.000 viajantes
                e processámos milhões de Kz em reservas.
              </p>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
              Os Nossos Valores
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
                >
                  <div className="w-12 h-12 bg-[#f97316]/10 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-[#f97316]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Equipa */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Nossa Equipa
            </h2>
            <p className="text-gray-600 mb-8">
              Somos uma equipa de profissionais apaixonados por viagens e
              tecnologia, dedicados a proporcionar a melhor experiência de
              compra de passagens aéreas em Angola.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {team.map((member, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-full flex items-center justify-center text-white font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-[#f97316]">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Entre em Contacto
            </h2>
            <p className="text-gray-600 mb-8">
              Estamos disponíveis 24/7 para ajudá-lo. Não hesite em contactar-nos.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                <Phone className="w-5 h-5 text-[#f97316]" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Telefone</p>
                  <p className="text-sm text-gray-500">+244 923 456 789</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                <Mail className="w-5 h-5 text-[#f97316]" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Email</p>
                  <p className="text-sm text-gray-500">info@viajafacil.app</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                <MapPin className="w-5 h-5 text-[#f97316]" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Localização</p>
                  <p className="text-sm text-gray-500">Luanda, Angola</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                <Users className="w-5 h-5 text-[#f97316]" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-500">+244 923 456 789</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
