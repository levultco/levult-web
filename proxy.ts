import { NextResponse, type NextRequest } from "next/server";

/**
 * Spanish lives at the root but its pages are built under /es. For every
 * other path next.config.ts rewrites that, but the root must be rewritten
 * here: on Vercel the config rewrite of "/" answered the router's data request
 * (`/?_rsc=…`) with the full HTML page, so Next gave up on the client
 * navigation and reloaded the page, with no transition, and its prefetch got a
 * 404. A proxy rewrite is understood by Vercel for every kind of request.
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/es";
  return NextResponse.rewrite(url);
}

export const config = { matcher: ["/"] };
