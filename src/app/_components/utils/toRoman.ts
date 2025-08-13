// Convierte un número a romano (hasta XV)
export function toRoman(num: number): string {
  const romanNumerals = [
    "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV",
  ];
  return romanNumerals[num] ?? num.toString();
}
