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

export interface SearchResult {
  id: string;
  symbol: string;
  name: string;
  pair?: string;
}

function defaultPairs(): string[] {
  return ['XBTUSD', 'ETHUSD', 'SOLUSD', 'ADAUSD', 'XRPUSD', 'BNBUSD'];
}

export function mapIdToKrakenPair(id: string, vs = 'USD'): string | null {
  const base = id.toLowerCase();
  const q = vs.toUpperCase();
  switch (base) {
    // Majors
    case 'bitcoin':
    case 'btc':
    case 'xbt':
      return `XBT${q}`;
    case 'ethereum':
    case 'eth':
      return `ETH${q}`;
    case 'tether':
    case 'usdt':
      return `USDT${q}`;
    case 'ripple':
    case 'xrp':
      return `XRP${q}`;
    case 'cardano':
    case 'ada':
      return `ADA${q}`;
    case 'solana':
    case 'sol':
      return `SOL${q}`;
    case 'polkadot':
    case 'dot':
      return `DOT${q}`;
    case 'litecoin':
    case 'ltc':
      return `LTC${q}`;
    case 'tron':
    case 'trx':
      return `TRX${q}`;
    case 'dogecoin':
    case 'doge':
      return `DOGE${q}`;
    case 'chainlink':
    case 'link':
      return `LINK${q}`;
    case 'binancecoin':
    case 'bnb':
      return `BNB${q}`;
    // Popular L1/L2 & tokens
    case 'matic-network':
    case 'matic':
      return `MATIC${q}`;
    case 'shiba-inu':
    case 'shib':
      return `SHIB${q}`;
    case 'internet-computer':
    case 'icp':
      return `ICP${q}`;
    case 'uniswap':
    case 'uni':
      return `UNI${q}`;
    case 'aave':
      return `AAVE${q}`;
    case 'algorand':
    case 'algo':
      return `ALGO${q}`;
    case 'stellar':
    case 'xlm':
      return `XLM${q}`;
    case 'monero':
    case 'xmr':
      return `XMR${q}`;
    case 'cosmos':
    case 'atom':
      return `ATOM${q}`;
    case 'filecoin':
    case 'fil':
      return `FIL${q}`;
    case 'eos':
      return `EOS${q}`;
    case 'near':
    case 'near-protocol':
      return `NEAR${q}`;
    case 'aptos':
    case 'apt':
      return `APT${q}`;
    case 'avalanche':
    case 'avax':
      return `AVAX${q}`;
    case 'curve-dao-token':
    case 'crv':
      return `CRV${q}`;
    case 'compound-governance-token':
    case 'comp':
      return `COMP${q}`;
    case 'maker':
    case 'mkr':
      return `MKR${q}`;
    case 'synthetix-network-token':
    case 'snx':
      return `SNX${q}`;
    case 'optimism':
    case 'op':
      return `OP${q}`;
    case 'arbitrum':
    case 'arb':
      return `ARB${q}`;
    case 'pepe':
      return `PEPE${q}`;
    case 'kaspa':
    case 'kas':
      return `KAS${q}`;
    case 'celestia':
    case 'tia':
      return `TIA${q}`;
    case 'render-token':
    case 'rndr':
      return `RNDR${q}`;
    case 'immutable-x':
    case 'imx':
      return `IMX${q}`;
    case 'bonk':
      return `BONK${q}`;
    case 'sui':
      return `SUI${q}`;
    case 'mantle':
    case 'mnt':
      return `MNT${q}`;
    case 'hedera-hashgraph':
    case 'hbar':
      return `HBAR${q}`;
    case 'bitcoin-cash':
    case 'bch':
      return `BCH${q}`;
    case 'ethereum-classic':
    case 'etc':
      return `ETC${q}`;
    case 'lido-dao':
    case 'ldo':
      return `LDO${q}`;
    case 'injective':
    case 'inj':
      return `INJ${q}`;
    case 'floki':
      return `FLOKI${q}`;
    case 'the-sandbox':
    case 'sand':
      return `SAND${q}`;
    case 'decentraland':
    case 'mana':
      return `MANA${q}`;
    case 'loopring':
    case 'lrc':
      return `LRC${q}`;
    case 'arweave':
    case 'ar':
      return `AR${q}`;
    case 'mina-protocol':
    case 'mina':
      return `MINA${q}`;
    case 'gala':
      return `GALA${q}`;
    case 'apecoin':
    case 'ape':
      return `APE${q}`;
    case '1inch':
      return `1INCH${q}`;
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

export async function searchCryptos(query: string): Promise<SearchResult[]> {
  try {
    const q = query.trim();
    if (!q) return [];
    const base = typeof window === 'undefined' ? 'http://localhost:3001' : '';
    const res = await fetch(
      `${base}/api/crypto/search?q=${encodeURIComponent(q)}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as SearchResult[];
    return data;
  } catch (error) {
    console.error('Error searching cryptos:', error);
    throw error;
  }
}