// POST { email } -> sends a Supabase magic link (200) | 400/429.
// Enforces the @boostpanda.com restriction server-side; Supabase itself
// still has no domain restriction, so this is the gate that matters.
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !email.endsWith("@boostpanda.com")) {
    return NextResponse.json({ error: "only @boostpanda.com addresses can sign in" }, { status: 403 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      shouldCreateUser: true,
    },
  });

  // "Signups not allowed" means the address has no account and should not
  // get one — treat it like a sent link so we don't confirm which emails exist.
  if (error && !/signups not allowed/i.test(error.message)) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}