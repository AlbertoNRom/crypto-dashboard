import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coinId = searchParams.get('coinId') || 'bitcoin';
    const days = searchParams.get('days') || '30';
    const vsCurrency = searchParams.get('vs_currency') || 'usd';
    
    const url = `${COINGECKO_API_BASE}/coins/${coinId}/ohlc?vs_currency=${vsCurrency}&days=${days}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CryptoDash/1.0'
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error fetching OHLC data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OHLC data' },
      { status: 500 }
    );
  }
}