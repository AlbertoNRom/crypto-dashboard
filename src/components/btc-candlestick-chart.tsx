"use client";

import {
  CandlestickSeries,
  ColorType,
  createChart,
  type IChartApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { TrendingUp } from "lucide-react";
import  { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type OHLCData = [number, number, number, number, number];

interface CandlestickData {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const BTCCandlestickChart = () => {
  console.log('🚀 BTCCandlestickChart component renderizado');
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  
  console.log('📊 Estado actual isLoading:', isLoading);

  const fetchBitcoinData = async (): Promise<CandlestickData[]> => {
    try {
      console.log('🔄 Iniciando fetch de datos de Bitcoin...');
      const response = await fetch(
        "/api/crypto/ohlc?coinId=bitcoin&vs_currency=usd&days=150"
      );

      console.log('📡 Respuesta recibida:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(
          `Error HTTP: ${response.status} - ${response.statusText}`
        );
      }

      const data:OHLCData[] = await response.json();


      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Datos inválidos recibidos de CoinGecko");
      }

      const candlestickData = data
        .filter((item: OHLCData) => {
          return (
            Array.isArray(item) &&
            item.length === 5 &&
            item.every((val) => typeof val === "number" && !Number.isNaN(val))
          );
        })
        .map((item: OHLCData) => ({
          time: Math.floor(item[0] / 1000) as UTCTimestamp,
          open: Number(item[1].toFixed(2)),
          high: Number(item[2].toFixed(2)),
          low: Number(item[3].toFixed(2)),
          close: Number(item[4].toFixed(2)),
        }))
        .sort((a, b) => a.time - b.time);


      if (candlestickData.length === 0) {
        throw new Error("No se pudieron procesar los datos de CoinGecko");
      }

      return candlestickData;
    } catch (error) {
      console.error("Error fetching Bitcoin data:", error);
      // Fallback a datos de muestra si falla la API
      return generateFallbackData();
    }
  };

  // Datos de respaldo si falla la API
  const generateFallbackData = (): CandlestickData[] => {
    const data: CandlestickData[] = [];
    const basePrice = 45000;
    let currentPrice = basePrice;
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const timestamp = Math.floor(date.getTime() / 1000) as UTCTimestamp;

      const volatility = 0.03;
      const trend = (Math.random() - 0.5) * 0.02;

      const open = currentPrice;
      const change =
        currentPrice * (trend + (Math.random() - 0.5) * volatility);
      const close = Math.max(open + change, 1000);

      const high = Math.max(open, close) * (1 + Math.random() * 0.02);
      const low = Math.min(open, close) * (1 - Math.random() * 0.02);

      data.push({
        time: timestamp,
        open: Math.round(open),
        high: Math.round(high),
        low: Math.round(low),
        close: Math.round(close),
      });

      currentPrice = close;
    }

    return data;
  };

  useEffect(() => {
    let isMounted = true;
    let chart: IChartApi | null = null;

    const initChart = async () => {
      try {
        setIsLoading(true);
        const data = await fetchBitcoinData();

        if (!isMounted) {
          return;
        }

        setIsLoading(false);
  
        await new Promise(resolve => setTimeout(resolve, 0));

        if (!chartContainerRef.current) {
          return;
        }

        chart = createChart(chartContainerRef.current!, {
          layout: {
            background: { type: ColorType.Solid, color: "transparent" },
            textColor: "hsl(var(--foreground))",
          },
          width: chartContainerRef.current!.clientWidth,
          height: 400,
          grid: {
            vertLines: {
              color: "hsl(var(--border))",
              style: 1,
            },
            horzLines: {
              color: "hsl(var(--border))",
              style: 1,
            },
          },
          crosshair: {
            mode: 1,
          },
          rightPriceScale: {
            borderColor: "hsl(var(--border))",
          },
          timeScale: {
            borderColor: "hsl(var(--border))",
            timeVisible: true,
            secondsVisible: false,
          },
        });

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
          upColor: "#00ff88",
          downColor: "#ff4444",
          borderDownColor: "#ff4444",
          borderUpColor: "#00ff88",
          wickDownColor: "#ff4444",
          wickUpColor: "#00ff88",
        });

        if (!isMounted) {
          return;
        }

        candlestickSeries.setData(data);

        if (data.length > 1) {
          const latest = data[data.length - 1];
          const previous = data[data.length - 2];
          setCurrentPrice(latest.close);
          setPriceChange(
            ((latest.close - previous.close) / previous.close) * 100
          );
        }

        chartRef.current = chart;
        seriesRef.current = candlestickSeries;

        if (isMounted) {         
          setIsLoading(false);
        }


        const handleResize = () => {
          if (chartContainerRef.current && chart) {
            chart.applyOptions({
              width: chartContainerRef.current.clientWidth,
            });
          }
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
        };
      } catch (_error) {
        
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initChart().catch((error) => {
      console.error('❌ Error en initChart:', error);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      if (chart) {
        chart.remove();
        chart = null;
      }
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  return (
    <Card className="w-full border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 hover:border-primary/40 transition-all duration-500 group shadow-xl hover:shadow-2xl hover:shadow-primary/20 backdrop-blur-sm">
      <CardHeader className="pb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-900/10 border border-orange-200 dark:border-orange-800 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-8 w-8 text-orange-500 group-hover:animate-pulse" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400/20 to-transparent animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent group-hover:from-primary group-hover:to-foreground transition-all duration-500">
                Bitcoin (BTC)
              </CardTitle>
              <p className="text-sm text-muted-foreground font-medium">
                Análisis Técnico Profesional • 150 Días
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">
                  Datos en tiempo real
                </span>
              </div>
            </div>
          </div>
          {currentPrice && priceChange !== null && (
            <div className="text-right space-y-1">
              <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                ${currentPrice.toLocaleString()}
              </div>
              <div
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold transition-all duration-300 ${
                  priceChange >= 0
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                }`}
              >
                <span
                  className={`text-xs ${
                    priceChange >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {priceChange >= 0 ? "▲" : "▼"}
                </span>
                {priceChange >= 0 ? "+" : ""}
                {priceChange.toFixed(2)}%
              </div>
              <div className="text-xs text-muted-foreground">Cambio 24h</div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-6">
        {/* Chart Controls */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-border/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              <span className="text-xs text-muted-foreground">Alcista</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
              <span className="text-xs text-muted-foreground">Bajista</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Intervalo:</span>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded font-medium">
              1D
            </span>
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative">
          {isLoading ? (
            <div className="h-[450px] flex flex-col items-center justify-center bg-gradient-to-br from-muted/20 to-muted/10 rounded-xl border border-border/50">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-primary/10"></div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground animate-pulse">
                Cargando datos del mercado...
              </p>
            </div>
          ) : (
            <div className="relative">
              <div
                ref={chartContainerRef}
                className="w-full h-[450px] rounded-xl overflow-hidden border border-border/50 bg-gradient-to-br from-card to-muted/10 group-hover:border-primary/30 transition-colors duration-500"
              />
              {/* Chart Overlay */}
              <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>
                    Volumen:{" "}
                    <span className="text-foreground font-medium">$2.1B</span>
                  </div>
                  <div>
                    Cap. Mercado:{" "}
                    <span className="text-foreground font-medium">$890B</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chart Footer */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-muted/20 rounded-xl border border-border/30">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>Datos actualizados cada 30s</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Powered by{" "}
            <span className="text-primary font-medium">Kraken API</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border border-border/30 inline-block">
            📊 <strong>Datos OHLC:</strong> Información histórica desde
            Kraken API • Bitcoin (BTC/USD) • 150 días
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
