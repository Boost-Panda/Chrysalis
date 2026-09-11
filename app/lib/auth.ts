// Server-side session helpers for gated pages and API routes. The proxy does
// an optimistic cookie check; anything that serves protected data calls
// requireBoostPandaUser() to validate the token with Supabase for real.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export async function getBoostPandaUser(): Promise<{ email: string } | null> {
  const cookieStore = await cookies();
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // server components can't set cookies; the proxy handles refresh
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const email = data.user?.email ?? "";
  if (!data.user || !email.endsWith("@boostpanda.com")) return null;
  return { email };
}