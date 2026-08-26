import type { Seat } from "./types";
import { SEAT_CLASSES } from "./constants";

export function groupSeatsByRow(seats: Seat[]): Record<number, Seat[]> {
  const grouped: Record<number, Seat[]> = {};
  for (const seat of seats) {
    if (!grouped[seat.row]) {
      grouped[seat.row] = [];
    }
    grouped[seat.row].push(seat);
  }
  return grouped;
}

export function getColumnsByClass(classType: string): string[] {
  return SEAT_CLASSES[classType]?.columns || SEAT_CLASSES.economy.columns;
}

export function calculateTotalPrice(
  selectedSeats: Seat[],
  basePrice: number
): { seatFee: number; baseTotal: number; grandTotal: number } {
  const seatFee = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const baseTotal = basePrice;
  const grandTotal = baseTotal + seatFee;
  return { seatFee, baseTotal, grandTotal };
}

export function getSeatTitle(seat: Seat): string {
  const parts = [`Assento ${seat.number}`];
  if (seat.isExtraLegroom) parts.push("Espaço extra");
  if (seat.price > 0) parts.push(`+${seat.price.toLocaleString("pt-AO")} Kz`);
  return parts.join(" — ");
}

export function getSeatColorClass(seat: Seat, isSelected: boolean): string {
  if (!seat.isAvailable) return "bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed";
  if (isSelected) return "bg-blue-500 text-white border-2 border-blue-600";
  if (seat.isExtraLegroom) return "bg-yellow-50 border-2 border-yellow-400 text-yellow-700";
  return "bg-green-100 border-2 border-green-500 text-green-700";
}
