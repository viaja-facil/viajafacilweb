import type { Flight } from "../types";

const toLocalDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function generateFlights(): Flight[] {
  const baseFlights: Omit<Flight, "id" | "departureTime" | "arrivalTime">[] = [
    { airlineId: "taa", flightNumber: "DT 302", origin: "LAD", destination: "CAB", duration: "1h 30min", price: 48000, currency: "AOA", availableSeats: 120, totalSeats: 180, aircraft: "Boeing 737-700", stops: 0, class: "economy", hasCheckedBaggage: true },
    { airlineId: "taa", flightNumber: "DT 304", origin: "LAD", destination: "CAB", duration: "1h 45min", price: 55000, currency: "AOA", availableSeats: 85, totalSeats: 180, aircraft: "Boeing 737-800", stops: 0, class: "economy", hasCheckedBaggage: false },
    { airlineId: "taa", flightNumber: "DT 500", origin: "LAD", destination: "CAB", duration: "2h 00min", price: 95000, currency: "AOA", availableSeats: 20, totalSeats: 50, aircraft: "Boeing 767-300", stops: 0, class: "business", hasCheckedBaggage: true },
    { airlineId: "taa", flightNumber: "DT 150", origin: "LAD", destination: "CAB", duration: "1h 30min", price: 150000, currency: "AOA", availableSeats: 8, totalSeats: 16, aircraft: "Bombardier CRJ-900", stops: 0, class: "first", hasCheckedBaggage: true },
    { airlineId: "lam", flightNumber: "TM 702", origin: "CAB", destination: "LAD", duration: "1h 30min", price: 50000, currency: "AOA", availableSeats: 110, totalSeats: 180, aircraft: "Boeing 737-700", stops: 0, class: "economy", hasCheckedBaggage: true },
    { airlineId: "rhs", flightNumber: "RH 101", origin: "LAD", destination: "NOV", duration: "1h 30min", price: 135000, currency: "AOA", availableSeats: 45, totalSeats: 120, aircraft: "Airbus A320", stops: 0, class: "economy", hasCheckedBaggage: false },
    { airlineId: "taa", flightNumber: "DT 320", origin: "LAD", destination: "NOV", duration: "1h 30min", price: 270000, currency: "AOA", availableSeats: 15, totalSeats: 30, aircraft: "Boeing 737-800", stops: 0, class: "business", hasCheckedBaggage: true },
    { airlineId: "dac", flightNumber: "DA 205", origin: "LAD", destination: "SPP", duration: "2h 30min", price: 142000, currency: "AOA", availableSeats: 60, totalSeats: 150, aircraft: "Boeing 737 MAX", stops: 0, class: "economy", hasCheckedBaggage: false },
    { airlineId: "taa", flightNumber: "DT 410", origin: "LAD", destination: "VHC", duration: "2h 00min", price: 120000, currency: "AOA", availableSeats: 90, totalSeats: 150, aircraft: "Embraer E190", stops: 0, class: "economy", hasCheckedBaggage: true },
    { airlineId: "rhs", flightNumber: "RH 220", origin: "LAD", destination: "MEG", duration: "1h 15min", price: 52000, currency: "AOA", availableSeats: 70, totalSeats: 120, aircraft: "ATR 72-600", stops: 0, class: "economy", hasCheckedBaggage: false },
    { airlineId: "dac", flightNumber: "DA 310", origin: "LAD", destination: "UAL", duration: "1h 45min", price: 65000, currency: "AOA", availableSeats: 55, totalSeats: 120, aircraft: "Airbus A319", stops: 0, class: "economy", hasCheckedBaggage: false },
    { airlineId: "taa", flightNumber: "DT 600", origin: "LAD", destination: "NRC", duration: "1h 45min", price: 147500, currency: "AOA", availableSeats: 40, totalSeats: 120, aircraft: "Embraer E195", stops: 0, class: "economy", hasCheckedBaggage: true },
    { airlineId: "taa", flightNumber: "DT 602", origin: "LAD", destination: "NRC", duration: "1h 45min", price: 295000, currency: "AOA", availableSeats: 12, totalSeats: 24, aircraft: "Boeing 737-800", stops: 0, class: "business", hasCheckedBaggage: true },
    { airlineId: "rhs", flightNumber: "RH 350", origin: "LAD", destination: "LBZ", duration: "1h 30min", price: 58000, currency: "AOA", availableSeats: 65, totalSeats: 120, aircraft: "ATR 72-600", stops: 0, class: "economy", hasCheckedBaggage: false },
    { airlineId: "tap", flightNumber: "TP 288", origin: "LAD", destination: "LIS", duration: "6h 30min", price: 750000, currency: "AOA", availableSeats: 80, totalSeats: 250, aircraft: "Airbus A330-900", stops: 0, class: "economy", hasCheckedBaggage: true },
    { airlineId: "tap", flightNumber: "TP 286", origin: "LAD", destination: "LIS", duration: "6h 30min", price: 2400000, currency: "AOA", availableSeats: 24, totalSeats: 30, aircraft: "Airbus A330-900", stops: 0, class: "business", hasCheckedBaggage: true },
    { airlineId: "ema", flightNumber: "EK 794", origin: "LAD", destination: "DXB", duration: "7h 45min", price: 520000, currency: "AOA", availableSeats: 150, totalSeats: 400, aircraft: "Boeing 777-300ER", stops: 0, class: "economy", hasCheckedBaggage: true },
    { airlineId: "ema", flightNumber: "EK 794", origin: "LAD", destination: "DXB", duration: "7h 45min", price: 1500000, currency: "AOA", availableSeats: 12, totalSeats: 14, aircraft: "Boeing 777-300ER", stops: 0, class: "business", hasCheckedBaggage: true },
    { airlineId: "taa", flightNumber: "DT 790", origin: "LAD", destination: "JNB", duration: "4h 15min", price: 320000, currency: "AOA", availableSeats: 95, totalSeats: 180, aircraft: "Boeing 737-800", stops: 0, class: "economy", hasCheckedBaggage: true },
    { airlineId: "taa", flightNumber: "DT 792", origin: "LAD", destination: "JNB", duration: "4h 15min", price: 680000, currency: "AOA", availableSeats: 20, totalSeats: 30, aircraft: "Boeing 737-800", stops: 0, class: "business", hasCheckedBaggage: true },
    { airlineId: "taa", flightNumber: "DT 792", origin: "LAD", destination: "GRU", duration: "8h 00min", price: 362000, currency: "AOA", availableSeats: 100, totalSeats: 220, aircraft: "Boeing 787-9", stops: 0, class: "economy", hasCheckedBaggage: true },
    { airlineId: "taa", flightNumber: "DT 794", origin: "LAD", destination: "GRU", duration: "8h 00min", price: 821000, currency: "AOA", availableSeats: 16, totalSeats: 16, aircraft: "Boeing 787-9", stops: 0, class: "business", hasCheckedBaggage: true },
  ];

  const flights: Flight[] = [];
  let id = 1;
  const now = new Date(2026, 7, 21);

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);
    const dateStr = toLocalDateStr(date);

    baseFlights.forEach((base, idx) => {
      const fliesOnDay = (dayOffset + idx) % 3 !== 0;
      if (!fliesOnDay) return;

      const timeOffsets = [0, 30, 60, 90, 120, 150, 180];
      const timeOffset = timeOffsets[(dayOffset + idx) % timeOffsets.length];
      const baseHour = 6 + (idx % 12);

      const depHour = baseHour + Math.floor(timeOffset / 60);
      const depMin = timeOffset % 60;
      const depTime = `${dateStr}T${String(depHour).padStart(2, "0")}:${String(depMin).padStart(2, "0")}:00`;

      const durationMatch = base.duration.match(/(\d+)h\s*(\d+)min/);
      const durHours = durationMatch ? parseInt(durationMatch[1]) : 1;
      const durMins = durationMatch ? parseInt(durationMatch[2]) : 0;
      const arrDate = new Date(date);
      arrDate.setHours(depHour + durHours, depMin + durMins);
      const arrTime = `${toLocalDateStr(arrDate)}T${String(arrDate.getHours()).padStart(2, "0")}:${String(arrDate.getMinutes()).padStart(2, "0")}:00`;

      const priceVariation = 1 + ((dayOffset * 7 + idx * 13) % 20 - 10) / 100;
      const price = Math.round(base.price * priceVariation);

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
