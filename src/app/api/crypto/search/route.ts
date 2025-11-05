import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface CoinItem {
  id: string;
  symbol: string;
  name: string;
}

interface SearchResultItem {
  id: string;
  symbol: string;
  name: string;
  pair?: string;
}

let cache: { coins: CoinItem[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

function mapIdToKrakenPair(id: string, quote: "USD" | "EUR" = "USD"): string | undefined {
  const q = quote === "USD" ? "USD" : "EUR";
  const map: Record<string, string> = {
    // Majors
    "bitcoin": q === "USD" ? "XBTUSD" : "XBTEUR",
    "ethereum": `ETH${q}`,
    "tether": `USDT${q}`,
    "ripple": `XRP${q}`,
    "cardano": `ADA${q}`,
    "solana": `SOL${q}`,
    "polkadot": `DOT${q}`,
    "litecoin": `LTC${q}`,
    "tron": `TRX${q}`,
    "dogecoin": `DOGE${q}`,
    "chainlink": `LINK${q}`,
    "binancecoin": `BNB${q}`,
    // Popular L1/L2 & tokens
    "matic-network": `MATIC${q}`,
    "shiba-inu": `SHIB${q}`,
    "internet-computer": `ICP${q}`,
    "uniswap": `UNI${q}`,
    "aave": `AAVE${q}`,
    "algorand": `ALGO${q}`,
    "stellar": `XLM${q}`,
    "monero": `XMR${q}`,
    "cosmos": `ATOM${q}`,
    "filecoin": `FIL${q}`,
    "eos": `EOS${q}`,
    "near": `NEAR${q}`,
    "aptos": `APT${q}`,
    "avalanche": `AVAX${q}`,
    "curve-dao-token": `CRV${q}`,
    "compound-governance-token": `COMP${q}`,
    "maker": `MKR${q}`,
    "synthetix-network-token": `SNX${q}`,
    "optimism": `OP${q}`,
    "arbitrum": `ARB${q}`,
    "pepe": `PEPE${q}`,
    "kaspa": `KAS${q}`,
    "celestia": `TIA${q}`,
    "render-token": `RNDR${q}`,
    "immutable-x": `IMX${q}`,
    "bonk": `BONK${q}`,
    "sui": `SUI${q}`,
    "mantle": `MNT${q}`,
    "hedera-hashgraph": `HBAR${q}`,
    "bitcoin-cash": `BCH${q}`,
    "ethereum-classic": `ETC${q}`,
    "lido-dao": `LDO${q}`,
    "injective": `INJ${q}`,
    "floki": `FLOKI${q}`,
    "the-sandbox": `SAND${q}`,
    "decentraland": `MANA${q}`,
    "loopring": `LRC${q}`,
    "arweave": `AR${q}`,
    "mina-protocol": `MINA${q}`,
    "gala": `GALA${q}`,
    "apecoin": `APE${q}`,
    "1inch": `1INCH${q}`,
  };
  return map[id];
}

async function getCoinsList(): Promise<CoinItem[]> {
  const now = Date.now();
  if (cache && now - cache.timestamp < CACHE_TTL_MS) {
    return cache.coins;
  }
  const res = await fetch("https://api.coingecko.com/api/v3/coins/list?include_platform=false", {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    return [];
  }
  const coins = (await res.json()) as CoinItem[];
  cache = { coins, timestamp: now };
  return coins;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    if (!q) {
      return NextResponse.json([], { status: 200 });
    }
    const qLower = q.toLowerCase();
    const coins = await getCoinsList();
    const filtered = coins
      .filter(
        (c) =>
          c.name.toLowerCase().includes(qLower) ||
          c.symbol.toLowerCase().includes(qLower) ||
          c.id.toLowerCase().includes(qLower),
      )
      .slice(0, 100);

    const results: SearchResultItem[] = filtered.map((c) => ({
      id: c.id,
      symbol: c.symbol,
      name: c.name,
      pair: mapIdToKrakenPair(c.id, "USD"),
    }));

    return NextResponse.json(results, { status: 200 });
  } catch (_error) {
    return NextResponse.json({ error: "failed_to_search" }, { status: 500 });
  }
}