export const ANGOLAN_BI_REGEX = /^\d{9}[A-Z]{2}\d{3}$/;

export const PHONE_REGEX = /^9\d{8}$/;

export const QR_CONFIG = {
  width: 256,
  margin: 2,
  color: {
    dark: "#000000",
    light: "#FFFFFF",
  },
} as const;

export const PHONE_PREFIX = "+244";

export const SEAT_CLASSES: Record<string, { rows: number; columns: string[]; extraLegroom: number[] }> = {
  economy: { rows: 25, columns: ["A", "B", "C", "D", "E", "F"], extraLegroom: [1, 2] },
  business: { rows: 6, columns: ["A", "B", "C", "D"], extraLegroom: [1] },
  first: { rows: 3, columns: ["A", "B", "C"], extraLegroom: [1, 2] },
};

export const SEAT_COLORS = {
  available: "bg-green-100 border-2 border-green-500 text-green-700",
  selected: "bg-blue-500 text-white border-2 border-blue-600",
  occupied: "bg-gray-200 text-gray-400 border border-gray-300",
  extraLegroom: "bg-yellow-50 border-2 border-yellow-400 text-yellow-700",
} as const;
