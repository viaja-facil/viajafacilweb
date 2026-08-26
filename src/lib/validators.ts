import { ANGOLAN_BI_REGEX, PHONE_REGEX } from "./constants";

export function validateAngolanBI(document: string): boolean {
  return ANGOLAN_BI_REGEX.test(document);
}

export function isBIFormat(document: string): boolean {
  return document.length >= 9;
}

export function sanitizeDocumentInput(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function validatePhoneNumber(phone: string): boolean {
  return PHONE_REGEX.test(phone);
}

export function validatePassengerForm(name: string, document: string): boolean {
  return name.trim().length > 0 && validateAngolanBI(document);
}
