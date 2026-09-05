"use client";

import {
  Tile,
  Tag,
  Grid,
  Column,
  Breadcrumb,
  BreadcrumbItem,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TextInput,
  Button,
  InlineNotification,
} from "@carbon/react";
import { useCallback, useEffect, useMemo, useState } from "react";

type Holding = {
  ticker: string;
  name: string;
  shares: number;
  avgCost: number;
  lastPrint: number;
};

// Snapshot from the brokerage account, June 17 – Sep 5 2026.
// SPCX: 25 sh @ $163.40 (Jun 30). QQQ: 1 sh @ $728.83 + 0.2 sh @ $728.19 (Jul 1).
// Commissions: $2 total. Cash left: $38.53.
const HOLDINGS: Holding[] = [
  {
    ticker: "SPCX",
    name: "SpaceX",
    shares: 25,
    avgCost: 163.4,
    lastPrint: 147.9,
  },
  {
    ticker: "QQQ",
    name: "Invesco Nasdaq 100 ETF",
    shares: 1.2,
    avgCost: 729.5616667,
    lastPrint: 717.5,
  },
];

const CASH = 38.53;
const COMMISSIONS = 2.0;
const STARTED = "2026-06-17";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const headers = [
  { key: "ticker", header: "Ticker" },
  { key: "shares", header: "Shares" },
  { key: "avgCost", header: "Avg cost" },
  { key: "price", header: "Last price" },
  { key: "value", header: "Value" },
  { key: "pl", header: "P&L" },
  { key: "pct", header: "%" },
];

export default function PortfolioPulsePage() {
  const [prices, setPrices] = useState<Record<string, string>>(
    Object.fromEntries(HOLDINGS.map((h) => [h.ticker, h.lastPrint.toString()]))
  );
  const [asOf, setAsOf] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setFetching(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/prices", { cache: "no-store" });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const json = await res.json();
      const next: Record<string, string> = {};
      let fetchedAt: string | null = null;
      for (const p of json.prices ?? []) {
        if (typeof p.price === "number") {
          next[p.symbol] = p.price.toString();
          if (p.marketTime) fetchedAt = p.marketTime;
        }
      }
      if (Object.keys(next).length === 0) throw new Error("no prices returned");
      setPrices((prev) => ({ ...prev, ...next }));
      setAsOf(fetchedAt ?? json.fetchedAt ?? null);
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "refresh failed");
    } finally {
      setFetching(false);
    }
  }, []);

  // Fetch latest prices once on load.
  useEffect(() => {
    refresh();
  }, [refresh]);

  const rows = useMemo(() => {
    return HOLDINGS.map((h) => {
      const price = parseFloat(prices[h.ticker]) || 0;
      const value = price * h.shares;
      const cost = h.avgCost * h.shares;
      const pl = value - cost;
      const pct = cost > 0 ? (pl / cost) * 100 : 0;
      return {
        id: h.ticker,
        ticker: h.ticker,
        name: h.name,
        shares: h.shares.toString(),
        avgCost: usd(h.avgCost),
        price: usd(price),
        value: usd(value),
        pl: `${pl >= 0 ? "+" : "−"}${usd(Math.abs(pl))}`,
        pct: `${pct >= 0 ? "+" : "−"}${Math.abs(pct).toFixed(1)}%`,
        _pl: pl,
        _value: value,
      };
    });
  }, [prices]);

  const stockValue = rows.reduce((s, r) => s + r._value, 0);
  const stockCost = HOLDINGS.reduce((s, h) => s + h.avgCost * h.shares, 0);
  const totalPL = stockValue - stockCost;
  const totalValue = stockValue + CASH;
  const totalPct = stockCost > 0 ? (totalPL / stockCost) * 100 : 0;

  return (
    <main>
      <Grid narrow style={{ paddingTop: "2rem" }}>
        <Column lg={12} md={6} sm={4}>
          <Breadcrumb noTrailingSlash style={{ marginBottom: "1rem" }}>
            <BreadcrumbItem href="/">Chrysalis</BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>Portfolio Pulse</BreadcrumbItem>
          </Breadcrumb>
          <h1 style={{ fontSize: "2.625rem", fontWeight: 300, margin: "0 0 0.5rem 0" }}>
            Portfolio Pulse
          </h1>
          <Tag type="blue" style={{ marginBottom: "1.5rem" }}>
            snapshot {STARTED} → 2026-09-05
          </Tag>
        </Column>
      </Grid>

      <Grid>
        <Column lg={8} md={6} sm={4}>
          <p style={{ fontSize: "1.25rem", fontWeight: 300, lineHeight: 1.5, marginBottom: "2rem" }}>
            A ~$5k personal account: $4k in SpaceX, $1k in Nasdaq (QQQ).
            Prices are fetched live (Yahoo Finance) on load and via the
            Refresh button; the price fields stay editable if you want to
            re-price manually.
          </p>
        </Column>
      </Grid>

      {fetchError && (
        <Grid style={{ marginBottom: "1rem" }}>
          <Column lg={10} md={6} sm={4}>
            <InlineNotification
              kind="error"
              title="Couldn't fetch live prices"
              subtitle={`${fetchError} — showing the last known prices; use Refresh to retry.`}
              hideCloseButton
              lowContrast
            />
          </Column>
        </Grid>
      )}

      <Grid style={{ marginBottom: "2rem" }}>
          {[
            { label: "Portfolio value", value: usd(totalValue), hint: "incl. cash" },
            { label: "Unrealized P&L", value: `${totalPL >= 0 ? "+" : "−"}${usd(Math.abs(totalPL))}`, hint: `${totalPct >= 0 ? "+" : "−"}${Math.abs(totalPct).toFixed(1)}% on cost` },
            { label: "Cost basis", value: usd(stockCost + COMMISSIONS), hint: "incl. $2 commissions" },
            { label: "Realized P&L", value: "$0.00", hint: "nothing sold yet" },
          ].map((c) => (
            <Column lg={3} md={3} sm={2}>
              <Tile>
              <p style={{ fontSize: "0.75rem", letterSpacing: "0.32px", color: "var(--cds-text-secondary)", margin: 0 }}>
                {c.label}
              </p>
              <p style={{ fontSize: "1.75rem", fontWeight: 300, margin: "0.25rem 0 0.25rem 0" }}>
                {c.value}
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--cds-text-secondary)", margin: 0 }}>
                {c.hint}
              </p>
            </Tile>
          </Column>
        ))}
      </Grid>

      <Grid style={{ marginBottom: "2rem" }}>
        <Column lg={10} md={6} sm={4}>
          <DataTable rows={rows} headers={headers} size="md">
            {({ rows: tableRows, headers: tableHeaders, getTableProps, getHeaderProps, getRowProps, getTableContainerProps }) => (
              <TableContainer
                title="Holdings"
                description={
                  asOf
                    ? `Prices as of ${new Date(asOf).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })} (US market time); edit below to re-price`
                    : "Fetching latest prices…"
                }
              >
                <Table {...getTableProps()} {...getTableContainerProps()}>
                  <TableHead>
                    <TableRow>
                      {tableHeaders.map((h) => (
                        <TableHeader {...getHeaderProps({ header: h })} key={h.key}>
                          {h.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={r.id}>
                        {headers.map((h) => (
                          <TableCell key={h.key}>{r[h.key as keyof typeof r] as string}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DataTable>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile>
            <p style={{ fontWeight: 600, margin: "0 0 1rem 0" }}>Re-price</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {HOLDINGS.map((h) => (
                <TextInput
                  key={h.ticker}
                  id={`price-${h.ticker}`}
                  labelText={`${h.ticker} price`}
                  value={prices[h.ticker]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPrices((p) => ({ ...p, [h.ticker]: e.target.value }))
                  }
                />
              ))}
              <Button
                kind="primary"
                onClick={refresh}
                disabled={fetching}
                style={{ maxWidth: "100%" }}
              >
                {fetching ? "Refreshing…" : "Refresh prices"}
              </Button>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--cds-text-secondary)", marginTop: "1rem" }}>
              Cash on hand: {usd(CASH)}. Commissions paid: {usd(COMMISSIONS)}.
            </p>
          </Tile>
        </Column>
      </Grid>

      <Grid style={{ paddingBottom: "4rem" }}>
        <Column lg={10} md={6} sm={4}>
          <p style={{ fontSize: "0.875rem", color: "var(--cds-text-secondary)" }}>
            Live prices via Yahoo Finance, fetched through this site&apos;s own
            /api/prices route (Yahoo blocks direct browser calls). Market
            days the figures track the latest print; weekends show Friday&apos;s
            close. Personal account, not investment advice.
          </p>
        </Column>
      </Grid>
    </main>
  );
}
