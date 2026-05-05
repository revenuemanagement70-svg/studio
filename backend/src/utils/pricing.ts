const TAX_RATE = 0.18; // 18% GST

interface SeasonConfig {
  peakMonths: number[];
  peakMultiplier: number;
}

const SEASON: SeasonConfig = {
  peakMonths: [10, 11, 12, 1, 2, 3],
  peakMultiplier: 1.3,
};

export function calculatePrice(basePrice: number, date: Date): number {
  const month = date.getMonth() + 1;
  const multiplier = SEASON.peakMonths.includes(month) ? SEASON.peakMultiplier : 1.0;
  return Math.round(basePrice * multiplier * 100) / 100;
}

export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * TAX_RATE * 100) / 100;
}

export function calculateTotal(basePrice: number, nights: number, date: Date): { subtotal: number; taxes: number; total: number } {
  const nightlyRate = calculatePrice(basePrice, date);
  const subtotal = nightlyRate * nights;
  const taxes = calculateTax(subtotal);
  return { subtotal, taxes, total: subtotal + taxes };
}
