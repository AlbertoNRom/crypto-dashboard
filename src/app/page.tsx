import type { Metadata } from "next";
import Link from "next/link";
import { BTCCandlestickChart } from "@/components/btc-candlestick-chart";

import { CryptoPricesSection } from "@/components/crypto-prices-section";
import { HomeHeroMotion } from "@/components/home-hero-motion";
import { AppNavbar } from "@/components/navbar";
import { SupportCryptoCoffee } from "@/components/support-crypto-coffee";

export const metadata: Metadata = {
  title: "CryptoDash - Gestiona tu Portfolio Crypto",
  description:
    "La plataforma más avanzada para rastrear, analizar y optimizar tus inversiones en criptomonedas. Diseñada para traders profesionales y entusiastas.",
  keywords: ["crypto", "bitcoin", "portfolio", "trading", "criptomonedas"],
  openGraph: {
    title: "CryptoDash - Gestiona tu Portfolio Crypto",
    description:
      "La plataforma más avanzada para rastrear, analizar y optimizar tus inversiones en criptomonedas.",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      {/* Hero Section */}
      <HomeHeroMotion />

      {/* Crypto Prices Preview */}
      <CryptoPricesSection />

      {/* BTC Candlestick Chart Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Análisis Técnico de Bitcoin
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Gráfico de velas profesional para análisis técnico avanzado
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <BTCCandlestickChart />
          </div>
        </div>
      </section>

      {/* Support - Crypto Coffee */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <SupportCryptoCoffee link="https://bmacc.app/tip/albertonr" currency="USDT" qrSrc="/bmacc.png" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>© 2025 CryptoDash. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
