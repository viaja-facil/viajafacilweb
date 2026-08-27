import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = "https://viajafacil.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "ViajaFácil - Passagens Aéreas Angola | Voos Baratos Luanda",
    template: "%s | ViajaFácil",
  },
  description:
    "Compre passagens aéreas baratas em Angola. Voos domésticos e internacionais a partir de Luanda. Compare preços TAAG, TAP, Emirates e reserve em poucos cliques.",
  keywords: [
    "passagens aéreas angola",
    "voos baratos luanda",
    "comprar passagens aéreas",
    "passagens aéreas luanda benguela",
    "bilhete eletrônico angola",
    "check-in online",
    "voos domésticos angola",
    "TAAG",
    "TAP Air Portugal",
    "Emirates Angola",
    "passagens aéreas baratas",
    "reservar voo angola",
    "voos lubango",
    "passagens namibe",
    "voo malanje",
    "passagem aérea saurimo",
  ],
  authors: [{ name: "ViajaFácil", url: baseUrl }],
  creator: "ViajaFácil",
  publisher: "ViajaFácil",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_AO",
    url: baseUrl,
    siteName: "ViajaFácil",
    title: "ViajaFácil - Passagens Aéreas Angola | Voos Baratos",
    description:
      "A plataforma mais fácil para comprar passagens aéreas em Angola. Encontre os melhores preços e reserve seu voo.",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ViajaFácil - Passagens Aéreas Angola",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ViajaFácil - Passagens Aéreas Angola",
    description:
      "Compre passagens aéreas baratas em Angola. Voos domésticos e internacionais.",
    images: [`${baseUrl}/og-image.png`],
  },
  alternates: {
    canonical: baseUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a1628",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const travelAgencySchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "https://viajafacil.app/#organization",
    name: "ViajaFácil",
    alternateName: "Viaja Facil",
    description:
      "Plataforma líder para compra de passagens aéreas em Angola. Voos domésticos e internacionais com os melhores preços.",
    url: baseUrl,
    logo: `${baseUrl}/viajafacil.png`,
    image: `${baseUrl}/og-image.png`,
    telephone: "+244923456789",
    email: "info@viajafacil.app",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. 4 de Fevereiro",
      addressLocality: "Luanda",
      addressRegion: "Luanda",
      addressCountry: "AO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -8.8399,
      longitude: 13.2894,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    priceRange: "$$",
    paymentAccepted: "Multicaixa Express, Cartão de Crédito, Cartão de Débito",
    currenciesAccepted: "AOA",
    areaServed: {
      "@type": "Country",
      name: "Angola",
      "@id": "https://www.wikidata.org/wiki/Q916",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Passagens Aéreas",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Voo Luanda → Benguela",
            description: "Passagem aérea doméstica de Luanda para Benguela",
          },
          price: "48000",
          priceCurrency: "AOA",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Voo Luanda → Lisboa",
            description: "Passagem aérea internacional de Luanda para Lisboa",
          },
          price: "750000",
          priceCurrency: "AOA",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Voo Luanda → Dubai",
            description: "Passagem aérea internacional de Luanda para Dubai",
          },
          price: "520000",
          priceCurrency: "AOA",
        },
      ],
    },
    sameAs: [
      "https://www.facebook.com/viajafacil",
      "https://www.instagram.com/viajafacil",
      "https://twitter.com/viajafacil",
    ],
    foundingDate: "2024",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Maria José",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "Comprei a minha passagem em menos de 2 minutos. Preço melhor do que em qualquer agência.",
      },
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Carlos Silva",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "Uso a ViajaFácil para todas as minhas viagens de trabalho. A comparação de preços é incrível.",
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ViajaFácil",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?origin={origin}&destination={destination}`,
      },
      "query-input": {
        "@type": "RequiredSpecification",
        value: "origin destination",
      },
    },
  };

  return (
    <html
      lang="pt-AO"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(travelAgencySchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
