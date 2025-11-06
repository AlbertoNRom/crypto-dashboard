"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Star, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// GhostCursor eliminado: el SplashCursor se monta globalmente en Providers

export const HomeHeroMotion = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background limpio y responsivo al modo */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background dark:from-muted/20 dark:via-background dark:to-background"></div>
        <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_50%_0%,theme(colors.primary/6),transparent_70%)] dark:bg-[radial-gradient(600px_circle_at_50%_0%,theme(colors.primary/10),transparent_70%)]"></div>
      </div>

      {/* GhostCursor removido; el SplashCursor global está en Providers */}

      {/* Contenido del hero sin animación en el contenedor */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="space-y-8">
          {/* Logo and Title */}
          <motion.div
            className="flex items-center justify-center gap-3 sm:gap-6 mb-8 min-w-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="relative p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm">
              <TrendingUp className="h-10 w-10 sm:h-16 sm:w-16 text-primary animate-pulse" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent animate-ping opacity-75"></div>
            </div>
            <div className="text-left">
              <h1 className="text-5xl sm:text-7xl font-bold text-foreground">
                CryptoDash
              </h1>
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent mt-2 animate-pulse"></div>
            </div>
          </motion.div>

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
            Nuevo: Botón de apoyo (Buy Me a Coffee)
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
              La plataforma más avanzada para rastrear, analizar y optimizar tus
              inversiones en criptomonedas. Diseñada para traders profesionales
              y entusiastas.
            </p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                size="lg"
                className="font-semibold bg-gradient-to-r from-primary to-cyan-500 hover:from-cyan-500 hover:to-primary text-white border-0 transition-all duration:300 px-10 py-4 text-lg shadow-2xl hover:shadow-primary/50 group"
              >
                <Link href="/auth">
                  <Wallet className="h-6 w-6 mr-3 group-hover:animate-bounce" />
                  Comenzar Gratis
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-semibold border-2 border-primary/50 hover:border-primary bg-transparent hover:bg-primary/10 text-foreground hover:text-primary transition-all duration-300 px-10 py-4 text-lg group backdrop-blur-sm"
              >
                <Link href="/market">
                  <BarChart3 className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                  Market
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
