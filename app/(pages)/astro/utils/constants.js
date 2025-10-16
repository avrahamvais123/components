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
  if (!type) return "";
  // נירמול: אותיות קטנות + הסרת רווחים/מקפים/קו־תחתי
  const t = String(type).trim().toLowerCase().replace(/[\s_\-]/g, "");

  // מפה רחבה עם מילים נרדפות/ווריאציות
  const map = {
    // עיקריים
    conjunction: "צמידות",
    conj: "צמידות",
    opposition: "מולות (180°)",
    opp: "מולות (180°)",
    trine: "טריין (120°)",
    triangle: "טריין (120°)",
    square: "ריבוע (90°)",
    sextile: "שישית (60°)",

    // מיעוט נפוצים
    semisextile: "חצי־שישית (30°)",
    inconjunct: "קווינקנקס (150°)", // שם חלופי
    quincunx: "קווינקנקס (150°)",
    yod: "יוד/קווינקנקס (150°)",

    // 45°, 135°
    semisquare: "חצי־ריבוע (45°)",
    halfsquare: "חצי־ריבוע (45°)",
    octile: "חצי־ריבוע (45°)", // לעתים נקרא אוקטיל
    sesquiquadrate: "ריבוע־וחצי (135°)",
    sesquisquare: "ריבוע־וחצי (135°)",
    trioctile: "ריבוע־וחצי (135°)",

    // 36°, 72°, 108°, 144°
    semiquintile: "חצי־קווינטיל (36°)",
    decile: "חצי־קווינטיל (36°)",
    quintile: "קווינטיל (72°)",
    tridecile: "טרי־דציל (108°)",
    tredecile: "טרי־דציל (108°)",
    biquintile: "בי־קווינטיל (144°)",

    // ספטיליים (קירוב)
    septile: "ספטיל (≈51.4°)",
    biseptile: "בי־ספטיל (≈102.9°)",
    triseptile: "טרי־ספטיל (≈154.3°)",

    // 40°, 80°
    novile: "נוביל (40°)",
    binovile: "בי־נוביל (80°)",

    // 165°
    quindecile: "קווינדציל (165°)",
  };

  // ניסיון ישיר
  if (map[t]) return map[t];

  // קלטים עם מפריד (למשל "semi-square") אחרי נירמול כבר מכוסים
  // החזרה כגיבוי: המחרוזת המקורית
  return String(type);
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
