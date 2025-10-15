export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export async function fetchTopCryptos(limit: number = 100): Promise<CryptoData[]> {
  try {
    const response = await fetch(
      `/api/crypto/markets?limit=${limit}`,
      {
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch crypto data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
}

export async function fetchCryptoById(id: string): Promise<CryptoData> {
  try {
    const response = await fetch(
      `/api/crypto/markets?ids=${id}&limit=1`,
      {
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch crypto data: ${response.statusText}`);
    }

    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
}

export async function searchCryptos(query: string): Promise<CryptoData[]> {
  try {
    const response = await fetch(
      `/api/crypto/markets?limit=50`,
      {
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search crypto data: ${response.statusText}`);
    }

    const data: CryptoData[] = await response.json();
    
    // Filter results based on query
    return data.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(query.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching crypto data:', error);
    throw error;
  }
}