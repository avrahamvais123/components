// app/astro/hooks/useAstroCalc.js
"use client";

import { useState, useCallback } from "react";

// מזלות
export const SIGN_NAMES = [
  "טלה",
  "שור",
  "תאומים",
  "סרטן",
  "אריה",
  "בתולה",
  "מאזניים",
  "עקרב",
  "קשת",
  "גדי",
  "דלי",
  "דגים",
];
export const SIGN_GLYPHS = [
  "♈︎",
  "♉︎",
  "♊︎",
  "♋︎",
  "♌︎",
  "♍︎",
  "♎︎",
  "♏︎",
  "♐︎",
  "♑︎",
  "♒︎",
  "♓︎",
];

// פלנטות בעברית
export const PLANET_NAMES_HE = {
  sun: "שמש",
  moon: "ירח",
  mercury: "מרקורי",
  venus: "ונוס",
  mars: "מרס",
  jupiter: "צדק",
  saturn: "שבתאי",
  uranus: "אורנוס",
  neptune: "נפטון",
  pluto: "פלוטו",
  chiron: "כירון",
  sirius: "סיריוס",
};

// רשימות עזר ל־UI
export const PROFILE_ALL_KEYS = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "chiron",
  "sirius",
];
export const PROFILE_DEFAULT_INCLUDE = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
]; // ← ברירת מחדל: 5 אישיות

// יסודות + איכויות (כולל צבעים)
export const ELEMENT_KEYS = ["fire", "earth", "air", "water"];
export const ELEMENT_NAMES = {
  fire: "אש",
  earth: "אדמה",
  air: "אוויר",
  water: "מים",
};
export const ELEMENT_COLORS = {
  fire: "#ef4444",
  earth: "#8b5cf6",
  air: "#0ea5e9",
  water: "#14b8a6",
};

export const QUALITY_KEYS = ["cardinal", "fixed", "mutable"];
export const QUALITY_NAMES = {
  cardinal: "קרדינלי",
  fixed: "קבוע",
  mutable: "משתנה",
};
export const QUALITY_COLORS = {
  cardinal: "#f59e0b",
  fixed: "#16a34a",
  mutable: "#64748b",
};

// זויות בתוך מזל
export const norm360 = (deg) => ((deg % 360) + 360) % 360;
export const signIndex = (deg) => Math.floor(norm360(deg) / 30);
export const signNameOf = (deg) => SIGN_NAMES[signIndex(deg)];
export const signGlyphOf = (deg) => SIGN_GLYPHS[signIndex(deg)];
export const degInSign = (deg) => norm360(deg) % 30;

// פורמטים לתצוגה
export const fmtInSign = (deg) => {
  // d°mm'
  const x = degInSign(deg);
  let d = Math.floor(x);
  let m = Math.round((x - d) * 60);
  if (m === 60) {
    d += 1;
    m = 0;
  }
  return `${d}°${String(m).padStart(2, "0")}'`;
};
export const fmtInSignDec = (deg, decimals = 2) =>
  `${degInSign(deg).toFixed(decimals)}°`;
export const fmtInSignDegOnly = (deg) => `${Math.floor(degInSign(deg))}°`;

// קריאת מעלות
function readDegrees(maybe) {
  if (!maybe) return null;
  if (typeof maybe.longitude === "number") return maybe.longitude;
  const deg = maybe?.ChartPosition?.Ecliptic?.DecimalDegrees;
  if (typeof deg === "number") return deg;
  const startDeg =
    maybe?.StartPosition?.Ecliptic?.DecimalDegrees ??
    maybe?.ChartPosition?.StartPosition?.Ecliptic?.DecimalDegrees;
  if (typeof startDeg === "number") return startDeg;
  return null;
}

// בתים
function extractHouses(horoscope) {
  const raw = Array.isArray(horoscope?.Houses)
    ? horoscope.Houses
    : horoscope?.Houses?.all || [];
  return (raw || []).map((h, i) => {
    const deg =
      readDegrees(h?.ChartPosition?.StartPosition) ??
      readDegrees(h?.ChartPosition) ??
      readDegrees(h) ??
      0;
    return {
      house: i + 1,
      deg,
      signIndex: signIndex(deg),
      signName: signNameOf(deg),
      signGlyph: signGlyphOf(deg),
      degText: fmtInSign(deg),
      degDecText: fmtInSignDec(deg),
      degOnlyText: fmtInSignDegOnly(deg),
    };
  });
}

// אופק/MC
function extractAngles(horoscope) {
  const ascDeg =
    readDegrees(horoscope?.Ascendant?.ChartPosition) ??
    readDegrees(horoscope?.Ascendant) ??
    0;
  const mcDeg =
    readDegrees(horoscope?.Midheaven?.ChartPosition) ??
    readDegrees(horoscope?.Midheaven) ??
    0;
  const build = (deg) => ({
    deg,
    signIndex: signIndex(deg),
    signName: signNameOf(deg),
    signGlyph: signGlyphOf(deg),
    degText: fmtInSign(deg),
    degDecText: fmtInSignDec(deg),
    degOnlyText: fmtInSignDegOnly(deg),
  });
  return { ascendant: build(ascDeg), midheaven: build(mcDeg) };
}

// נרמול מפתח פלנטה
const normalizePlanetKey = (k) =>
  String(k || "")
    .trim()
    .toLowerCase();

// פלנטות
function extractPlanets(horoscope) {
  const all = horoscope?.CelestialBodies?.all;
  if (Array.isArray(all) && all.length) {
    return all.map((b) => {
      const deg = readDegrees(b) ?? 0;
      const keyNorm = normalizePlanetKey(b.key || b.name || "body");
      const nameHe = PLANET_NAMES_HE[keyNorm] || b.key || b.name || "פלנטה";
      return {
        key: keyNorm,
        nameHe,
        deg,
        signIndex: signIndex(deg),
        signName: signNameOf(deg),
        signGlyph: signGlyphOf(deg),
        degText: fmtInSign(deg),
        degDecText: fmtInSignDec(deg),
        degOnlyText: fmtInSignDegOnly(deg),
        retro: !!b.isRetrograde,
      };
    });
  }
  const names = [...PROFILE_ALL_KEYS];
  return names.map((key) => {
    let body = null;
    if (typeof horoscope?.getPlanet === "function") {
      try {
        body = horoscope.getPlanet(key);
      } catch {}
    }
    if (!body) body = horoscope?.CelestialBodies?.[key] || null;
    const deg =
      readDegrees(body) ??
      (typeof body?.longitude === "number" ? body.longitude : 0);
    const retro = !!(body?.isRetrograde || body?.retrograde);
    return {
      key,
      nameHe: PLANET_NAMES_HE[key] || key,
      deg,
      signIndex: signIndex(deg),
      signName: signNameOf(deg),
      signGlyph: signGlyphOf(deg),
      degText: fmtInSign(deg),
      degDecText: fmtInSignDec(deg),
      degOnlyText: fmtInSignDegOnly(deg),
      retro,
    };
  });
}

// היבטים
export const ASPECT_ANGLES = {
  conjunction: 0,
  semisextile: 30,
  sextile: 60,
  square: 90,
  trine: 120,
  quincunx: 150,
  opposition: 180,
};
const angleDiff = (a, b) => Math.abs(((a - b + 540) % 360) - 180);

function computeAspectsByDegree(
  planets,
  {
    aspects = ["conjunction", "sextile", "square", "trine", "opposition"],
    orb = 7,
  } = {}
) {
  const res = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const A = planets[i],
        B = planets[j];
      const d = angleDiff(A.deg, B.deg);
      for (const t of aspects) {
        const target = ASPECT_ANGLES[t];
        if (target == null) continue;
        const delta = Math.abs(d - target);
        if (delta <= orb) {
          res.push({
            mode: "degree",
            type: t,
            a: A.key,
            b: B.key,
            aInfo: {
              nameHe: A.nameHe,
              sign: A.signName,
              glyph: A.signGlyph,
              degText: A.degText,
              degDecText: A.degDecText,
              degOnlyText: A.degOnlyText,
            },
            bInfo: {
              nameHe: B.nameHe,
              sign: B.signName,
              glyph: B.signGlyph,
              degText: B.degText,
              degDecText: B.degDecText,
              degOnlyText: B.degOnlyText,
            },
            orb: +delta.toFixed(2),
            distance: +d.toFixed(2),
          });
          break;
        }
      }
    }
  }
  return res;
}

function computeAspectsBySign(
  planets,
  { aspects = ["conjunction", "sextile", "square", "trine", "opposition"] } = {}
) {
  const signDist = (aIdx, bIdx) => {
    const d = Math.abs(aIdx - bIdx) % 12;
    return d > 6 ? 12 - d : d;
  };
  const byDist = {
    0: "conjunction",
    1: "semisextile",
    2: "sextile",
    3: "square",
    4: "trine",
    5: "quincunx",
    6: "opposition",
  };
  const res = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const A = planets[i],
        B = planets[j];
      const d = signDist(A.signIndex, B.signIndex);
      const t = byDist[d];
      if (t && aspects.includes(t)) {
        res.push({
          mode: "sign",
          type: t,
          a: A.key,
          b: B.key,
          aInfo: {
            nameHe: A.nameHe,
            sign: A.signName,
            glyph: A.signGlyph,
            degText: A.degText,
            degDecText: A.degDecText,
            degOnlyText: A.degOnlyText,
          },
          bInfo: {
            nameHe: B.nameHe,
            sign: B.signName,
            glyph: B.signGlyph,
            degText: B.degText,
            degDecText: B.degDecText,
            degOnlyText: B.degOnlyText,
          },
          signDistance: d,
        });
      }
    }
  }
  return res;
}

// ---- פרופיל יסודות/איכויות ----
const SIGN_TO_ELEMENT = [
  "fire",
  "earth",
  "air",
  "water",
  "fire",
  "earth",
  "air",
  "water",
  "fire",
  "earth",
  "air",
  "water",
];
const SIGN_TO_QUALITY = [
  "cardinal",
  "fixed",
  "mutable",
  "cardinal",
  "fixed",
  "mutable",
  "cardinal",
  "fixed",
  "mutable",
  "cardinal",
  "fixed",
  "mutable",
];

/** includeKeys: מערך מפתחות לכלול; excludeKeys: מערך מפתחות להחריג */
function computeProfile(planets, { includeKeys, excludeKeys } = {}) {
  // ברירת מחדל: 5 אישיות
  let include =
    Array.isArray(includeKeys) && includeKeys.length
      ? new Set(includeKeys)
      : new Set(PROFILE_DEFAULT_INCLUDE);

  if (Array.isArray(excludeKeys) && excludeKeys.length) {
    for (const k of excludeKeys) include.delete(k);
  }

  // סינון לפי מה שבאמת קיים במפה
  const planetKeys = new Set(planets.map((p) => p.key));
  include = new Set([...include].filter((k) => planetKeys.has(k)));

  const used = planets.filter((p) => include.has(p.key));
  const total = used.length || 1;

  const eCounts = { fire: 0, earth: 0, air: 0, water: 0 };
  const eLists = { fire: [], earth: [], air: [], water: [] };
  const qCounts = { cardinal: 0, fixed: 0, mutable: 0 };
  const qLists = { cardinal: [], fixed: [], mutable: [] };

  for (const p of used) {
    const eKey = SIGN_TO_ELEMENT[p.signIndex];
    const qKey = SIGN_TO_QUALITY[p.signIndex];
    eCounts[eKey]++;
    eLists[eKey].push(p.nameHe);
    qCounts[qKey]++;
    qLists[qKey].push(p.nameHe);
  }

  const ePerc = Object.fromEntries(
    ELEMENT_KEYS.map((k) => [k, +((eCounts[k] * 100) / total).toFixed(1)])
  );
  const qPerc = Object.fromEntries(
    QUALITY_KEYS.map((k) => [k, +((qCounts[k] * 100) / total).toFixed(1)])
  );

  return {
    considered: [...include], // אילו גופים נכללו בפועל
    elements: {
      counts: eCounts,
      lists: eLists,
      percents: ePerc,
      missing: ELEMENT_KEYS.filter((k) => eCounts[k] === 0),
      total,
    },
    qualities: {
      counts: qCounts,
      lists: qLists,
      percents: qPerc,
      missing: QUALITY_KEYS.filter((k) => qCounts[k] === 0),
      total,
    },
  };
}

/** useAstroCalc */
export default function useAstroCalc() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const calc = useCallback(
    async (
      form,
      {
        aspectMode = "none",
        orb = 7,
        aspects = ["conjunction", "sextile", "square", "trine", "opposition"],
        profileIncludeKeys, // מערך לכלול
        profileExcludeKeys, // מערך להחריג (אופציונלי)
      } = {}
    ) => {
      setError("");
      setResult(null);
      setLoading(true);
      try {
        const { Origin, Horoscope } = await import(
          "circular-natal-horoscope-js"
        );

        const [y, m, d] = String(form.date).split("-").map(Number);
        const [hh, mm] = String(form.time).split(":").map(Number);

        if (!y || !m || !d || isNaN(hh) || isNaN(mm))
          throw new Error("תאריך/שעה אינם תקינים");
        if (typeof form.lat !== "number" || typeof form.lon !== "number")
          throw new Error("קו רוחב/אורך אינם תקינים");

        const origin = new Origin({
          year: y,
          month: m - 1,
          date: d,
          hour: hh,
          minute: mm,
          latitude: form.lat,
          longitude: form.lon,
        });
        const horoscope = new Horoscope({
          origin,
          houseSystem: form.houseSystem || "placidus",
          zodiac: form.zodiac || "tropical",
        });

        const angles = extractAngles(horoscope);
        const houses = extractHouses(horoscope);
        const planets = extractPlanets(horoscope);

        let aspectsOut = [];
        if (aspectMode === "degree")
          aspectsOut = computeAspectsByDegree(planets, { aspects, orb });
        else if (aspectMode === "sign")
          aspectsOut = computeAspectsBySign(planets, { aspects });

        const profile = computeProfile(planets, {
          includeKeys: profileIncludeKeys,
          excludeKeys: profileExcludeKeys,
        });

        setResult({
          meta: {
            houseSystem: form.houseSystem || "placidus",
            zodiac: form.zodiac || "tropical",
          },
          angles,
          houses,
          planets,
          aspects: aspectsOut,
          profile,
        });
      } catch (e) {
        console.error(e);
        setError(e?.message || "שגיאה בחישוב המפה");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    calc,
    loading,
    error,
    result,
    // עזר ל־UI:
    fmtInSign,
    fmtInSignDec,
    fmtInSignDegOnly,
    signNameOf,
    signGlyphOf,
    degInSign,
    SIGN_NAMES,
    SIGN_GLYPHS,
    PLANET_NAMES_HE,
    ASPECT_ANGLES,
    ELEMENT_KEYS,
    ELEMENT_NAMES,
    ELEMENT_COLORS,
    QUALITY_KEYS,
    QUALITY_NAMES,
    QUALITY_COLORS,
    PROFILE_ALL_KEYS,
    PROFILE_DEFAULT_INCLUDE,
  };
}
