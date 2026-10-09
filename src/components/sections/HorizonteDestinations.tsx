"use client";
import { useState } from "react";
import Image from "next/image";
import { useHorizonteForm } from "@/components/layout/HorizonteShell";
export default function HorizonteDestinations() {
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState("");
  const f = useHorizonteForm();
  const choose = (code: string, city: string) => {
    f.setOrigin("LAD");
    f.setDestination(code);
    if (f.tripType === "multicity") f.setTripType("roundtrip");
    setStatus(`${city} selecionado. Escolha as datas para pesquisar.`);
    document
      .getElementById("pesquisa")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    document
      .querySelector<HTMLSelectElement>('select[aria-label="Destino"]')
      ?.focus({ preventScroll: true });
  };
  return (
    <section
      aria-labelledby="destinations-heading"
      className="destinations shell"
      id="destinos"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">UM BOM LUGAR PARA COMEÇAR</span>
          <h2 id="destinations-heading">Para onde vamos?</h2>
          <p>Descubra Angola. Ou vá um pouco mais longe.</p>
        </div>
        <div aria-label="Filtrar destinos" className="filter-tabs" role="group">
          <button
            aria-pressed={filter === "all"}
            data-filter="all"
            onClick={() => setFilter("all")}
          >
            Todos
          </button>
          <button
            aria-pressed={filter === "domestic"}
            data-filter="domestic"
            onClick={() => setFilter("domestic")}
          >
            Em Angola
          </button>
          <button
            aria-pressed={filter === "international"}
            data-filter="international"
            onClick={() => setFilter("international")}
          >
            Internacionais
          </button>
        </div>
      </div>
      <div className="destination-grid">
        <article
          className="destination-card"
          data-category="domestic"
          hidden={filter !== "all" && filter !== "domestic"}
        >
          <div className="destination-image">
            <Image
              alt="Praia da Baía Azul em Benguela, com o mar e guarda-sóis de palha"
              height={640}
              loading="lazy"
              sizes="(max-width: 650px) 100vw, 33vw"
              src="/home/benguela.jpg"
              width={958}
            />
            <span className="image-pill">Sol e mar</span>
            <span className="destination-country">ANGOLA</span>
          </div>
          <div className="destination-content">
            <div className="destination-title">
              <h3>Benguela</h3>
              <svg className="icon" aria-hidden="true">
                <use href="#i-pin"></use>
              </svg>
            </div>
            <p>Uma pausa junto ao Atlântico.</p>
            <div className="destination-bottom">
              <span>Saída de Luanda</span>
              <button
                className="destination-choose"
                data-destination="Benguela"
                onClick={() => choose("CAB", "Benguela")}
              >
                Escolher destino
              </button>
            </div>
          </div>
        </article>
        <article
          className="destination-card"
          data-category="domestic"
          hidden={filter !== "all" && filter !== "domestic"}
        >
          <div className="destination-image">
            <Image
              alt="Montanhas e curvas da Serra da Leba, perto do Lubango"
              height={683}
              loading="lazy"
              sizes="(max-width: 650px) 100vw, 33vw"
              src="/home/leba.jpg"
              width={1024}
            />
            <span className="image-pill">Natureza</span>
            <span className="destination-country">ANGOLA</span>
          </div>
          <div className="destination-content">
            <div className="destination-title">
              <h3>Lubango</h3>
              <svg className="icon" aria-hidden="true">
                <use href="#i-pin"></use>
              </svg>
            </div>
            <p>Novas perspetivas, lá do alto.</p>
            <div className="destination-bottom">
              <span>Saída de Luanda</span>
              <button
                className="destination-choose"
                data-destination="Lubango"
                onClick={() => choose("NOV", "Lubango")}
              >
                Escolher destino
              </button>
            </div>
          </div>
        </article>
        <article
          className="destination-card"
          data-category="international"
          hidden={filter !== "all" && filter !== "international"}
        >
          <div className="destination-image">
            <Image
              alt="Vista urbana de Lisboa junto ao rio Tejo"
              height={1000}
              loading="lazy"
              sizes="(max-width: 650px) 100vw, 33vw"
              src="/home/lisboa.jpg"
              width={900}
            />
            <span className="image-pill">Cidade e cultura</span>
            <span className="destination-country">PORTUGAL</span>
          </div>
          <div className="destination-content">
            <div className="destination-title">
              <h3>Lisboa</h3>
              <svg className="icon" aria-hidden="true">
                <use href="#i-pin"></use>
              </svg>
            </div>
            <p>Reencontros e ruas por descobrir.</p>
            <div className="destination-bottom">
              <span>Saída de Luanda</span>
              <button
                className="destination-choose"
                data-destination="Lisboa"
                onClick={() => choose("LIS", "Lisboa")}
              >
                Escolher destino
              </button>
            </div>
          </div>
        </article>
      </div>
      <p
        aria-live="polite"
        className="sr-only"
        id="destination-status"
        role="status"
      >
        {status}
      </p>
      <div className="destination-footnote">
        <span>O destino é só o começo.</span>
        <a href="#pesquisa">Pesquisar outro destino</a>
      </div>
    </section>
  );
}
