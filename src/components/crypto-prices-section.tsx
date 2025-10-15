'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { fetchTopCryptos } from '@/lib/crypto-api';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

export const CryptoPricesSection = () => {
  const [topCryptos, setTopCryptos] = useState<CryptoData[]>([]);
  const [priceChanges, setPriceChanges] = useState<{[key: string]: 'up' | 'down' | null}>({});

  useEffect(() => {
    const loadCryptos = async () => {
      try {
        const cryptos = await fetchTopCryptos(6);
        
        // Detectar cambios de precio para animaciones usando el estado anterior
        setTopCryptos(prevCryptos => {
          if (prevCryptos.length > 0) {
            const changes: {[key: string]: 'up' | 'down' | null} = {};
            cryptos.forEach((newCrypto) => {
              const oldCrypto = prevCryptos.find(c => c.id === newCrypto.id);
              if (oldCrypto && oldCrypto.current_price !== newCrypto.current_price) {
                changes[newCrypto.id] = newCrypto.current_price > oldCrypto.current_price ? 'up' : 'down';
              }
            });
            setPriceChanges(changes);
            
            // Limpiar animaciones después de 2 segundos
            setTimeout(() => setPriceChanges({}), 2000);
          }
          
          return cryptos;
        });
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };

    // Cargar datos inicialmente
    loadCryptos();

    // Actualizar cada 30 segundos para precios en tiempo real
    const interval = setInterval(loadCryptos, 30000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []); // Eliminar la dependencia de topCryptos para evitar el bucle infinito

  if (topCryptos.length === 0) {
    return null;
  }

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Precios en Tiempo Real
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Mantente actualizado con los precios de las principales
            criptomonedas
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topCryptos.map((crypto) => (
            <Card
              key={crypto.id}
              className={`hover-cyan transition-all duration-500 group border ${
                priceChanges[crypto.id] === 'up' 
                  ? 'animate-pulse bg-green-50 dark:bg-green-900/20 border-green-400 shadow-green-400/50 shadow-lg' 
                  : priceChanges[crypto.id] === 'down'
                  ? 'animate-pulse bg-red-50 dark:bg-red-900/20 border-red-400 shadow-red-400/50 shadow-lg'
                  : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-3">
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors duration-300">
                      {crypto.name}
                    </h3>
                    <p className="text-xs text-muted-foreground uppercase">
                      {crypto.symbol}
                    </p>
                  </div>
                  <div className={`text-lg font-bold group-hover:text-primary transition-all duration-500 ${
                     priceChanges[crypto.id] === 'up'
                       ? 'text-green-600 dark:text-green-400 scale-110'
                       : priceChanges[crypto.id] === 'down'
                       ? 'text-red-600 dark:text-red-400 scale-110'
                       : 'text-foreground'
                   }`}>
                     ${crypto.current_price.toLocaleString()}
                   </div>
                  <Badge
                    className={`font-bold shadow-lg transition-all duration-500 ${
                      crypto.price_change_percentage_24h >= 0
                        ? `bg-green-500 text-white ${
                            priceChanges[crypto.id] === 'up' ? 'animate-bounce bg-green-400 shadow-green-400/70' : ''
                          }`
                        : `bg-red-500 text-white ${
                            priceChanges[crypto.id] === 'down' ? 'animate-bounce bg-red-400 shadow-red-400/70' : ''
                          }`
                    }`}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};