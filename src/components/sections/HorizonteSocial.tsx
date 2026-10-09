"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

type SocialPost = {
  platform: "Instagram" | "TikTok";
  title: string;
  image: string;
  alt: string;
  url: string;
  date: string;
  displayDate: string;
};

const posts: SocialPost[] = [
  {
    platform: "Instagram",
    title: "Do Brasil para África",
    image: "/home/social/brasil.jpg",
    alt: "Publicação da ViajaFácil dirigida a quem viaja do Brasil para África",
    url: "https://www.instagram.com/viajafacilapp/p/DeNLSbpRWGX/",
    date: "2026-10-07",
    displayDate: "7 out. 2026",
  },
  {
    platform: "Instagram",
    title: "Outubro Rosa",
    image: "/home/social/outubro-rosa.jpg",
    alt: "Publicação da ViajaFácil sobre o Outubro Rosa",
    url: "https://www.instagram.com/viajafacilapp/p/Dd_-Ln4DN3Y/",
    date: "2026-10-02",
    displayDate: "2 out. 2026",
  },
  {
    platform: "Instagram",
    title: "Qual seria a sua próxima viagem?",
    image: "/home/social/proxima-viagem.jpg",
    alt: "Publicação da ViajaFácil a perguntar para onde viajaria hoje, com uma paisagem junto ao mar",
    url: "https://www.instagram.com/viajafacilapp/p/Dd9VBYQjMqe/",
    date: "2026-10-01",
    displayDate: "1 out. 2026",
  },
];

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.89-2.89c.3 0 .59.05.86.13V9.4a6.34 6.34 0 1 0 5.48 6.27V8.68a8.2 8.2 0 0 0 4.79 1.54V6.77c-.35 0-.69-.03-1.02-.08Z" /></svg>);
}

export default function HorizonteSocial() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const updateEdges = () => {
    const track = trackRef.current;
    if (!track) return;
    setEdges({ start: track.scrollLeft <= 2, end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 2 });
  };
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);
  const slide = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".social-card");
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * ((card?.offsetWidth || track.clientWidth) + gap), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return (
    <section className="social-section shell" aria-labelledby="social-heading" id="redes-sociais">
      <div className="section-heading">
        <div>
          <span className="eyebrow">VIAJAFÁCIL, MAIS PERTO DE SI</span>
          <h2 id="social-heading">A viagem continua nas nossas redes.</h2>
          <p>Inspiração, novidades e conversas que nos aproximam.</p>
        </div>
        <div className="social-controls" aria-label="Navegar pelas publicações">
          <button type="button" aria-label="Publicação anterior" aria-controls="social-posts" disabled={edges.start} onClick={() => slide(-1)}><ChevronLeft size={20} aria-hidden="true" /></button>
          <button type="button" aria-label="Próxima publicação" aria-controls="social-posts" disabled={edges.end} onClick={() => slide(1)}><ChevronRight size={20} aria-hidden="true" /></button>
        </div>
      </div>
      <div className="social-grid" id="social-posts" ref={trackRef} onScroll={updateEdges} tabIndex={0} role="region" aria-label="Publicações das redes sociais" aria-roledescription="carrossel" onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          slide(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}>
        {posts.map((post) => (
          <article className="social-card" key={post.url}>
            <a className="social-post-link" href={post.url} target="_blank" rel="noopener noreferrer" aria-label={`${post.title} — ver publicação no ${post.platform} (abre numa nova janela)`}>
              <div className="social-image">
                <Image src={post.image} alt={post.alt} width={512} height={640} sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw" loading="lazy" />
              </div>
              <div className="social-copy">
                <div className="social-meta">
                  <span>{post.platform === "Instagram" ? <InstagramIcon /> : <TikTokIcon />} {post.platform}</span>
                  <time dateTime={post.date}>{post.displayDate}</time>
                </div>
                <h3>{post.title}</h3>
                <span className="social-read">Ver publicação <ArrowUpRight size={18} aria-hidden="true" /></span>
              </div>
            </a>
          </article>
        ))}
      </div>
      <div className="social-follow">
        <span>Venha fazer parte da viagem.</span>
        <a href="https://www.instagram.com/viajafacilapp/" target="_blank" rel="noopener noreferrer"><InstagramIcon /> @viajafacilapp <ArrowUpRight size={16} aria-hidden="true" /></a>
        <a href="https://www.tiktok.com/@viajafacil.app" target="_blank" rel="noopener noreferrer">
          <TikTokIcon />
          @viajafacil.app <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
