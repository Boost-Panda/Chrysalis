import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// optimistic cookie check only — the real authorization happens in the page
// and API routes via getUser(), which validates the token with Supabase.
function hasSessionCookies(request: NextRequest): boolean {
  const all = request.cookies.getAll();
  return all.some((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));
}

function createClient(request: NextRequest, response: NextResponse) {
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
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
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });

  const { pathname } = request.nextUrl;

  // Auth callback must pass through untouched.
  if (pathname.startsWith("/auth/callback")) {
    return response;
  }

  const supabase = createClient(request, response);
  const { data } = await supabase.auth.getUser();

  if (pathname.startsWith("/auth/login")) {
    // Already signed in with an allowed email? straight to the page.
    const email = data.user?.email ?? "";
    if (data.user && email.endsWith("@boostpanda.com")) {
      return NextResponse.redirect(new URL("/portfolio-pulse", request.url));
    }
    return response;
  }

  if (!data.user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!data.user.email?.endsWith("@boostpanda.com")) {
    return NextResponse.redirect(new URL("/auth/login?error=not-boostpanda", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/portfolio-pulse/:path*", "/auth/login", "/auth/callback", "/api/prices"],
};