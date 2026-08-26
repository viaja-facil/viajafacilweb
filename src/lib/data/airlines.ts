import type { Airline } from "../types";

export const airlines: Airline[] = [
  { id: "taa", name: "TAAG Angola Airlines", logo: "TAAG", color: "#c4161c" },
  { id: "lam", name: "Linhas Aéreas de Moçambique", logo: "LAM", color: "#0066b3" },
  { id: "rhs", name: "Reserve Air", logo: "RES", color: "#f39c12" },
  { id: "dac", name: "Diáspora Air", logo: "DIA", color: "#27ae60" },
  { id: "tap", name: "TAP Air Portugal", logo: "TAP", color: "#006600" },
  { id: "ema", name: "Emirates", logo: "EMI", color: "#d71921" },
];

export function getAirlineById(id: string): Airline | undefined {
  return airlines.find((a) => a.id === id);
}
