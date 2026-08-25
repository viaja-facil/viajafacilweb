import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://viajafacil.app",
  "https://www.viajafacil.app",
];

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function isAllowedOrigin(origin: string): boolean {
  return ALLOWED_ORIGINS.some(
    (allowed) => origin === allowed || origin.endsWith(`.${new URL(allowed).hostname}`)
  );
}

function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (origin) {
    return isAllowedOrigin(origin);
  }

  if (referer) {
    try {
      return isAllowedOrigin(new URL(referer).origin);
    } catch {
      return false;
    }
  }

  return false;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/api/lookup-bi") {
    if (request.method === "OPTIONS") {
      const origin = request.headers.get("origin") ?? "";
      if (!isAllowedOrigin(origin)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.json({}, { headers: { ...CORS_HEADERS, "Access-Control-Allow-Origin": origin } });
    }

    if (!validateOrigin(request)) {
      return NextResponse.json(
        { found: false, error: "Acesso não autorizado" },
        { status: 403 }
      );
    }

    const response = NextResponse.next();
    const origin = request.headers.get("origin");
    if (origin && isAllowedOrigin(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/lookup-bi", "/api/lookup-bi/:path*"],
};
