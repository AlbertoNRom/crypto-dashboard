export interface TickerData {
  id: string;
  symbol: string;
  name: string;
  pair: string;
  current_price: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  volume_24h: number;
}

function defaultPairs(): string[] {
  return ['XBTUSD', 'ETHUSD', 'SOLUSD', 'ADAUSD', 'XRPUSD', 'BNBUSD'];
}

function mapIdToKrakenPair(id: string, vs = 'USD'): string | null {
  const base = id.toLowerCase();
  const quote = vs.toUpperCase();
  switch (base) {
    case 'bitcoin':
    case 'btc':
    case 'xbt':
      return `XBT${quote}`;
    case 'ethereum':
    case 'eth':
      return `ETH${quote}`;
    case 'solana':
    case 'sol':
      return `SOL${quote}`;
    case 'cardano':
    case 'ada':
      return `ADA${quote}`;
    case 'xrp':
      return `XRP${quote}`;
    case 'binancecoin':
    case 'bnb':
      return `BNB${quote}`;
    default:
      return null;
  }
}

export async function fetchTopCryptos(pairs?: string[]): Promise<TickerData[]> {
  try {
    const usePairs = (Array.isArray(pairs) && pairs.length > 0 ? pairs : defaultPairs()).join(',');
    const base = typeof window === 'undefined' ? 'http://localhost:3001' : '';
    const response = await fetch(
      `${base}/api/crypto/markets?pairs=${encodeURIComponent(usePairs)}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ticker data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching ticker data:', error);
    throw error;
  }
}

export async function fetchCryptoById(id: string): Promise<TickerData | null> {
  try {
    const pair = mapIdToKrakenPair(id);
    if (!pair) return null;
    const base = typeof window === 'undefined' ? 'http://localhost:3001' : '';
    const response = await fetch(
      `${base}/api/crypto/markets?pairs=${encodeURIComponent(pair)}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ticker data: ${response.statusText}`);
    }

    const data: TickerData[] = await response.json();
    return data[0] ?? null;
  } catch (error) {
    console.error('Error fetching ticker data:', error);
    throw error;
  }
}

export async function searchCryptos(query: string): Promise<TickerData[]> {
  try {
    const data = await fetchTopCryptos();
    const q = query.toLowerCase();
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.symbol.toLowerCase().includes(q) ||
        item.pair.toLowerCase().includes(q)
    );
  } catch (error) {
    console.error('Error searching ticker data:', error);
    throw error;
  }
}