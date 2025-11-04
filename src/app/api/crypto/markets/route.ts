import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
export const revalidate = 60;

const KRAKEN_TICKER_API = 'https://api.kraken.com/0/public/Ticker';
// Backoff y mini cache en memoria para reducir rate limits
const CACHE_TTL_MS = 60_000; // 60s
const memoryCache = new Map<string, { ts: number; data: any }>();

async function fetchWithRetry(url: string, init: RequestInit, maxRetries = 2): Promise<Response> {
  let attempt = 0;
  let lastError: unknown;
  while (attempt <= maxRetries) {
    if (attempt > 0) {
      const delayMs = Math.min(500 * attempt * attempt, 3000); // 0.5s, 2s, máx 3s
      await new Promise((r) => setTimeout(r, delayMs));
    }
    const res = await fetch(url, init);
    if (res.ok) return res;
    const status = res.status;
    const retryAfter = res.headers.get('Retry-After');
    const body = await res.text().catch(() => '');
    console.warn(`[Kraken][Ticker] intento ${attempt + 1}/${maxRetries + 1} status=${status} ${res.statusText} ${retryAfter ? `retry-after=${retryAfter}` : ''} body=${body?.slice(0, 200)}`);
    if (status === 429 || (status >= 500 && status < 600)) {
      lastError = new Error(`status ${status}: ${body}`);
      attempt++;
      continue;
    }
    return res;
  }
  throw lastError ?? new Error('Kraken Ticker request failed after retries');
}

function mapMetaForPair(pair: string) {
  const p = pair.toUpperCase();
  if (p.startsWith('XBT')) return { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' };
  if (p.startsWith('ETH')) return { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' };
  if (p.startsWith('SOL')) return { id: 'solana', symbol: 'SOL', name: 'Solana' };
  if (p.startsWith('ADA')) return { id: 'cardano', symbol: 'ADA', name: 'Cardano' };
  if (p.startsWith('XRP')) return { id: 'xrp', symbol: 'XRP', name: 'XRP' };
  if (p.startsWith('BNB')) return { id: 'bnb', symbol: 'BNB', name: 'BNB' };
  return { id: p.toLowerCase(), symbol: p.slice(0, 3), name: p.slice(0, 3) };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // Usamos Kraken Ticker con lista de pares (por defecto top USD)
    const pairsParam = searchParams.get('pairs');
    const defaultPairs = ['XBTUSD', 'ETHUSD', 'SOLUSD', 'ADAUSD', 'XRPUSD', 'BNBUSD'];
    const pairs = pairsParam ? pairsParam.split(',').map(p => p.trim().toUpperCase()) : defaultPairs;
    const qs = new URLSearchParams({ pair: pairs.join(',') });
    const url = `${KRAKEN_TICKER_API}?${qs.toString()}`;

    console.log(`[Kraken] URL markets ticker: ${url}`);

    const cached = memoryCache.get(url);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      console.log('[Kraken][Ticker] cache hit (mem)');
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      });
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'CryptoDash/1.0'
    };

    const response = await fetchWithRetry(url, {
      headers,
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Kraken API error: ${response.status} ${response.statusText}${errText ? ` - ${errText}` : ''}`);
    }

    const json = await response.json();
    if (json.error && Array.isArray(json.error) && json.error.length > 0) {
      throw new Error(`Kraken API error: ${json.error.join(', ')}`);
    }

    const result = json.result || {};

    function findTickerForPair(res: Record<string, any>, pair: string) {
      const p = pair.toUpperCase();
      const quote = p.slice(-3); // USD/EUR/GBP/USDT
      const base = p.slice(0, p.length - 3);
      // Direct key match
      if (res[p]) return res[p];
      // Kraken suele usar prefijos/sufijos (e.g. XXBTZUSD). Buscamos por inclusión de base y terminación del quote
      const key = Object.keys(res).find((k) => {
        const u = k.toUpperCase();
        return u.includes(base) && u.endsWith(quote);
      });
      return key ? res[key] : undefined;
    }

    const out = pairs.map((pair) => {
      const t = findTickerForPair(result, pair);
      const meta = mapMetaForPair(pair);
      const last = t ? Number(t.c?.[0] ?? t.c) : NaN;
      const open = t ? Number(t.o) : NaN;
      const high = t ? Number(t.h?.[1] ?? t.h) : NaN; // [today, last 24h]
      const low = t ? Number(t.l?.[1] ?? t.l) : NaN;
      const vol = t ? Number(t.v?.[1] ?? t.v) : NaN;
      const pct = !Number.isNaN(last) && !Number.isNaN(open) && open > 0 ? ((last - open) / open) * 100 : 0;
      return {
        id: meta.id,
        symbol: meta.symbol,
        name: meta.name,
        pair,
        current_price: last,
        price_change_percentage_24h: pct,
        high_24h: high,
        low_24h: low,
        volume_24h: vol
      };
    });

    memoryCache.set(url, { ts: Date.now(), data: out });
    
    return NextResponse.json(out, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crypto data' },
      { status: 500 }
    );
  }
}