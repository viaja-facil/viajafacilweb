import type { Seat } from "./types";
import { validateAngolanBI } from "./validators";

export function calculateTotal(
  seats: Seat[],
  basePrice: number,
  passengerCount: number
): { seatFee: number; baseTotal: number; grandTotal: number } {
  const seatFee = seats.reduce((sum, s) => sum + s.price, 0);
  const baseTotal = basePrice * passengerCount;
  const grandTotal = baseTotal + seatFee;
  return { seatFee, baseTotal, grandTotal };
}

export function isPassengerFormValid(name: string, document: string): boolean {
  return name.trim().length > 0 && validateAngolanBI(document);
}

export function isPaymentValid(
  paymentMethod: string,
  phoneNumber: string,
  passengerForms: { name: string; document: string }[]
): boolean {
  if (passengerForms.some((p) => !isPassengerFormValid(p.name, p.document))) {
    return false;
  }
  if (paymentMethod === "multicaixa" && !phoneNumber.match(/^9\d{8}$/)) {
    return false;
  }
  return true;
}
