import type { TripLeg } from "./types";

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
  legs?: TripLeg[];
}

export function buildSearchParams(params: SearchParams): string {
  const urlParams = new URLSearchParams();

  if (params.tripType === "multicity" && params.legs && params.legs.length > 0) {
    urlParams.set("tripType", "multicity");
    urlParams.set("legCount", params.legs.length.toString());
    params.legs.forEach((leg, i) => {
      urlParams.set(`leg${i}.origin`, leg.origin);
      urlParams.set(`leg${i}.destination`, leg.destination);
      if (leg.date) urlParams.set(`leg${i}.date`, leg.date);
    });
  } else {
    if (params.origin) urlParams.set("origin", params.origin);
    if (params.destination) urlParams.set("destination", params.destination);

    if (params.tripType === "roundtrip") {
      if (params.departureDate) urlParams.set("departureDate", params.departureDate);
      if (params.returnDate) urlParams.set("returnDate", params.returnDate);
    } else {
      if (params.date) urlParams.set("date", params.date);
    }

    if (params.tripType) urlParams.set("tripType", params.tripType);
  }

  if (params.passengers) urlParams.set("passengers", params.passengers.toString());
  if (params.adults) urlParams.set("adults", params.adults.toString());
  if (params.children) urlParams.set("children", params.children.toString());

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
  const tripType = searchParams.get("tripType") || "oneway";
  const legCount = parseInt(searchParams.get("legCount") || "0");

  if (tripType === "multicity" && legCount > 0) {
    const legs: TripLeg[] = [];
    for (let i = 0; i < legCount; i++) {
      const origin = searchParams.get(`leg${i}.origin`) || "";
      const destination = searchParams.get(`leg${i}.destination`) || "";
      const date = searchParams.get(`leg${i}.date`) || "";
      if (origin && destination) {
        legs.push({
          id: `leg-${i}`,
          origin,
          destination,
          date: date || null,
        });
      }
    }
    return {
      origin: legs[0]?.origin || "",
      destination: legs[legs.length - 1]?.destination || "",
      date: "",
      passengers: parseInt(searchParams.get("passengers") || "1"),
      adults: parseInt(searchParams.get("adults") || ""),
      children: parseInt(searchParams.get("children") || ""),
      tripType,
      legs,
    };
  }

  return {
    origin: searchParams.get("origin") || "",
    destination: searchParams.get("destination") || "",
    date: searchParams.get("date") || "",
    passengers: parseInt(searchParams.get("passengers") || "1"),
    adults: parseInt(searchParams.get("adults") || ""),
    children: parseInt(searchParams.get("children") || ""),
    tripType,
    legs: [] as TripLeg[],
  };
}
