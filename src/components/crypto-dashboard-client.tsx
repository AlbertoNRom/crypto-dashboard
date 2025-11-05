'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, DollarSign, Globe, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchTopCryptos, type TickerData } from '@/lib/crypto-api';

const BASES = [
  { base: 'XBT', label: 'Bitcoin', symbol: 'BTC' },
  { base: 'ETH', label: 'Ethereum', symbol: 'ETH' },
  { base: 'SOL', label: 'Solana', symbol: 'SOL' },
  { base: 'ADA', label: 'Cardano', symbol: 'ADA' },
  { base: 'XRP', label: 'XRP', symbol: 'XRP' },
  { base: 'BNB', label: 'BNB', symbol: 'BNB' },
];

export const CryptoDashboardClient = () => {
  const [quote, setQuote] = useState<'USD' | 'EUR'>('USD');
  const [cryptos, setCryptos] = useState<TickerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pairs = useMemo(() => BASES.map(b => `${b.base}${quote}`), [quote]);

  // Formateador de moneda dependiente de la selección (USD/EUR)
  const formatCurrency = useMemo(() => {
    const locale = 'es-ES';
    const sanitizeUsd = (str: string) => str.replace(/US\$/g, '$');
    return (value: number | undefined | null) => {
      const num = typeof value === 'number' ? value : 0;
      const formatted = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: quote,
        maximumFractionDigits: 2,
      }).format(num);
      return quote === 'USD' ? sanitizeUsd(formatted) : formatted;
    };
  }, [quote]);

  // Formateador compacto para grandes cantidades (ej. volumen 24h)
  const formatCurrencyCompact = useMemo(() => {
    const locale = 'es-ES';
    const sanitizeUsd = (str: string) => str.replace(/US\$/g, '$');
    return (value: number | undefined | null) => {
      const num = typeof value === 'number' ? value : 0;
      const formatted = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: quote,
        maximumFractionDigits: 1,
        notation: 'compact',
        compactDisplay: 'short',
      }).format(num);
      return quote === 'USD' ? sanitizeUsd(formatted) : formatted;
    };
  }, [quote]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTopCryptos(pairs);
        setCryptos(data);
      } catch {
        setError('No se pudo cargar datos del mercado');
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [pairs]);

  const avgPrice = cryptos.length > 0
    ? cryptos.reduce((sum, c) => sum + (c.current_price || 0), 0) / cryptos.length
    : 0;
  const totalVolume24h = cryptos.reduce((sum, c) => sum + (c.volume_24h || 0), 0);
  const avgChange24h = cryptos.length > 0
    ? cryptos.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) / cryptos.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Controles */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Moneda</span>
          <div role="tablist" aria-label="Seleccionar moneda" className="inline-flex rounded-lg border border-muted/30 overflow-hidden">
            {(['USD','EUR'] as const).map((q) => (
              <button
                key={q}
                role="tab"
                type="button"
                aria-selected={quote === q}
                onClick={() => setQuote(q)}
                className={`px-3 py-1 text-sm rounded-md transition-all ${quote === q ? 'bg-primary/20 text-primary border border-primary hover:bg-primary/30 active:scale-95' : 'text-muted-foreground hover:bg-muted/40 active:scale-95'}`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Estado de error */}
      {error && (
        <div role="alert" className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</div>
      )}

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 group shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Criptomonedas</CardTitle>
              <Globe className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">
              {loading ? (
                <div aria-hidden className="h-7 w-16 rounded bg-muted animate-pulse" />
              ) : (
                cryptos.length.toLocaleString()
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Activos disponibles</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-green-500/5 group shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Precio Promedio</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div suppressHydrationWarning className="text-2xl font-bold text-foreground">
              {loading ? (
                <div aria-hidden className="h-7 w-28 rounded bg-muted animate-pulse" />
              ) : (
                formatCurrency(avgPrice)
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Badge className="bg-transparent text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs px-2 py-0">
                {avgChange24h >= 0 ? '+' : ''}{avgChange24h.toFixed(2)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-blue-500/5 group shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Volumen 24h</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div suppressHydrationWarning className="text-2xl font-bold text-foreground">
              {loading ? (
                <div aria-hidden className="h-7 w-36 rounded bg-muted animate-pulse" />
              ) : (
                formatCurrencyCompact(totalVolume24h)
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 text-xs px-2 py-0">
                {avgChange24h >= 0 ? '+' : ''}{avgChange24h.toFixed(2)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-orange-500/5 group shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tendencia 24h</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">{avgChange24h.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Promedio de variación diaria</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Criptos */}
      <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
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
              className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 group shadow-lg hover:-translate-y-1 transition-all duration-500"
              style={{ animationDelay: `${0.8 + index * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                        {crypto.symbol.toUpperCase()}
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-foreground">
                        {crypto.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground uppercase font-medium">
                        {crypto.symbol}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-1">#{index + 1}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Precio</span>
                    <span suppressHydrationWarning className="text-lg font-bold text-foreground">
                      {loading ? (
                        <span aria-hidden className="inline-block h-5 w-24 rounded bg-muted animate-pulse" />
                      ) : (
                        formatCurrency(crypto.current_price)
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Volumen 24h</span>
                    <span className="text-sm font-medium text-foreground">
                      {loading ? (
                        <span aria-hidden className="inline-block h-4 w-10 rounded bg-muted animate-pulse" />
                      ) : (
                        (crypto.volume_24h / 1e6).toFixed(0) + 'M'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">24h</span>
                    <Badge className={`${(crypto.price_change_percentage_24h || 0) >= 0 ? 'bg-transparent text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'} text-xs px-2 py-1 font-medium`}>
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

      {/* Tabla */}
      <div className="animate-fade-in" style={{ animationDelay: '1.2s' }}>
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl">
          <CardHeader className="border-b border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-foreground">Todas las Criptomonedas</h3>
                <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">{cryptos.length} activos</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
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
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Par</th>
                    <th className="text-right p-4 text-sm font-semibold text-muted-foreground">Precio</th>
                    <th className="text-right p-4 text-sm font-semibold text-muted-foreground">24h %</th>
                    <th className="text-right p-4 text-sm font-semibold text-muted-foreground">Máx 24h</th>
                    <th className="text-right p-4 text-sm font-semibold text-muted-foreground">Mín 24h</th>
                    <th className="text-right p-4 text-sm font-semibold text-muted-foreground">Volumen (24h)</th>
                  </tr>
                </thead>
                <tbody>
                  {cryptos.map((crypto, index) => (
                    <tr key={crypto.id} className="border-b border-primary/10 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 group">
                      <td className="p-4">
                        <Badge className="bg-muted text-muted-foreground border-muted-foreground/20 text-xs px-2 py-1">{index + 1}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[9px]">{crypto.symbol.toUpperCase()}</div>
                          <div>
                            <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{crypto.name}</div>
                            <div className="text-xs text-muted-foreground uppercase font-medium">{crypto.pair}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right" suppressHydrationWarning>
                        {loading ? (
                          <span aria-hidden className="inline-block h-5 w-24 rounded bg-muted animate-pulse" />
                        ) : (
                          <span className="font-mono text-foreground font-semibold inline-block">{formatCurrency(crypto.current_price)}</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Badge className={`${(crypto.price_change_percentage_24h || 0) >= 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'} text-xs px-2 py-1 font-medium`}>
                          {(crypto.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
                          {(crypto.price_change_percentage_24h || 0).toFixed(2)}%
                        </Badge>
                      </td>
                      <td className="p-4 text-right font-mono text-foreground font-medium" suppressHydrationWarning>
                        {loading ? (
                          <span aria-hidden className="inline-block h-5 w-20 rounded bg-muted animate-pulse" />
                        ) : (
                          formatCurrency(crypto.high_24h)
                        )}
                      </td>
                      <td className="p-4 text-right font-mono text-foreground font-medium" suppressHydrationWarning>
                        {loading ? (
                          <span aria-hidden className="inline-block h-5 w-20 rounded bg-muted animate-pulse" />
                        ) : (
                          formatCurrency(crypto.low_24h)
                        )}
                      </td>
                      <td className="p-4 text-right font-mono text-foreground font-medium">{(crypto.volume_24h / 1e6).toFixed(0)}M</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};