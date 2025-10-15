import { TrendingUp, TrendingDown, BarChart3, DollarSign, Activity, Globe } from 'lucide-react';
import { AppNavbar } from '@/components/navbar';
import { fetchTopCryptos } from '@/lib/crypto-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function DashboardPage() {
  let cryptos: any[] = [];
  
  try {
    cryptos = await fetchTopCryptos(100);
  } catch (error) {
    console.error('Error fetching crypto data:', error);
  }

  // Calculate market stats
  const totalMarketCap = cryptos.reduce((sum, crypto) => sum + (crypto.market_cap || 0), 0);
  const totalVolume = cryptos.reduce((sum, crypto) => sum + (crypto.total_volume || 0), 0);
  const btcDominance = cryptos.find(c => c.id === 'bitcoin')?.market_cap / totalMarketCap * 100 || 0;

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,255,0.1),transparent_50%)] animate-pulse"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-10 right-20 w-16 h-16 border-2 border-primary/20 rounded-full animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-20 left-10 w-12 h-12 border border-primary/15 rounded-full animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "3s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in">
              <div className="relative p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm">
                <BarChart3 className="h-12 w-12 text-primary animate-pulse" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent animate-ping opacity-75"></div>
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-gradient">
                  Dashboard Crypto
                </h1>
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent mt-2 animate-pulse"></div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Monitorea el mercado de criptomonedas en tiempo real con análisis avanzado
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Market Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 hover:border-primary/40 transition-all duration-500 group shadow-lg hover:shadow-xl hover:shadow-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Criptomonedas</CardTitle>
                <Globe className="h-4 w-4 text-primary group-hover:animate-spin" style={{ animationDuration: "3s" }} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-foreground group-hover:scale-105 transition-transform duration-300">
                {cryptos.length.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Activos disponibles</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-green-500/5 hover:border-green-500/40 transition-all duration-500 group shadow-lg hover:shadow-xl hover:shadow-green-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Cap. de Mercado</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500 group-hover:animate-bounce" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-foreground group-hover:scale-105 transition-transform duration-300">
                ${(totalMarketCap / 1e12).toFixed(2)}T
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 text-xs px-2 py-0">
                  +2.1%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-blue-500/5 hover:border-blue-500/40 transition-all duration-500 group shadow-lg hover:shadow-xl hover:shadow-blue-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Volumen 24h</CardTitle>
                <Activity className="h-4 w-4 text-blue-500 group-hover:animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-foreground group-hover:scale-105 transition-transform duration-300">
                ${(totalVolume / 1e9).toFixed(0)}B
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 text-xs px-2 py-0">
                  -8.9%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-orange-500/5 hover:border-orange-500/40 transition-all duration-500 group shadow-lg hover:shadow-xl hover:shadow-orange-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Dominio BTC</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-500 group-hover:animate-bounce" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-foreground group-hover:scale-105 transition-transform duration-300">
                {btcDominance.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Participación del mercado</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Cryptos */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-foreground">Top Criptomonedas</h2>
            <Badge className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-yellow-50 border-yellow-500/30 px-3 py-1 text-sm font-medium shadow-lg">
              Trending
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cryptos.slice(0, 6).map((crypto, index) => (
              <Card
                key={crypto.id}
                className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 hover:border-primary/40 transition-all duration-500 group shadow-lg hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1"
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={crypto.image}
                          alt={crypto.name}
                          className="w-8 h-8 rounded-full group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                          {crypto.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground uppercase font-medium">
                          {crypto.symbol}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-1">
                      #{index + 1}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Precio</span>
                      <span className="text-lg font-bold text-foreground group-hover:scale-105 transition-transform duration-300">
                        ${crypto.current_price?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Cap. Mercado</span>
                      <span className="text-sm font-medium text-foreground">
                        ${(crypto.market_cap / 1e9).toFixed(1)}B
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">24h</span>
                      <Badge
                        className={`${
                          (crypto.price_change_percentage_24h || 0) >= 0
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                        } text-xs px-2 py-1 font-medium`}
                      >
                        {(crypto.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
                        {(crypto.price_change_percentage_24h || 0).toFixed(2)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Crypto Table */}
        <div className="animate-fade-in" style={{ animationDelay: "1.2s" }}>
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl">
            <CardHeader className="border-b border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-foreground">Todas las Criptomonedas</h3>
                  <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                    {cryptos.length} activos
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary animate-pulse" />
                  <span className="text-sm text-muted-foreground">En vivo</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-muted/50 to-primary/5 border-b border-primary/10">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">#</th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Nombre</th>
                      <th className="text-right p-4 text-sm font-semibold text-muted-foreground">Precio</th>
                      <th className="text-right p-4 text-sm font-semibold text-muted-foreground">24h %</th>
                      <th className="text-right p-4 text-sm font-semibold text-muted-foreground">7d %</th>
                      <th className="text-right p-4 text-sm font-semibold text-muted-foreground">Cap. Mercado</th>
                      <th className="text-right p-4 text-sm font-semibold text-muted-foreground">Volumen (24h)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cryptos.map((crypto, index) => (
                      <tr 
                        key={crypto.id} 
                        className="border-b border-primary/10 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 group"
                      >
                        <td className="p-4">
                          <Badge className="bg-muted text-muted-foreground border-muted-foreground/20 text-xs px-2 py-1">
                            {crypto.market_cap_rank || index + 1}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={crypto.image}
                                alt={crypto.name}
                                className="w-8 h-8 rounded-full group-hover:scale-110 transition-transform duration-300"
                              />
                              {index < 3 && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {crypto.name}
                              </div>
                              <div className="text-xs text-muted-foreground uppercase font-medium">
                                {crypto.symbol}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-mono text-foreground font-semibold group-hover:scale-105 transition-transform duration-300 inline-block">
                            ${crypto.current_price?.toLocaleString() || '0'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Badge
                            className={`${
                              (crypto.price_change_percentage_24h || 0) >= 0
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                            } text-xs px-2 py-1 font-medium`}
                          >
                            {(crypto.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
                            {(crypto.price_change_percentage_24h || 0).toFixed(2)}%
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <Badge
                            className={`${
                              (crypto.price_change_percentage_7d_in_currency || 0) >= 0
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                            } text-xs px-2 py-1 font-medium`}
                          >
                            {(crypto.price_change_percentage_7d_in_currency || 0) >= 0 ? '+' : ''}
                            {(crypto.price_change_percentage_7d_in_currency || 0).toFixed(2)}%
                          </Badge>
                        </td>
                        <td className="p-4 text-right font-mono text-foreground font-medium">
                          ${(crypto.market_cap / 1e9).toFixed(2)}B
                        </td>
                        <td className="p-4 text-right font-mono text-foreground font-medium">
                          ${(crypto.total_volume / 1e6).toFixed(0)}M
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}