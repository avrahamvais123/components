import { HOUSE_LABELS_HE_BY_EN, HOUSE_ORDINALS_HE, PLANET_GLYPHS_BY_EN, PLANET_GLYPHS_BY_KEY, PLANET_NAMES_HE_BY_EN, PLANET_NAMES_HE_BY_KEY, SIGN_GLYPHS, SIGNS } from "./sources";

export const toSign = (deg) =>
  SIGNS[Math.floor((((deg % 360) + 360) % 360) / 30)];

export const toSignGlyph = (deg) => {
  const idx = Math.floor((((deg % 360) + 360) % 360) / 30);
  return SIGN_GLYPHS[idx] || "";
};

export const pad2 = (n) => String(n).padStart(2, "0");

/** פורמט מעלה-דקה (ללא שניות) מתוך מחרוזת כמו "7° 32' 11''" => "7° 32" */
export function fmtDegMin(input) {
  if (input == null) return "";
  const s = String(input);
  // נסה לחלץ מעלות ודקות מהמחרוזת
  const m = s.match(/(-?\d+)\D+(\d+)/);
  if (m) {
    const d = m[1];
    const min = m[2];
    return `${pad2(min)} ${d}°`;
  }
  // fallback: אם זה מספר עשרוני
  const numeric = Number(s.replace(/[^0-9.\-]/g, ""));
  if (Number.isFinite(numeric)) {
    const d = Math.trunc(numeric);
    const min = Math.round((numeric - d) * 60);
    return `${pad2(min)} ${d}°`;
  }
  return s;
}

// נירמול שמות מפתחות של גופים/נקודות כדי למנוע כפילויות (למשל northnode => truenode)
export function normalizeBodyKey(k) {
  const s = String(k || "")
    .toLowerCase()
    .trim();
  if (
    s === "northnode" ||
    s === "north node" ||
    s === "meannode" ||
    s === "mean node" ||
    s === "true node" ||
    s === "truenode"
  ) {
    return "truenode";
  }
  if (s === "southnode" || s === "south node") return "southnode";
  return s;
}

/** נירמול מספר שייתכן ונכתב עם פסיק עשרוני */
export const normalizeNum = (v) =>
  typeof v === "string" ? Number(v.replace(",", ".").trim()) : Number(v);

/** מרחק קדמי על המעגל (0–360) */
export const fwd = (from, to) => (((to - from) % 360) + 360) % 360;

/** מציאת בית עבור זווית Ecliptic נתונה (deg) מול קאספי בתים (אורך כל קאספ ב-DecimalDegrees) */
export function findHouseForDegree(deg, cuspsDegs) {
  if (
    !Number.isFinite(deg) ||
    !Array.isArray(cuspsDegs) ||
    cuspsDegs.length !== 12
  )
    return null;
  for (let i = 0; i < 12; i++) {
    const start = cuspsDegs[i];
    const end = cuspsDegs[(i + 1) % 12];
    const span = fwd(start, end);
    const dToBody = fwd(start, deg);
    if (dToBody >= 0 && dToBody < span) return i + 1; // 1..12
  }
  return null;
}

/** תרגום שם פלנטה/נקודה לעברית */
export function toHebBodyName({ key, label }) {
  const k = typeof key === "string" ? key.toLowerCase() : "";
  const fromKey = PLANET_NAMES_HE_BY_KEY[k];
  if (fromKey) return fromKey;
  if (typeof label === "string") {
    const fromEn =
      PLANET_NAMES_HE_BY_EN[label] || PLANET_NAMES_HE_BY_EN[label.trim()];
    if (fromEn) return fromEn;
  }
  // Fallback: החזר את label או key
  return label || key || "";
}

/** גליף לפלנטה/נקודה לפי key/label */
export function planetGlyph({ key, label }) {
  const k = typeof key === "string" ? key.toLowerCase() : "";
  const byKey = PLANET_GLYPHS_BY_KEY[k];
  if (byKey) return byKey;
  if (typeof label === "string") {
    return (
      PLANET_GLYPHS_BY_EN[label] || PLANET_GLYPHS_BY_EN[label.trim()] || ""
    );
  }
  return "";
}

/** תרגום שם בית לעברית לפי id/label */
export function houseNameHe({ id, label }) {
  if (Number.isInteger(id) && id >= 1 && id <= 12)
    return HOUSE_ORDINALS_HE[id - 1];
  if (label && HOUSE_LABELS_HE_BY_EN[label])
    return HOUSE_LABELS_HE_BY_EN[label];
  return id ? `מס׳ ${id}` : "";
}
