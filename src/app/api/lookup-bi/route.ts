import type { NextRequest } from "next/server";

// Angolan ID format: 9 digits + 2 letters + 3 digits (e.g. 000217139NE013)
const BI_REGEX = /^\d{9}[A-Z]{2}\d{3}$/;

const SME_ENDPOINT = "https://www.sme.gov.ao/actions/bi.ajcall.php";
const SME_REFERER = "https://www.sme.gov.ao/utentes/novo";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://viajafacil.app",
  "https://www.viajafacil.app",
];

interface SmeResponse {
  sucess?: boolean;
  data?: {
    nome_completo?: string;
  };
}

function isAllowedOrigin(origin: string): boolean {
  return ALLOWED_ORIGINS.some(
    (allowed) => origin === allowed || origin.endsWith(`.${new URL(allowed).hostname}`)
  );
}

function validateRequestOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (origin && !isAllowedOrigin(origin)) return false;

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      if (!isAllowedOrigin(new URL(referer).origin)) return false;
    } catch {
      return false;
    }
  }

  return true;
}

export async function GET(request: NextRequest) {
  const bi = (request.nextUrl.searchParams.get("bi") ?? "")
    .trim()
    .toUpperCase();

  if (!BI_REGEX.test(bi)) {
    return Response.json(
      { found: false, error: "Número de BI inválido" },
      { status: 400 }
    );
  }

  if (!validateRequestOrigin(request)) {
    return Response.json(
      { found: false, error: "Acesso não autorizado" },
      { status: 403 }
    );
  }

  try {
    const upstream = await fetch(
      `${SME_ENDPOINT}?bi=${encodeURIComponent(bi)}`,
      {
        headers: { referer: SME_REFERER },
        signal: AbortSignal.timeout(10_000),
        cache: "no-store",
      }
    );

    if (!upstream.ok) {
      return Response.json(
        { found: false, error: "Serviço de validação indisponível" },
        { status: 502 }
      );
    }

    const payload = (await upstream.json()) as SmeResponse;
    const name = payload?.data?.nome_completo?.trim();

    // Only the passenger name leaves the server — no other identity data
    // is exposed to the client.
    if (!name) {
      return Response.json({ found: false, error: "BI não encontrado" });
    }

    return Response.json({ found: true, name });
  } catch {
    return Response.json(
      { found: false, error: "Não foi possível validar o BI. Preencha o nome manualmente." },
      { status: 502 }
    );
  }
}
