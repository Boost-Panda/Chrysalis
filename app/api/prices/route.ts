import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SYMBOLS = ["SPCX", "QQQ"] as const;

type PriceResult = {
  symbol: string;
  price: number | null;
  marketTime: string | null;
  error?: string;
};

// Proxy Yahoo's free chart endpoint: the browser can't call Yahoo directly
// (no CORS headers), so this route fetches server-side per request.
export async function GET() {
  const results = await Promise.all(
    SYMBOLS.map(async (symbol): Promise<PriceResult> => {
      try {
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
          { headers: { "User-Agent": "Mozilla/5.0" }, cache: "no-store" }
        );
        if (!res.ok) {
          return { symbol, price: null, marketTime: null, error: `yahoo ${res.status}` };
        }
        const json = await res.json();
        const meta = json?.chart?.result?.[0]?.meta;
        const price = typeof meta?.regularMarketPrice === "number" ? meta.regularMarketPrice : null;
        const ts = typeof meta?.regularMarketTime === "number" ? meta.regularMarketTime : null;
        return {
          symbol,
          price,
          marketTime: ts ? new Date(ts * 1000).toISOString() : null,
          error: price === null ? "no price in response" : undefined,
        };
      } catch {
        return { symbol, price: null, marketTime: null, error: "fetch failed" };
      }
    })
  );

  return NextResponse.json(
    { fetchedAt: new Date().toISOString(), prices: results },
    { headers: { "Cache-Control": "no-store" } }
  );
}
