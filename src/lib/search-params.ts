export interface SearchParams {
  origin?: string;
  destination?: string;
  date?: string;
  departureDate?: string;
  returnDate?: string;
  passengers?: number;
  adults?: number;
  children?: number;
  tripType?: string;
}

export function buildSearchParams(params: SearchParams): string {
  const urlParams = new URLSearchParams();
  if (params.origin) urlParams.set("origin", params.origin);
  if (params.destination) urlParams.set("destination", params.destination);

  if (params.tripType === "roundtrip") {
    if (params.departureDate) urlParams.set("departureDate", params.departureDate);
    if (params.returnDate) urlParams.set("returnDate", params.returnDate);
  } else {
    if (params.date) urlParams.set("date", params.date);
  }

  if (params.passengers) urlParams.set("passengers", params.passengers.toString());
  if (params.adults) urlParams.set("adults", params.adults.toString());
  if (params.children) urlParams.set("children", params.children.toString());
  if (params.tripType) urlParams.set("tripType", params.tripType);

  return urlParams.toString();
}

export function buildQuickBookParams(origin: string, destination: string): string {
  return new URLSearchParams({
    origin,
    destination,
    passengers: "1",
    tripType: "oneway",
  }).toString();
}

export function parseSearchParams(searchParams: URLSearchParams) {
  return {
    origin: searchParams.get("origin") || "",
    destination: searchParams.get("destination") || "",
    date: searchParams.get("date") || "",
    passengers: parseInt(searchParams.get("passengers") || "1"),
    adults: parseInt(searchParams.get("adults") || ""),
    children: parseInt(searchParams.get("children") || ""),
  };
}
