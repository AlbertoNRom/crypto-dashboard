import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
export const revalidate = 60;
export const dynamic = 'force-dynamic';

const KRAKEN_API_BASE = 'https://api.kraken.com/0/public/OHLC';
// Backoff y mini cache en memoria para reducir rate limits y mejorar rendimiento
const CACHE_TTL_MS = 60_000; // 60s unificado con markets
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
    console.warn(`[Kraken][OHLC] intento ${attempt + 1}/${maxRetries + 1} status=${status} ${res.statusText} ${retryAfter ? `retry-after=${retryAfter}` : ''} body=${body?.slice(0, 200)}`);
    if (status === 429 || (status >= 500 && status < 600)) {
      // Reintentar en 429 (rate limit) y 5xx
      lastError = new Error(`status ${status}: ${body}`);
      attempt++;
      continue;
    }
    // Errores 4xx distintos de 429 no son reintento
    return res;
  }
  throw lastError ?? new Error('Kraken OHLC request failed after retries');
}

function mapCoinIdToKrakenBase(coinId: string): string {
  const id = coinId.toLowerCase();
  if (id === 'bitcoin' || id === 'btc') return 'XBT';
  if (id === 'ethereum' || id === 'eth') return 'ETH';
  return coinId.toUpperCase();
}

function mapVsCurrencyToKrakenQuote(vs: string): string {
  const v = vs.toLowerCase();
  if (v === 'usd' || v === 'us-dollar') return 'USD';
  if (v === 'eur') return 'EUR';
  if (v === 'gbp') return 'GBP';
  if (v === 'usdt') return 'USDT';
  return vs.toUpperCase();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    // Compatibilidad: aceptamos coinId/vs_currency/days y también pair/interval/since
    const coinId = searchParams.get('coinId');
    const vsCurrency = searchParams.get('vs_currency');
    const days = searchParams.get('days');
    const pairParam = searchParams.get('pair');
    const intervalParam = searchParams.get('interval');
    const sinceParam = searchParams.get('since');

    const base = mapCoinIdToKrakenBase(coinId ?? 'bitcoin');
    const quote = mapVsCurrencyToKrakenQuote(vsCurrency ?? 'usd');
    const pair = pairParam ?? `${base}${quote}`;
    // Si se proporcionan días, usamos velas diarias (1440 min)
    const interval = intervalParam ? Number(intervalParam) || 1440 : (days ? 1440 : 60);
    const sinceSec = sinceParam ? Number(sinceParam) : (days ? Math.floor((Date.now() - Number(days) * 24 * 60 * 60 * 1000) / 1000) : undefined);

    const qs = new URLSearchParams({ pair, interval: String(interval) });
    if (sinceSec && Number.isFinite(sinceSec) && sinceSec > 0) {
      qs.set('since', String(sinceSec));
    }
    const url = `${KRAKEN_API_BASE}?${qs.toString()}`;

    console.log(`[Kraken] URL ohlc: ${url}`);

    const cached = memoryCache.get(url);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      console.log('[CoinGecko][OHLC] cache hit (mem)');
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
      next: { revalidate: 60 } // Cache ISR unificado a 60s
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Kraken API error: ${response.status} ${response.statusText}${errText ? ` - ${errText}` : ''}`);
    }

    const json = await response.json();
    if (json.error && Array.isArray(json.error) && json.error.length > 0) {
      throw new Error(`Kraken API error: ${json.error.join(', ')}`);
    }

    const resultObj = json.result ?? {};
    // La clave del par puede diferir en mayúsculas, coge la primera lista
    const pairKey = Object.keys(resultObj).find((k) => Array.isArray(resultObj[k])) || pair;
    const entries: any[] = resultObj[pairKey] ?? [];

    // Transformar al formato esperado por el cliente: [ms, open, high, low, close]
    const transformed = entries.map((row: any[]) => {
      const tSec = Number(row[0]);
      const open = Number(row[1]);
      const high = Number(row[2]);
      const low = Number(row[3]);
      const close = Number(row[4]);
      return [tSec * 1000, open, high, low, close];
    });

    // Si se especificó days y usamos interval diario, recorta a los últimos N
    const data = days && interval === 1440
      ? transformed.slice(-Number(days))
      : transformed;

    memoryCache.set(url, { ts: Date.now(), data });
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Error fetching OHLC data (Kraken):', error);
    return NextResponse.json(
      { error: 'Failed to fetch OHLC data' },
      { status: 500 }
    );
  }
}