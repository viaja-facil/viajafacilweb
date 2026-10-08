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
    default: "ViajaFácil — Pesquise voos a partir de Angola",
    template: "%s | ViajaFácil",
  },
  description:
    "Explore a demonstração de pesquisa e reserva de voos a partir de Angola. Compare rotas, horários e preços fictícios, sem cobrança ou emissão real.",
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
    "@type": "Organization",
    name: "ViajaFácil",
    url: baseUrl,
    logo: `${baseUrl}/viajafacil.png`,
    description: "Demonstração de pesquisa e reserva de voos a partir de Angola, sem cobrança ou emissão real.",
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
