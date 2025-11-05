"use client";

import { Plus, Search, TrendingUp, Pencil, Trash2, Check, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
  import {
    fetchTopCryptos,
    searchCryptos,
    type TickerData,
    type SearchResult,
    mapIdToKrakenPair,
  } from "@/lib/crypto-api";

interface HoldingRow {
  id: string;
  portfolioId: string;
  cryptoId: string;
  amount: string; // Drizzle decimal comes as string
}

interface PortfolioClientProps {
  initialHoldings: HoldingRow[];
}

export const PortfolioClient = ({ initialHoldings }: PortfolioClientProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [holdings, setHoldings] = useState<HoldingRow[]>(initialHoldings ?? []);
  const [market, setMarket] = useState<TickerData[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAmount, setEditingAmount] = useState<string>("");

  // Fetch top market data (used to enrich holdings list)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const pairsSet = new Set<string>();
        for (const h of holdings) {
          const p = mapIdToKrakenPair(h.cryptoId, 'USD');
          if (p) pairsSet.add(p);
        }
        const pairs = Array.from(pairsSet);
        const data = pairs.length > 0 ? await fetchTopCryptos(pairs) : await fetchTopCryptos();
        if (active) setMarket(data);
      } catch (_error) {
        // ignore errors, still show holdings
      }
    })();
    return () => {
      active = false;
    };
  }, [holdings]);

  const marketBySymbol = useMemo(() => {
    const map = new Map<string, TickerData>();
    for (const m of market) {
      map.set(m.symbol.toUpperCase(), m);
    }
    return map;
  }, [market]);

  const onSearch = async (q: string) => {
    setQuery(q);
    if (!q) {
      setResults([]);
      setSelected(null);
      return;
    }
    setLoadingSearch(true);
    try {
      const data = await searchCryptos(q);
      setResults(data.slice(0, 30));
    } catch (_error) {
      setResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const onSelect = (item: SearchResult) => {
    setSelected(item);
    setQuery(`${item.name} (${item.symbol})`);
  };

  const summary = useMemo(() => {
    let valueNow = 0;
    let valuePrev = 0;
    for (const h of holdings.slice(0, 30)) {
      const amt = Number(h.amount ?? "0");
      if (!Number.isFinite(amt) || amt <= 0) continue;
      const sym = h.cryptoId.toUpperCase();
      const m =
        marketBySymbol.get(sym) ||
        market.find((mm) => mm.name.toLowerCase() === h.cryptoId.toLowerCase()) ||
        null;
      if (!m || typeof m.current_price !== "number") continue;
      valueNow += amt * m.current_price;
      if (typeof m.price_change_percentage_24h === "number") {
        const pct = m.price_change_percentage_24h;
        const prevPrice = m.current_price / (1 + pct / 100);
        valuePrev += amt * prevPrice;
      } else {
        // Fallback si no hay porcentaje disponible
        valuePrev += amt * m.current_price;
      }
    }
    const diff = valueNow - valuePrev;
    return { valueNow, diff };
  }, [holdings, marketBySymbol, market]);

  const onAdd = async () => {
    setError(null);
    if (!selected) {
      setError("Selecciona una moneda");
      return;
    }
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      setError("Introduce una cantidad válida");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/portfolio/holdings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cryptoId: selected.id, amount: amt }),
      });
      if (!res.ok) throw new Error("No se pudo guardar");
      const data = await res.json();
      const rows: HoldingRow[] = data.holdings ?? [];
      setHoldings(rows.slice(0, 30));
      setAmount("");
      // mantener seleccionada para añadir más si quiere
    } catch (e: any) {
      setError(e?.message ?? "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const onEditStart = (row: HoldingRow) => {
    setEditingId(row.cryptoId);
    setEditingAmount(row.amount ?? "");
  };

  const onEditCancel = () => {
    setEditingId(null);
    setEditingAmount("");
  };

  const onEditSave = async () => {
    if (!editingId) return;
    const amt = Number(editingAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      setError("Introduce una cantidad válida");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/portfolio/holdings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cryptoId: editingId, amount: amt }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar");
      const data = await res.json();
      const rows: HoldingRow[] = data.holdings ?? [];
      setHoldings(rows.slice(0, 30));
      setEditingId(null);
      setEditingAmount("");
    } catch (e: any) {
      setError(e?.message ?? "Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (cryptoId: string) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/portfolio/holdings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cryptoId }),
      });
      if (!res.ok) throw new Error("No se pudo eliminar");
      const data = await res.json();
      const rows: HoldingRow[] = data.holdings ?? [];
      setHoldings(rows.slice(0, 30));
    } catch (e: any) {
      setError(e?.message ?? "Error al eliminar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Summary */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Resumen de tu portafolio</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="text-xs text-muted-foreground">Valor estimado</div>
                <div className="mt-1 text-2xl font-bold text-foreground" suppressHydrationWarning>
                  ${summary.valueNow.toLocaleString()}
                </div>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="text-xs text-muted-foreground">Variación vs día anterior</div>
                <div
                  className={`mt-1 text-2xl font-bold ${summary.diff >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  suppressHydrationWarning
                >
                  {summary.diff >= 0 ? "+" : "-"}${Math.abs(summary.diff).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Search / Add */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">
                Añade activos a tu portafolio
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
              <div className="flex-1">
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-muted-foreground mb-2"
                >
                  Buscar moneda
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Bitcoin, ETH, SOL…"
                    value={query}
                    onChange={(e) => onSearch(e.target.value)}
                    className="pl-9"
                    aria-autocomplete="list"
                    aria-controls="search-results"
                  />
                </div>
                {query && (
                  <div
                    id="search-results"
                    className="mt-2 border rounded-md bg-popover"
                  >
                    {loadingSearch ? (
                      <div className="p-3 text-sm text-muted-foreground">
                        Buscando…
                      </div>
                    ) : results.length === 0 ? (
                      <div className="p-3 text-sm text-muted-foreground">
                        Sin resultados
                      </div>
                    ) : (
                      <ul>
                        {results.map((r) => (
                          <li key={r.id}>
                            <button
                              type="button"
                              className="w-full text-left px-3 py-2 hover:bg-muted flex items-center justify-between"
                              onClick={() => onSelect(r)}
                            >
                              <span className="font-medium text-foreground">
                                {r.name} ({r.symbol})
                              </span>
                              <Badge className="bg-primary/10 text-primary border-primary/20">
                                {r.pair}
                              </Badge>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              <div className="sm:w-48">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-muted-foreground mb-2"
                >
                  Cantidad
                </label>
                <Input
                  id="amount"
                  placeholder="0.00"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="sm:w-40">
                <Button
                  onClick={onAdd}
                  disabled={saving}
                  className="w-full font-semibold border border-primary/30"
                >
                  <Plus className="h-4 w-4 mr-2" /> Añadir
                </Button>
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        {/* Holdings List */}
        <Card>
          <CardHeader className="border-b border-primary/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-foreground">
                Tu Portafolio
              </CardTitle>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                {Math.min(30, holdings.length)} filas
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-muted/50 to-primary/5 border-b border-primary/10">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      #
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Moneda
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Par
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-muted-foreground">
                      Precio
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-muted-foreground">
                      Cambio 24h
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-muted-foreground">
                      Cantidad
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-muted-foreground">
                      Total
                    </th>
                    <th className="text-right p-4 text-sm font-semibold text-muted-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.slice(0, 30).map((h, idx) => {
                    // intento de mapear símbolo por id conocidos; si no, mostrar id
                    // fetchTopCryptos usa symbols (XBT, ETH, etc.)
                    const sym = h.cryptoId.toUpperCase();
                    const pairForId = mapIdToKrakenPair(h.cryptoId, 'USD');
                    const baseSym = pairForId
                      ? pairForId.replace(/USD|EUR/i, '')
                      : sym;
                    const m =
                      marketBySymbol.get(baseSym.toUpperCase()) ||
                      marketBySymbol.get(sym) ||
                      market.find(
                        (mm) =>
                          mm.name.toLowerCase() === h.cryptoId.toLowerCase()
                      ) ||
                      null;
                    const marketSymbol = m?.symbol ? m.symbol.toUpperCase() : undefined;
                    const displaySymbol = marketSymbol === "XBT" ? "BTC" : (marketSymbol ?? sym);
                    const iconSymbol = marketSymbol
                      ? marketSymbol === "XBT"
                        ? "btc"
                        : marketSymbol.toLowerCase()
                      : null;
                    const displayName = m?.name ?? h.cryptoId;
                    return (
                      <tr
                        key={`${h.cryptoId}-${idx}`}
                        className="border-b border-muted/30 hover:bg-muted/30"
                      >
                        <td className="p-4 text-sm text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                              {iconSymbol ? (
                                <Image
                                  src={`https://assets.coincap.io/assets/icons/${iconSymbol}@2x.png`}
                                  alt={`${displayName} logo`}
                                  width={32}
                                  height={32}
                                  className="object-contain"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-primary text-[10px] font-bold">
                                  {sym.slice(0, 3)}
                                </div>
                              )}
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-foreground">
                                {displayName}
                              </div>
                              <div className="text-xs text-muted-foreground uppercase font-medium">
                                {displaySymbol}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            {m?.pair ?? "—"}
                          </Badge>
                        </td>
                        <td
                          className="p-4 text-right font-mono text-foreground"
                          suppressHydrationWarning
                        >
                          {m && typeof m.current_price === "number"
                            ? `$${m.current_price.toLocaleString(undefined, { maximumFractionDigits: 5 })}`
                            : "—"}
                        </td>
                        <td className="p-4 text-right">
                          {m ? (
                            <Badge
                              className={`${(m.price_change_percentage_24h || 0) >= 0 ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"} px-2 py-1`}
                            >
                              {(m.price_change_percentage_24h || 0) >= 0
                                ? "+"
                                : ""}
                              {(m.price_change_percentage_24h || 0).toFixed(2)}%
                            </Badge>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="p-4 text-right font-mono text-muted-foreground">
                          {editingId === h.cryptoId ? (
                            <div className="flex items-center gap-2 justify-end">
                              <Input
                                value={editingAmount}
                                onChange={(e) => setEditingAmount(e.target.value)}
                                inputMode="decimal"
                                className="w-28 h-8"
                                aria-label={`Editar cantidad de ${h.cryptoId}`}
                              />
                              <Button variant="secondary" size="sm" onClick={onEditSave} disabled={saving} className="h-8 px-2">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={onEditCancel} className="h-8 px-2">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            (!Number.isNaN(Number(h.amount))
                              ? Number(h.amount).toLocaleString(undefined, { maximumFractionDigits: 5 })
                              : h.amount)
                          )}
                        </td>
                        <td className="p-4 text-right font-mono text-foreground" suppressHydrationWarning>
                          {m && typeof m.current_price === "number"
                            ? `$${(Number(h.amount || '0') * m.current_price).toLocaleString(undefined, { maximumFractionDigits: 5 })}`
                            : "—"}
                        </td>
                        <td className="p-4 text-right">
                          {editingId === h.cryptoId ? null : (
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="secondary" size="sm" onClick={() => onEditStart(h)} className="h-8 px-2">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => onDelete(h.cryptoId)} className="h-8 px-2">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
