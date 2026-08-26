export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("pt-AO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-AO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-AO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("pt-AO", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " Kz";
}
