export const ASPECT_COLORS = {
  conjunction: "#6b7280",
  semisextile: "#f59e0b",
  sextile: "#16a34a",
  square: "#ef4444",
  trine: "#0ea5e9",
  quincunx: "#14b8a6",
  opposition: "#8b5cf6",
};

export const PERSONAL = new Set(["sun", "moon", "mercury", "venus", "mars"]);

export const GENERATIONAL = new Set([
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
]);

export function labelAspect(type) {
  const map = {
    conjunction: "צמידות",
    semisextile: "חצי־שישית (30°)",
    sextile: "שישית (60°)",
    square: "ריבוע (90°)",
    trine: "טריין (120°)",
    quincunx: "קווינקנקס (150°)",
    opposition: "מולות (180°)",
  };
  return map[type] || type;
}

// המרת מספרים לספרות רומיות
export function toRoman(num) {
  const romanNumerals = [
    { value: 12, symbol: "XII" },
    { value: 11, symbol: "XI" },
    { value: 10, symbol: "X" },
    { value: 9, symbol: "IX" },
    { value: 8, symbol: "VIII" },
    { value: 7, symbol: "VII" },
    { value: 6, symbol: "VI" },
    { value: 5, symbol: "V" },
    { value: 4, symbol: "IV" },
    { value: 3, symbol: "III" },
    { value: 2, symbol: "II" },
    { value: 1, symbol: "I" },
  ];

  for (const numeral of romanNumerals) {
    if (num === numeral.value) {
      return numeral.symbol;
    }
  }
  return num.toString(); // fallback
}
