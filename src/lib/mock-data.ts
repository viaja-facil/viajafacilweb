export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Airline {
  id: string;
  name: string;
  logo: string;
  color: string;
}

export interface Flight {
  id: string;
  airlineId: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  availableSeats: number;
  totalSeats: number;
  aircraft: string;
  stops: number;
  class: "economy" | "business" | "first";
}

export interface Seat {
  id: string;
  number: string;
  row: number;
  column: string;
  class: "economy" | "business" | "first";
  isAvailable: boolean;
  isExtraLegroom: boolean;
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  phone?: string;
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  seats: string[];
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  bookingDate: string;
  passengers: Passenger[];
}

export interface Passenger {
  name: string;
  document: string;
  seat: string;
}

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

export const airlines: Airline[] = [
  { id: "taa", name: "TAAG Angola Airlines", logo: "TAAG", color: "#c4161c" },
  { id: "lam", name: "Linhas Aéreas de Moçambique", logo: "LAM", color: "#0066b3" },
  { id: "rhs", name: "Reserve Air", logo: "RES", color: "#f39c12" },
  { id: "dac", name: "Diáspora Air", logo: "DIA", color: "#27ae60" },
  { id: "tap", name: "TAP Air Portugal", logo: "TAP", color: "#006600" },
  { id: "ema", name: "Emirates", logo: "EMI", color: "#d71921" },
];

// Generate flights across multiple dates for calendar availability
function generateFlights(): Flight[] {
  const baseFlights: Omit<Flight, "id" | "departureTime" | "arrivalTime">[] = [
    // LAD → CAB (Luanda → Benguela) - múltiplos voos diários
    { airlineId: "taa", flightNumber: "DT 302", origin: "LAD", destination: "CAB", duration: "1h 30min", price: 48000, currency: "AOA", availableSeats: 120, totalSeats: 180, aircraft: "Boeing 737-700", stops: 0, class: "economy" },
    { airlineId: "taa", flightNumber: "DT 304", origin: "LAD", destination: "CAB", duration: "1h 45min", price: 55000, currency: "AOA", availableSeats: 85, totalSeats: 180, aircraft: "Boeing 737-800", stops: 0, class: "economy" },
    { airlineId: "taa", flightNumber: "DT 500", origin: "LAD", destination: "CAB", duration: "2h 00min", price: 95000, currency: "AOA", availableSeats: 20, totalSeats: 50, aircraft: "Boeing 767-300", stops: 0, class: "business" },
    { airlineId: "taa", flightNumber: "DT 150", origin: "LAD", destination: "CAB", duration: "1h 30min", price: 150000, currency: "AOA", availableSeats: 8, totalSeats: 16, aircraft: "Bombardier CRJ-900", stops: 0, class: "first" },
    // CAB → LAD (Benguela → Luanda)
    { airlineId: "lam", flightNumber: "TM 702", origin: "CAB", destination: "LAD", duration: "1h 30min", price: 50000, currency: "AOA", availableSeats: 110, totalSeats: 180, aircraft: "Boeing 737-700", stops: 0, class: "economy" },
    // LAD → NOV (Luanda → Lubango)
    { airlineId: "rhs", flightNumber: "RH 101", origin: "LAD", destination: "NOV", duration: "1h 30min", price: 135000, currency: "AOA", availableSeats: 45, totalSeats: 120, aircraft: "Airbus A320", stops: 0, class: "economy" },
    { airlineId: "taa", flightNumber: "DT 320", origin: "LAD", destination: "NOV", duration: "1h 30min", price: 270000, currency: "AOA", availableSeats: 15, totalSeats: 30, aircraft: "Boeing 737-800", stops: 0, class: "business" },
    // LAD → SPP (Luanda → Menongue)
    { airlineId: "dac", flightNumber: "DA 205", origin: "LAD", destination: "SPP", duration: "2h 30min", price: 142000, currency: "AOA", availableSeats: 60, totalSeats: 150, aircraft: "Boeing 737 MAX", stops: 0, class: "economy" },
    // LAD → VHC (Luanda → Saurimo)
    { airlineId: "taa", flightNumber: "DT 410", origin: "LAD", destination: "VHC", duration: "2h 00min", price: 120000, currency: "AOA", availableSeats: 90, totalSeats: 150, aircraft: "Embraer E190", stops: 0, class: "economy" },
    // LAD → MEG (Luanda → Malanje)
    { airlineId: "rhs", flightNumber: "RH 220", origin: "LAD", destination: "MEG", duration: "1h 15min", price: 52000, currency: "AOA", availableSeats: 70, totalSeats: 120, aircraft: "ATR 72-600", stops: 0, class: "economy" },
    // LAD → UAL (Luanda → Uíge)
    { airlineId: "dac", flightNumber: "DA 310", origin: "LAD", destination: "UAL", duration: "1h 45min", price: 65000, currency: "AOA", availableSeats: 55, totalSeats: 120, aircraft: "Airbus A319", stops: 0, class: "economy" },
    // LAD → NRC (Luanda → Namibe)
    { airlineId: "taa", flightNumber: "DT 600", origin: "LAD", destination: "NRC", duration: "1h 45min", price: 147500, currency: "AOA", availableSeats: 40, totalSeats: 120, aircraft: "Embraer E195", stops: 0, class: "economy" },
    { airlineId: "taa", flightNumber: "DT 602", origin: "LAD", destination: "NRC", duration: "1h 45min", price: 295000, currency: "AOA", availableSeats: 12, totalSeats: 24, aircraft: "Boeing 737-800", stops: 0, class: "business" },
    // LAD → LBZ (Luanda → Lucapa)
    { airlineId: "rhs", flightNumber: "RH 350", origin: "LAD", destination: "LBZ", duration: "1h 30min", price: 58000, currency: "AOA", availableSeats: 65, totalSeats: 120, aircraft: "ATR 72-600", stops: 0, class: "economy" },
    // International flights - Lisboa
    { airlineId: "tap", flightNumber: "TP 288", origin: "LAD", destination: "LIS", duration: "6h 30min", price: 750000, currency: "AOA", availableSeats: 80, totalSeats: 250, aircraft: "Airbus A330-900", stops: 0, class: "economy" },
    { airlineId: "tap", flightNumber: "TP 286", origin: "LAD", destination: "LIS", duration: "6h 30min", price: 2400000, currency: "AOA", availableSeats: 24, totalSeats: 30, aircraft: "Airbus A330-900", stops: 0, class: "business" },
    // International flights - Dubai
    { airlineId: "ema", flightNumber: "EK 794", origin: "LAD", destination: "DXB", duration: "7h 45min", price: 520000, currency: "AOA", availableSeats: 150, totalSeats: 400, aircraft: "Boeing 777-300ER", stops: 0, class: "economy" },
    { airlineId: "ema", flightNumber: "EK 794", origin: "LAD", destination: "DXB", duration: "7h 45min", price: 1500000, currency: "AOA", availableSeats: 12, totalSeats: 14, aircraft: "Boeing 777-300ER", stops: 0, class: "business" },
    // International flights - Joanesburgo
    { airlineId: "taa", flightNumber: "DT 790", origin: "LAD", destination: "JNB", duration: "4h 15min", price: 320000, currency: "AOA", availableSeats: 95, totalSeats: 180, aircraft: "Boeing 737-800", stops: 0, class: "economy" },
    { airlineId: "taa", flightNumber: "DT 792", origin: "LAD", destination: "JNB", duration: "4h 15min", price: 680000, currency: "AOA", availableSeats: 20, totalSeats: 30, aircraft: "Boeing 737-800", stops: 0, class: "business" },
    // International flights - São Paulo
    { airlineId: "taa", flightNumber: "DT 792", origin: "LAD", destination: "GRU", duration: "8h 00min", price: 362000, currency: "AOA", availableSeats: 100, totalSeats: 220, aircraft: "Boeing 787-9", stops: 0, class: "economy" },
    { airlineId: "taa", flightNumber: "DT 794", origin: "LAD", destination: "GRU", duration: "8h 00min", price: 821000, currency: "AOA", availableSeats: 16, totalSeats: 16, aircraft: "Boeing 787-9", stops: 0, class: "business" },
  ];

  const flights: Flight[] = [];
  let id = 1;
  const now = new Date(2026, 7, 21); // Aug 21, 2026

  // Generate flights for the next 30 days with varying schedules
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    const dateStr = date.toISOString().split("T")[0];

    // Not all routes fly every day - use deterministic pattern
    baseFlights.forEach((base, idx) => {
      // Each route flies on specific days (cyclic pattern)
      const fliesOnDay = (dayOffset + idx) % 3 !== 0; // ~66% of days
      if (!fliesOnDay) return;

      // Vary departure times slightly
      const timeOffsets = [0, 30, 60, 90, 120, 150, 180];
      const timeOffset = timeOffsets[(dayOffset + idx) % timeOffsets.length];
      const baseHour = 6 + (idx % 12);

      const depHour = baseHour + Math.floor(timeOffset / 60);
      const depMin = timeOffset % 60;
      const depTime = `${dateStr}T${String(depHour).padStart(2, "0")}:${String(depMin).padStart(2, "0")}:00`;

      // Parse duration to calculate arrival
      const durationMatch = base.duration.match(/(\d+)h\s*(\d+)min/);
      const durHours = durationMatch ? parseInt(durationMatch[1]) : 1;
      const durMins = durationMatch ? parseInt(durationMatch[2]) : 0;
      const arrDate = new Date(date);
      arrDate.setHours(depHour + durHours, depMin + durMins);
      const arrTime = arrDate.toISOString().replace("Z", "").split(".")[0];

      // Vary price +/- 10%
      const priceVariation = 1 + ((dayOffset * 7 + idx * 13) % 20 - 10) / 100;
      const price = Math.round(base.price * priceVariation);

      // Vary available seats
      const seatsVariation = Math.max(0, base.availableSeats - ((dayOffset * 3 + idx * 7) % 30));

      flights.push({
        id: `f${id++}`,
        ...base,
        departureTime: depTime,
        arrivalTime: arrTime,
        price,
        availableSeats: seatsVariation,
      });
    });
  }

  return flights;
}

export const flights: Flight[] = generateFlights();

export const mockUsers: User[] = [
  { id: "u1", name: "Carlos Silva", email: "admin@viajafacil.ao", role: "admin", phone: "+244 923 456 789" },
  { id: "u2", name: "Maria Santos", email: "maria@teste.ao", role: "user", phone: "+244 912 345 678" },
  { id: "u3", name: "João Pedro", email: "joao@teste.ao", role: "user", phone: "+244 934 567 890" },
];

export const mockBookings: Booking[] = [
  {
    id: "bk1",
    userId: "u2",
    flightId: "f1",
    seats: ["12A", "12B"],
    totalPrice: 90000,
    status: "confirmed",
    bookingDate: "2026-08-20T10:30:00",
    passengers: [
      { name: "Maria Santos", document: "004567890LA045", seat: "12A" },
      { name: "Pedro Santos", document: "004567891LA045", seat: "12B" },
    ],
  },
  {
    id: "bk2",
    userId: "u3",
    flightId: "f3",
    seats: ["5C"],
    totalPrice: 55000,
    status: "confirmed",
    bookingDate: "2026-08-19T14:00:00",
    passengers: [
      { name: "João Pedro", document: "004567892LA045", seat: "5C" },
    ],
  },
  {
    id: "bk3",
    userId: "u2",
    flightId: "f7",
    seats: ["2A"],
    totalPrice: 85000,
    status: "pending",
    bookingDate: "2026-08-21T09:15:00",
    passengers: [
      { name: "Maria Santos", document: "004567890LA045", seat: "2A" },
    ],
  },
];

export function generateSeats(flightId: string, classType: "economy" | "business" | "first"): Seat[] {
  const seats: Seat[] = [];
  const config = {
    economy: { rows: 25, columns: ["A", "B", "C", "D", "E", "F"], extraLegroom: [1, 2] },
    business: { rows: 6, columns: ["A", "B", "C", "D"], extraLegroom: [1] },
    first: { rows: 3, columns: ["A", "B", "C"], extraLegroom: [1, 2] },
  };

  const { rows, columns, extraLegroom } = config[classType];

  for (let row = 1; row <= rows; row++) {
    for (const col of columns) {
      const seatId = `${row}${col}`;
      const isOccupied = mockBookings.some(
        (b) => b.flightId === flightId && b.seats.includes(seatId)
      );

      seats.push({
        id: seatId,
        number: seatId,
        row,
        column: col,
        class: classType,
        isAvailable: !isOccupied,
        isExtraLegroom: extraLegroom.includes(row),
        price: classType === "first" ? 15000 : classType === "business" ? 10000 : extraLegroom.includes(row) ? 5000 : 0,
      });
    }
  }

  return seats;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("pt-AO", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " Kz";
}

export function getAirportByCode(code: string): Airport | undefined {
  return airports.find((a) => a.code === code);
}

export function getAirlineById(id: string): Airline | undefined {
  return airlines.find((a) => a.id === id);
}

export interface DateAvailability {
  date: string;
  hasFlights: boolean;
  minPrice: number;
  flightCount: number;
}

export function getAvailabilityForRoute(origin: string, destination: string): DateAvailability[] {
  const result: DateAvailability[] = [];
  const now = new Date(2026, 7, 21);

  for (let i = 0; i < 60; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    const dayFlights = flights.filter(
      (f) =>
        f.origin === origin &&
        f.destination === destination &&
        f.departureTime.startsWith(dateStr) &&
        f.availableSeats > 0
    );

    result.push({
      date: dateStr,
      hasFlights: dayFlights.length > 0,
      minPrice: dayFlights.length > 0 ? Math.min(...dayFlights.map((f) => f.price)) : 0,
      flightCount: dayFlights.length,
    });
  }

  return result;
}

export function getCheapestDate(origin: string, destination: string): string | null {
  const availability = getAvailabilityForRoute(origin, destination);
  const available = availability.filter((a) => a.hasFlights);
  if (available.length === 0) return null;
  return available.reduce((cheapest, curr) =>
    curr.minPrice < cheapest.minPrice ? curr : cheapest
  ).date;
}

export function getFlightsForDate(origin: string, destination: string, date: string): Flight[] {
  return flights.filter(
    (f) =>
      f.origin === origin &&
      f.destination === destination &&
      f.departureTime.startsWith(date) &&
      f.availableSeats > 0
  );
}
