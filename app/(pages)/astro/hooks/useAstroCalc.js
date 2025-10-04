// app/astro/useAstroCalc.js
"use client";

import { useState, useCallback } from "react";

// שמות וסמלי מזלות באותו סדר
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

// שמות פלנטות בעברית
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
};

// עזר לזוויות ולתצוגה בתוך מזל
export const norm360 = (deg) => ((deg % 360) + 360) % 360;
export const signIndex = (deg) => Math.floor(norm360(deg) / 30);
export const signNameOf = (deg) => SIGN_NAMES[signIndex(deg)];
export const signGlyphOf = (deg) => SIGN_GLYPHS[signIndex(deg)];
export const degInSign = (deg) => norm360(deg) % 30;
// פורמט d°mm' (0–30 בתוך המזל)
export const fmtInSign = (deg) => {
  const x = degInSign(deg);
  let d = Math.floor(x);
  let m = Math.round((x - d) * 60);
  if (m === 60) {
    d += 1;
    m = 0;
  }
  return `${d}°${String(m).padStart(2, "0")}'`;
};

// קריאת מעלות ממבנים שונים של הספרייה
function readDegrees(maybe) {
  if (!maybe) return null;
  if (typeof maybe.longitude === "number") return maybe.longitude; // { longitude }
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
      deg, // 0..360 (לשימוש פנימי)
      signIndex: signIndex(deg),
      signName: signNameOf(deg),
      signGlyph: signGlyphOf(deg),
      degText: fmtInSign(deg), // לתצוגה 0..30
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

  return {
    ascendant: {
      deg: ascDeg,
      signIndex: signIndex(ascDeg),
      signName: signNameOf(ascDeg),
      signGlyph: signGlyphOf(ascDeg),
      degText: fmtInSign(ascDeg),
    },
    midheaven: {
      deg: mcDeg,
      signIndex: signIndex(mcDeg),
      signName: signNameOf(mcDeg),
      signGlyph: signGlyphOf(mcDeg),
      degText: fmtInSign(mcDeg),
    },
  };
}

// נורמליזציה של מפתח פלנטה למיפוי עברית
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
        retro: !!b.isRetrograde,
      };
    });
  }
  const names = [
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
  ];
  return names.map((key) => {
    let body = null;
    if (typeof horoscope?.getPlanet === "function") {
      try {
        body = horoscope.getPlanet(key);
      } catch {
        body = null;
      }
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
      retro,
    };
  });
}

// ---- היבטים ----
export const ASPECT_ANGLES = {
  conjunction: 0,
  semisextile: 30,
  sextile: 60,
  square: 90,
  trine: 120,
  quincunx: 150,
  opposition: 180,
};

// הפרש זוויתי מינימלי 0..180
const angleDiff = (a, b) => Math.abs(((a - b + 540) % 360) - 180);

// היבטים לפי מעלות (degree mode)
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
            },
            bInfo: {
              nameHe: B.nameHe,
              sign: B.signName,
              glyph: B.signGlyph,
              degText: B.degText,
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

// היבטים לפי מזלות בלבד (sign mode)
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
          },
          bInfo: {
            nameHe: B.nameHe,
            sign: B.signName,
            glyph: B.signGlyph,
            degText: B.degText,
          },
          signDistance: d,
        });
      }
    }
  }
  return res;
}

/**
 * useAstroCalc — הוק שמחשב מפה ומחזיר נתונים + היבטים
 * שימוש:
 * const { calc, result } = useAstroCalc();
 * await calc(form, { aspectMode:'degree', orb:7, aspects:['conjunction','sextile','square','trine','opposition'] });
 *
 * פרמטרים:
 * aspectMode: 'degree' | 'sign' | 'none'
 * orb: מספר (ברירת מחדל 7) — רלוונטי רק ל-'degree'
 * aspects: רשימת היבטים פעילה (מפתחות מ-ASPECT_ANGLES)
 */
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
          month: m - 1, // 0-based!
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
        if (aspectMode === "degree") {
          aspectsOut = computeAspectsByDegree(planets, { aspects, orb });
        } else if (aspectMode === "sign") {
          aspectsOut = computeAspectsBySign(planets, { aspects });
        }

        setResult({
          meta: {
            houseSystem: form.houseSystem || "placidus",
            zodiac: form.zodiac || "tropical",
          },
          angles,
          houses,
          planets,
          aspects: aspectsOut,
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
    // עזר ללקוח:
    fmtInSign,
    signNameOf,
    signGlyphOf,
    degInSign,
    SIGN_NAMES,
    SIGN_GLYPHS,
    PLANET_NAMES_HE,
    ASPECT_ANGLES,
  };
}
