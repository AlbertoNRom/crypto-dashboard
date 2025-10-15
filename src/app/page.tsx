import { ArrowRight, BarChart3, Star, TrendingUp, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BTCCandlestickChart } from "@/components/btc-candlestick-chart";

import { CryptoPricesSection } from "@/components/crypto-prices-section";
import { AppNavbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)] animate-pulse"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-20 left-10 w-20 h-20 border-2 border-primary/30 rounded-full animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          ></div>
          <div
            className="absolute top-40 right-20 w-12 h-12 border border-primary/20 rounded-full animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-20 right-10 w-16 h-16 border-2 border-primary/25 rounded-full animate-bounce"
            style={{ animationDelay: "2s", animationDuration: "5s" }}
          ></div>
          <div
            className="absolute bottom-40 left-20 w-8 h-8 border border-primary/15 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s", animationDuration: "3.5s" }}
          ></div>

          {/* Gradient Orbs */}
          <div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-l from-primary/15 to-transparent rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Logo and Title */}
            <div className="flex items-center justify-center gap-6 mb-8 animate-fade-in">
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm">
                <TrendingUp className="h-16 w-16 text-primary animate-pulse" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent animate-ping opacity-75"></div>
              </div>
              <div className="text-left">
                <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-gradient">
                  CryptoDash
                </h1>
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent mt-2 animate-pulse"></div>
              </div>
            </div>

            {/* New Feature Badge */}
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Badge
                variant="secondary"
                className="mb-6 px-6 py-2 text-sm font-medium dark:bg-yellow-200 dark:from-yellow-800/20 dark:to-yellow-700/10 border-black dark:border-yellow-700/30 hover:border-gray-800 dark:hover:border-yellow-600/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-yellow-100 dark:text-yellow-800 font-bold"
              >
                <Star
                  className="h-4 w-4 mr-2 text-white dark:text-yellow-400 animate-spin"
                  style={{ animationDuration: "3s" }}
                />
                Nuevo: Integración con Stripe para donaciones
              </Badge>
            </div>

            {/* Main Heading */}
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight">
                <span className="text-foreground">Gestiona tu</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent animate-gradient">
                  Portfolio Crypto
                </span>
                <br />
                <span className="text-foreground">como un profesional</span>
              </h2>
            </div>

            {/* Description */}
            <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
                La plataforma más avanzada para rastrear, analizar y optimizar
                tus inversiones en criptomonedas. Diseñada para traders
                profesionales y entusiastas.
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in"
              style={{ animationDelay: "0.8s" }}
            >
              <Button
                asChild
                size="lg"
                className="font-semibold bg-gradient-to-r from-primary to-cyan-500 hover:from-cyan-500 hover:to-primary text-white border-0 hover:scale-110 transition-all duration-500 px-10 py-4 text-lg shadow-2xl hover:shadow-primary/50 group"
              >
                <Link href="/auth">
                  <Wallet className="h-6 w-6 mr-3 group-hover:animate-bounce" />
                  Comenzar Gratis
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-semibold border-2 border-primary/50 hover:border-primary bg-transparent hover:bg-primary/10 text-foreground hover:text-primary transition-all duration-500 px-10 py-4 text-lg hover:scale-105 group backdrop-blur-sm"
              >
                <Link href="/dashboard">
                  <BarChart3 className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                  Dashboard
                </Link>
              </Button>
            </div>

            {/* Stats or Features Preview */}
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 animate-fade-in"
              style={{ animationDelay: "1s" }}
            >
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 group">
                <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  24/7
                </div>
                <div className="text-muted-foreground">
                  Monitoreo en Tiempo Real
                </div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 group">
                <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  100+
                </div>
                <div className="text-muted-foreground">
                  Criptomonedas Soportadas
                </div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 group">
                <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  99.9%
                </div>
                <div className="text-muted-foreground">Tiempo de Actividad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>© 2025 CryptoDash. Todos los derechos reservados.</p>
            </div>
            <div className="flex items-center space-x-2">
              <Link 
                href="https://www.coingecko.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-200"
              >
                <img 
                   src="/poweredbyCG.avif" 
                   alt="Powered by CoinGecko" 
                   className="h-10 w-auto"
                 />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
