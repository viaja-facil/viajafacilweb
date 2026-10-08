import type { TripLeg } from "./types";

export function todayInAngola(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Luanda", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function isValidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T12:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

export function validateSearch(input: { origin: string; destination: string; date: string | null; departureDate: string | null; returnDate: string | null; tripType: string; flexible: boolean; legs: TripLeg[] }, today = todayInAngola()): string | null {
  const validDay = (date: string | null) => Boolean(date && isValidDate(date) && date >= today);
  if (input.tripType === "multicity") {
    if (input.legs.length < 2 || input.legs.length > 6) return "Escolha entre dois e seis trechos.";
    for (let i = 0; i < input.legs.length; i++) {
      const leg = input.legs[i];
      if (!leg.origin || !leg.destination || leg.origin === leg.destination) return `Escolha origem e destino diferentes no trecho ${i + 1}.`;
      if (!validDay(leg.date)) return `Escolha uma data válida, a partir de hoje, no trecho ${i + 1}.`;
      if (i > 0 && leg.date! < input.legs[i - 1].date!) return "As datas dos trechos devem seguir a ordem da viagem.";
    }
    return null;
  }
  if (!input.origin || !input.destination) return "Selecione os aeroportos de origem e destino.";
  if (input.origin === input.destination) return "A origem e o destino devem ser diferentes.";
  if (input.tripType === "roundtrip") {
    if (!validDay(input.departureDate) || !validDay(input.returnDate)) return "Escolha datas válidas para a ida e o regresso, a partir de hoje.";
    if (input.returnDate! < input.departureDate!) return "O regresso não pode ser anterior à ida.";
  } else if (!input.flexible && !validDay(input.date)) return "Escolha uma data válida ou ative Datas flexíveis.";
  return null;
}
