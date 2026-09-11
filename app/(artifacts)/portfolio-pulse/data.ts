// Server-only portfolio data. Never imported by a client component — it
// reaches the browser only through the gated page after a BoostPanda login.
// Snapshot from the brokerage account, June 17 – Sep 5 2026.
// SPCX: 25 sh @ $163.40 (Jun 30). QQQ: 1 sh @ $728.83 + 0.2 sh @ $728.19 (Jul 1).
// Commissions: $2 total. Cash left: $38.53.

export type Holding = {
  ticker: string;
  name: string;
  shares: number;
  avgCost: number;
  lastPrint: number;
};

export const HOLDINGS: Holding[] = [
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

export const CASH = 38.53;
export const COMMISSIONS = 2.0;
export const STARTED = "2026-06-17";