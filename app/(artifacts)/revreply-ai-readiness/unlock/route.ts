import { NextResponse } from "next/server";
import { checkPassword, ASSESSMENT } from "../content";

// POST { password } -> 200 { assessment } | 401.
// The assessment content lives server-side only; the client bundle never
// contains it, so the public JS payload is safe even though the site is.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = typeof body?.password === "string" ? body.password : "";
  if (!password || !checkPassword(password)) {
    return NextResponse.json({ error: "invalid password" }, { status: 401 });
  }
  return NextResponse.json({ assessment: ASSESSMENT });
}
