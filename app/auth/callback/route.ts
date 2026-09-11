import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Supabase magic-link redirect: exchanges the code for a session, sets the
// auth cookies, then sends the user on their way.
export async function GET(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next") ?? "/portfolio-pulse";
  // never let "next" leave the site
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/portfolio-pulse";

  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/auth/login?error=missing-code", request.url));
  }

  const response = NextResponse.redirect(new URL(safeNext, request.url));
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/auth/login?error=exchange-failed", request.url));
  }

  return response;
}