// Server gate for the portfolio dashboard. The holdings data lives in
// data.ts (server-only); this page checks the session for real and renders
// the client shell only for @boostpanda.com users.
import { getBoostPandaUser } from "@/app/lib/auth";
import { HOLDINGS, CASH, COMMISSIONS, STARTED } from "./data";
import PortfolioPulseClient from "./PortfolioPulseClient";

export const dynamic = "force-dynamic";

export default async function PortfolioPulsePage() {
  const user = await getBoostPandaUser();
  if (!user) return null; // proxy already redirected; nothing to render

  return (
    <PortfolioPulseClient
      holdings={HOLDINGS}
      cash={CASH}
      commissions={COMMISSIONS}
      started={STARTED}
    />
  );
}