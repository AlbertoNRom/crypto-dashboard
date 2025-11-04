import { BarChart3 } from "lucide-react";
import { CryptoDashboardClient } from "@/components/crypto-dashboard-client";
import { AppNavbar } from "@/components/navbar";

const MarketPage = async() => {
  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

  {/* Hero Section */}
  <section className="relative py-16 overflow-hidden">
    {/* Animated Background */}
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
    </div>
    

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm">
                <BarChart3 className="h-12 w-12 text-primary" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent opacity-75"></div>
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  Dashboard Crypto
                </h1>
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent mt-2"></div>
              </div>
            </div>
            <p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Monitorea el mercado de criptomonedas en tiempo real con análisis
              avanzado
            </p>
          </div>
        </div>
      </section>

      {/* Contenido dinámico del Dashboard */}
      <CryptoDashboardClient />
    </div>
  );
}

export default MarketPage;
