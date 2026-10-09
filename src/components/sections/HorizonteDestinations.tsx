"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchForm } from "@/hooks/useSearchForm";
import { featuredDestinations } from "@/lib/data/destinations";
import styles from "@/app/home.module.css";

const images = ["/home/benguela.jpg", "/home/leba.jpg", "/home/lisboa.jpg"];
const descriptions = [
  "Dias de sol, mar e novos caminhos.",
  "Paisagens que merecem uma pausa.",
  "Reencontros e a cidade das sete colinas.",
];
const filters = ["Todos", "Em Angola", "Internacionais"] as const;
export default function HorizonteDestinations() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todos");
  const { handleBookDestination } = useSearchForm();
  return (
    <section
      id="destinos"
      className={styles.destinations}
      aria-labelledby="destinations-title"
    >
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>Encontre a sua próxima história</p>
          <h2 id="destinations-title">Um destino para cada vontade.</h2>
          <p>Perto de casa ou do outro lado do mundo. A escolha é sua.</p>
        </div>
        <div
          className={styles.filters}
          role="group"
          aria-label="Filtrar destinos"
        >
          {filters.map((label) => (
            <button
              key={label}
              type="button"
              aria-pressed={filter === label}
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.destinationGrid}>
        {featuredDestinations.map((destination, i) => {
          if (
            (filter === "Em Angola" && destination.country !== "Angola") ||
            (filter === "Internacionais" && destination.country === "Angola")
          )
            return null;
          return (
            <button
              type="button"
              key={destination.city}
              className={styles.destinationCard}
              onClick={() => handleBookDestination(destination)}
              aria-label={`Pesquisar voos de Luanda para ${destination.city}`}
            >
              <div className={styles.destinationImage}>
                <Image
                  src={images[i]}
                  alt={
                    destination.city === "Lubango"
                      ? "Serra da Leba"
                      : destination.city
                  }
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
                />
              </div>
              <div className={styles.destinationInfo}>
                <p>{destination.country}</p>
                <h3>{destination.city}</h3>
                <p>{descriptions[i]}</p>
                <span>Explorar voos</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
