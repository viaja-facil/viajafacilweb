import Image from "next/image";
import HorizonteSearch from "@/components/sections/HorizonteSearch";
import HorizonteSocial from "@/components/sections/HorizonteSocial";
import HorizonteDestinations from "@/components/sections/HorizonteDestinations";

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-heading" className="hero shell">
        <div className="hero-photo">
          <Image
            alt="Estrada sinuosa da Serra da Leba, entre as montanhas de Angola"
            preload
            sizes="(max-width: 1488px) 100vw, 1440px"
            height={683}
            src="/home/leba.jpg"
            width={1024}
          />
          <div className="photo-shade"></div>
          <div className="photo-tag">
            <svg className="icon" aria-hidden="true">
              <use href="#i-pin"></use>
            </svg>
            <div>
              <strong>Há tanto por descobrir.</strong>
              <span>Serra da Leba · Angola</span>
            </div>
          </div>
          <span className="photo-number">01 / ANGOLA</span>
        </div>
        <div className="hero-copy">
          <span className="eyebrow">A VIAGEM COMEÇA PERTO DE SI</span>
          <h1 id="hero-heading">
            Há um mundo
            <br />
            <span>à sua espera.</span>
          </h1>
          <p>
            Das paisagens de Angola aos seus próximos reencontros.
            <br /> Encontre o voo que o leva até lá.
          </p>
        </div>
        <HorizonteSearch />
      </section>
      <div className="reassurance shell">
        <span>
          <svg className="icon" aria-hidden="true">
            <use href="#i-pin"></use>
          </svg>{" "}
          Feito para quem parte de Angola
        </span>
        <span>
          <svg className="icon" aria-hidden="true">
            <use href="#i-search"></use>
          </svg>{" "}
          Compare antes de escolher
        </span>
        <span>
          <svg className="icon" aria-hidden="true">
            <use href="#i-heart"></use>
          </svg>{" "}
          Viaje do seu jeito
        </span>
      </div>
      <HorizonteDestinations />
      <section
        aria-labelledby="benefits-heading"
        className="benefits-section"
        id="vantagens"
      >
        <div className="shell benefits-layout">
          <div className="benefits-intro">
            <span className="eyebrow">MENOS COMPLICAÇÕES. MAIS VIAGEM.</span>
            <h2 id="benefits-heading">
              Viajar começa
              <br />
              por uma boa escolha.
            </h2>
            <p>O que importa para si, no centro da experiência.</p>
            <a className="text-link" href="#pesquisa">
              Planear a minha viagem
            </a>
          </div>
          <div className="benefits-grid">
            <article>
              <div className="benefit-icon">
                <svg className="icon" aria-hidden="true">
                  <use href="#i-search"></use>
                </svg>
              </div>
              <h3>Encontre o seu voo</h3>
              <p>
                Escolha o destino, as datas e quem vai consigo. O primeiro passo
                fica simples.
              </p>
            </article>
            <article>
              <div className="benefit-icon">
                <svg className="icon" aria-hidden="true">
                  <use href="#i-pin"></use>
                </svg>
              </div>
              <h3>Angola como ponto de partida</h3>
              <p>
                Uma experiência em português, com destinos nacionais e
                internacionais.
              </p>
            </article>
            <article>
              <div className="benefit-icon">
                <svg className="icon" aria-hidden="true">
                  <use href="#i-calendar"></use>
                </svg>
              </div>
              <h3>Planos à sua medida</h3>
              <p>
                Só ida, ida e volta ou vários destinos. Prepare a viagem que faz
                sentido para si.
              </p>
            </article>
            <article>
              <div className="benefit-icon">
                <svg className="icon" aria-hidden="true">
                  <use href="#i-heart"></use>
                </svg>
              </div>
              <h3>Inspiração para ir mais longe</h3>
              <p>
                Do mar às montanhas, descubra um bom motivo para fazer as malas.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="faq-heading"
        className="faq-section shell"
        id="ajuda"
      >
        <div className="faq-intro">
          <span className="eyebrow">ANTES DE FAZER AS MALAS</span>
          <h2 id="faq-heading">
            Vamos esclarecer
            <br />
            as suas dúvidas.
          </h2>
          <p>Um pouco de informação para começar com confiança.</p>
          <div className="help-box">
            <svg className="icon" aria-hidden="true">
              <use href="#i-chat"></use>
            </svg>
            <div>
              <strong>Precisa de mais informações?</strong>
              <a href="/sobre">Visitar a ajuda da ViajaFácil</a>
            </div>
          </div>
        </div>
        <div className="faq-list">
          <details open>
            <summary>
              Como começo a procurar um voo?<span className="faq-plus"></span>
            </summary>
            <p>
              Selecione a origem, o destino, as datas e o número de passageiros.
              Pode também escolher um dos destinos em destaque para preencher a
              pesquisa.
            </p>
          </details>
          <details>
            <summary>
              Posso pesquisar viagens só de ida?
              <span className="faq-plus"></span>
            </summary>
            <p>
              Sim. Escolha «Só ida» no formulário. Para visitar mais de um
              destino, escolha «Multi-cidade» e indique os dois percursos.
            </p>
          </details>
          <details>
            <summary>
              Como acompanho a minha reserva?<span className="faq-plus"></span>
            </summary>
            <p>
              Entre na sua conta e aceda a Minhas Reservas para consultar os
              detalhes e o estado da viagem.
            </p>
          </details>
          <details>
            <summary>
              As imagens e os destinos são ofertas disponíveis?
              <span className="faq-plus"></span>
            </summary>
            <p>
              Os destinos servem de inspiração. Confirme a disponibilidade, os
              horários, as tarifas e as condições nos resultados da pesquisa.
            </p>
          </details>
          <details>
            <summary>
              Onde confirmo bagagem, alterações e reembolsos?
              <span className="faq-plus"></span>
            </summary>
            <p>
              Estas condições dependem da companhia e da tarifa escolhida.
              Confirme-as antes de concluir qualquer reserva na plataforma
              atual.
            </p>
          </details>
        </div>
      </section>
      <HorizonteSocial />
      <section className="closing shell">
        <div>
          <span className="eyebrow">A PRÓXIMA HISTÓRIA É SUA</span>
          <h2>Há um mundo à sua espera.</h2>
        </div>
        <a className="button light-button" href="#pesquisa">
          <svg className="icon" aria-hidden="true">
            <use href="#i-search"></use>
          </svg>
          Encontrar o meu destino
        </a>
      </section>
    </>
  );
}
