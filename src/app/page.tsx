import Image from "next/image";
import Link from "next/link";
import { DM_Serif_Display } from "next/font/google";
import { CreditCard, Search, ShieldCheck, MapPin } from "lucide-react";
import HomeSearch from "@/components/sections/HomeSearch";
import HorizonteDestinations from "@/components/sections/HorizonteDestinations";
import styles from "./home.module.css";

const editorial = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-editorial",
});
const questions = [
  [
    "Como pesquisar uma viagem?",
    "Escolha a origem, o destino, as datas e o número de passageiros. Pode pesquisar só ida, ida e volta ou uma viagem com várias cidades.",
  ],
  [
    "Posso pagar em kwanzas?",
    "Os valores são apresentados em kwanzas. Consulte as opções de pagamento disponíveis ao finalizar a sua reserva, incluindo Multicaixa Express e cartão.",
  ],
  [
    "Onde consulto a minha reserva?",
    "Entre na sua conta e aceda a Minhas Reservas para consultar os detalhes da viagem e o estado da reserva.",
  ],
  [
    "O que está incluído no preço?",
    "Consulte os detalhes do voo e o resumo da reserva antes de pagar. As condições de bagagem e da tarifa dependem da companhia e do voo escolhido.",
  ],
];

export default function HomePage() {
  return (
    <div className={`${styles.home} ${editorial.variable}`}>
      <section className={styles.hero} aria-labelledby="home-title">
        <Image
          src="/home/leba.jpg"
          alt="Estrada entre as montanhas da Serra da Leba, Angola"
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          preload
          className={styles.heroImage}
        />
        <div className={styles.overlay} />
        <span className={styles.location}>
          <MapPin size={15} aria-hidden="true" /> Serra da Leba · Angola
        </span>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>A viagem começa perto de si</p>
          <h1 id="home-title">
            Há um mundo
            <br />à sua espera.
          </h1>
          <p>
            Das paisagens de Angola aos seus próximos reencontros. Encontre o
            voo que o leva até lá.
          </p>
        </div>
      </section>
      <section
        id="pesquisa"
        className={styles.search}
        aria-label="Pesquisar voos"
      >
        <HomeSearch />
      </section>
      <div className={styles.reassurance}>
        <span>
          <Search size={19} aria-hidden="true" /> Compare opções de voo
        </span>
        <span>
          <CreditCard size={19} aria-hidden="true" /> Pagamentos em kwanzas
        </span>
        <span>
          <ShieldCheck size={19} aria-hidden="true" /> A sua viagem, num só
          lugar
        </span>
      </div>
      <HorizonteDestinations />
      <section
        id="vantagens"
        className={styles.benefits}
        aria-labelledby="benefits-title"
      >
        <div>
          <p className={styles.eyebrow}>Feito para viajar melhor</p>
          <h2 id="benefits-title">
            Mais perto do destino.
            <br />
            Mais simples para si.
          </h2>
          <p>
            Da primeira pesquisa à sua reserva, uma experiência pensada para
            quem parte de Angola.
          </p>
          <Link className={styles.textLink} href="/sobre">
            Conheça a ViajaFácil
          </Link>
        </div>
        <div className={styles.benefitList}>
          {[
            {
              icon: Search,
              title: "Escolha com clareza",
              text: "Compare horários, companhias e condições para encontrar a viagem que combina consigo.",
            },
            {
              icon: CreditCard,
              title: "Pague à sua maneira",
              text: "Consulte os valores em kwanzas e escolha a forma de pagamento disponível na reserva.",
            },
            {
              icon: ShieldCheck,
              title: "Organize tudo num só lugar",
              text: "Aceda à sua conta para acompanhar as reservas e consultar os detalhes dos seus voos.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <span>
                <Icon size={23} aria-hidden="true" />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="ajuda" className={styles.faq} aria-labelledby="faq-title">
        <div>
          <p className={styles.eyebrow}>Antes de fazer as malas</p>
          <h2 id="faq-title">
            Vamos esclarecer
            <br />
            as suas dúvidas.
          </h2>
          <p>O essencial para começar a planear a sua próxima viagem.</p>
        </div>
        <div>
          {questions.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className={styles.cta}>
        <p className={styles.eyebrow}>O próximo capítulo começa consigo</p>
        <h2>Para onde vamos agora?</h2>
        <a href="#pesquisa">Encontrar o meu voo</a>
      </section>
    </div>
  );
}
