import type { Airport } from "../types";

export const airports: Airport[] = [
  { code: "LAD", name: "Quatro de Fevereiro", city: "Luanda", country: "Angola" },
  { code: "CAB", name: "Catumbela", city: "Benguela", country: "Angola" },
  { code: "NOV", name: "Novo Mundo", city: "Lubango", country: "Angola" },
  { code: "SPP", name: "Maianga", city: "Menongue", country: "Angola" },
  { code: "VHC", name: "Henrique de Carvalho", city: "Saurimo", country: "Angola" },
  { code: "LBZ", name: "Lucapa", city: "Lucapa", country: "Angola" },
  { code: "PBN", name: "Porto Amboim", city: "Porto Amboim", country: "Angola" },
  { code: "NRC", name: "Namibe", city: "Namibe", country: "Angola" },
  { code: "CME", name: "Cacolo", city: "Cacolo", country: "Angola" },
  { code: "MEG", name: "Malanje", city: "Malanje", country: "Angola" },
  { code: "UAL", name: "Uige", city: "Uige", country: "Angola" },
  { code: "GUI", name: "Gabela", city: "Gabela", country: "Angola" },
  { code: "LIS", name: "Humberto Delgado", city: "Lisboa", country: "Portugal" },
  { code: "DXB", name: "Dubai International", city: "Dubai", country: "Emirados Árabes" },
  { code: "JNB", name: "O.R. Tambo International", city: "Joanesburgo", country: "África do Sul" },
  { code: "GRU", name: "Guarulhos International", city: "São Paulo", country: "Brasil" },
];

export function getAirportByCode(code: string): Airport | undefined {
  return airports.find((a) => a.code === code);
}
