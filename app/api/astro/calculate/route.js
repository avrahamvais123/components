// app/api/astro/calculate/route.js
import { NextResponse } from 'next/server';

// מזלות
const SIGN_NAMES = [
  "טלה", "שור", "תאומים", "סרטן", "אריה", "בתולה",
  "מאזניים", "עקרב", "קשת", "גדי", "דלי", "דגים",
];

const SIGN_GLYPHS = [
  "♈︎", "♉︎", "♊︎", "♋︎", "♌︎", "♍︎",
  "♎︎", "♏︎", "♐︎", "♑︎", "♒︎", "♓︎",
];

// פלנטות בעברית
const PLANET_NAMES_HE = {
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
  lilith: "לילית",
  ceres: "צרס",
  pallas: "פאלס",
  juno: "ג׳ונו",
  vesta: "וסטה",
};

const PROFILE_ALL_KEYS = [
  "sun", "moon", "mercury", "venus", "mars",
  "jupiter", "saturn", "uranus", "neptune", "pluto", "chiron", "sirius", "lilith",
];

const PROFILE_DEFAULT_INCLUDE = ["sun", "moon", "mercury", "venus", "mars"];

// יסודות ואיכויות
const ELEMENT_KEYS = ["fire", "earth", "air", "water"];
const ELEMENT_NAMES = {
  fire: "אש", earth: "אדמה", air: "אוויר", water: "מים",
};
const ELEMENT_COLORS = {
  fire: "#ef4444", earth: "#8b5cf6", air: "#0ea5e9", water: "#14b8a6",
};

const QUALITY_KEYS = ["cardinal", "fixed", "mutable"];
const QUALITY_NAMES = {
  cardinal: "קרדינלי", fixed: "קבוע", mutable: "משתנה",
};
const QUALITY_COLORS = {
  cardinal: "#f59e0b", fixed: "#16a34a", mutable: "#64748b",
};

// פונקציות עזר
const norm360 = (deg) => ((deg % 360) + 360) % 360;
const signIndex = (deg) => Math.floor(norm360(deg) / 30);
const signNameOf = (deg) => SIGN_NAMES[signIndex(deg)];
const signGlyphOf = (deg) => SIGN_GLYPHS[signIndex(deg)];
const degInSign = (deg) => norm360(deg) % 30;

const fmtInSign = (deg) => {
  const x = degInSign(deg);
  let d = Math.floor(x);
  let m = Math.round((x - d) * 60);
  if (m === 60) {
    d += 1;
    m = 0;
  }
  return `${d}°${String(m).padStart(2, "0")}'`;
};

const fmtInSignDec = (deg, decimals = 2) =>
  `${degInSign(deg).toFixed(decimals)}°`;

const fmtInSignDegOnly = (deg) => `${Math.floor(degInSign(deg))}°`;

// חישוב יום יוליאני
const toJulianDayUT = (y, m, d, hh, mm = 0) => {
  // המרה פשוטה ל-Date ואז ל-JD באומדן, נשתמש בספרייה אם זמינה
  const date = new Date(Date.UTC(y, m - 1, d, hh, mm, 0));
  const JD_UNIX_EPOCH = 2440587.5; // 1970-01-01T00:00:00Z
  return date.getTime() / 86400000 + JD_UNIX_EPOCH;
};

// חישוב אסטרואידים עם SwissEph אם זמין; מחזיר [{key, deg}]
async function computeAsteroidsSwiss({ y, m, d, hh, mm, zodiac, asteroids }) {
  try {
    const swe = await import("swisseph-wasm");
    // ייתכן ונדרש אתחול/טעינה; ננסה אם יש פונקציה לכך
    if (typeof swe?.default === "function") {
      // חלק מהחבילות מייצאות init כברירת מחדל
      await swe.default();
    }
    const jd = toJulianDayUT(y, m, d, hh, mm);
    const out = [];
    const nameToNum = {
      ceres: 1,
      pallas: 2,
      juno: 3,
      vesta: 4,
    };
    // דגלים בסיסיים: חישוב גאוצנטרי, טרופי
    const SEFLG_SWIEPH = swe.SEFLG_SWIEPH || 2;
    const SEFLG_SPEED = swe.SEFLG_SPEED || 256;
    const flags = SEFLG_SWIEPH | SEFLG_SPEED;
    for (const k of asteroids) {
      const id = nameToNum[k];
      if (!id) continue;
      // בקוד Swiss מקורי יש offset לאסטרואידים; ננסה גם בלי וגם עם offset
      const SE_AST_OFFSET = swe.SE_AST_OFFSET || 10000;
      let code = id + SE_AST_OFFSET;
      let res = null;
      try {
        res = swe.swe_calc_ut ? swe.swe_calc_ut(jd, code, flags) : null;
      } catch {}
      // ניסיון ללא offset אם נכשל
      if (!res || res?.rc < 0) {
        try {
          res = swe.swe_calc_ut ? swe.swe_calc_ut(jd, id, flags) : null;
        } catch {}
      }
      const lon = Array.isArray(res?.xx) ? res.xx[0] : null;
      if (typeof lon === "number" && isFinite(lon)) {
        out.push({ key: k, deg: ((lon % 360) + 360) % 360 });
      }
    }
    return out;
  } catch (e) {
    console.warn("SwissEph not available or failed:", e?.message || e);
    return [];
  }
}

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

// חילוץ בתים
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

// חילוץ זויות
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

// חישוב בית של פלנטה
function findHouseForPlanet(planetDeg, houses) {
  if (!houses || houses.length === 0) return null;
  
  for (let i = 0; i < houses.length; i++) {
    const currentHouse = houses[i];
    const nextHouse = houses[(i + 1) % houses.length];
    
    const start = currentHouse.deg;
    let end = nextHouse.deg;
    
    if (end < start) {
      end += 360;
    }
    
    let normalizedPlanetDeg = planetDeg;
    if (planetDeg < start && end > 360) {
      normalizedPlanetDeg += 360;
    }
    
    if (normalizedPlanetDeg >= start && normalizedPlanetDeg < end) {
      return currentHouse.house;
    }
  }
  
  return 1;
}

const normalizePlanetKey = (k) =>
  String(k || "").trim().toLowerCase();

// חילוץ פלנטות
function extractPlanets(horoscope, houses = []) {
  // נשתמש תמיד ברשימה הקבועה כדי לוודא שכל הפלנטות כלולות, כולל לילית
  const names = [...PROFILE_ALL_KEYS];
  return names.map((key) => {
    let body = null;
    if (typeof horoscope?.getPlanet === "function") {
      try {
        body = horoscope.getPlanet(key);
      } catch {}
    }
    if (!body) body = horoscope?.CelestialBodies?.[key] || null;
    
    // טיפול מיוחד בלילית - נקודה שמיימית
    if (key === "lilith" && !body) {
      try {
        body = horoscope?._celestialPoints?.lilith;
      } catch {}
    }

    const deg =
      readDegrees(body) ??
      (typeof body?.longitude === "number" ? body.longitude : 0);
    const retro = !!(body?.isRetrograde || body?.retrograde);
    const house = findHouseForPlanet(deg, houses);
    return {
      key,
      nameHe: PLANET_NAMES_HE[key] || key,
      deg,
      house,
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
const ASPECT_ANGLES = {
  conjunction: 0,
  semisextile: 30,
  sextile: 60,
  square: 90,
  trine: 120,
  quincunx: 150,
  opposition: 180,
};

const angleDiff = (a, b) => Math.abs(((a - b + 540) % 360) - 180);

function computeAspectsByDegree(planets, { aspects = ["conjunction", "sextile", "square", "trine", "opposition"], orb = 7 } = {}) {
  const res = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const A = planets[i], B = planets[j];
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

function computeAspectsBySign(planets, { aspects = ["conjunction", "sextile", "square", "trine", "opposition"] } = {}) {
  const signDist = (aIdx, bIdx) => {
    const d = Math.abs(aIdx - bIdx) % 12;
    return d > 6 ? 12 - d : d;
  };
  const byDist = {
    0: "conjunction", 1: "semisextile", 2: "sextile",
    3: "square", 4: "trine", 5: "quincunx", 6: "opposition",
  };
  const res = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const A = planets[i], B = planets[j];
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

// פרופיל יסודות/איכויות
const SIGN_TO_ELEMENT = [
  "fire", "earth", "air", "water", "fire", "earth",
  "air", "water", "fire", "earth", "air", "water",
];

const SIGN_TO_QUALITY = [
  "cardinal", "fixed", "mutable", "cardinal", "fixed", "mutable",
  "cardinal", "fixed", "mutable", "cardinal", "fixed", "mutable",
];

function computeProfile(planets, { includeKeys, excludeKeys } = {}) {
  let include =
    Array.isArray(includeKeys) && includeKeys.length
      ? new Set(includeKeys)
      : new Set(PROFILE_DEFAULT_INCLUDE);

  if (Array.isArray(excludeKeys) && excludeKeys.length) {
    for (const k of excludeKeys) include.delete(k);
  }

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
    considered: [...include],
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

// API Handler
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      // נתוני הטופס
      date,
      time,
      lat,
      lon,
      houseSystem = "placidus",
      zodiac = "tropical",
      
  // הגדרות היבטים
  aspectMode = "degree",
      orb = 7,
      aspects = ["conjunction", "sextile", "square", "trine", "opposition"],
      
      // הגדרות פרופיל
      profileIncludeKeys,
      profileExcludeKeys,
      // אסטרואידים אופציונליים
      asteroids = ["ceres", "pallas", "juno", "vesta"],
    } = body;

    // ולידציה בסיסית
    if (!date || !time || typeof lat !== "number" || typeof lon !== "number") {
      return NextResponse.json(
        { 
          success: false, 
          error: "נתונים חסרים או לא תקינים",
          details: "נדרשים: date, time, lat, lon" 
        },
        { status: 400 }
      );
    }

    // ולידציה לאורב
    if (aspectMode === "degree") {
      const numOrb = parseFloat(orb);
      if (isNaN(numOrb) || numOrb < 0 || numOrb > 30) {
        return NextResponse.json(
          { 
            success: false, 
            error: "אורב לא תקין",
            details: "האורב חייב להיות מספר בין 0 ל-30 מעלות" 
          },
          { status: 400 }
        );
      }
    }

    // ייבוא הספרייה
    const { Origin, Horoscope } = await import("circular-natal-horoscope-js");

    // פירוק התאריך והשעה
    const [y, m, d] = String(date).split("-").map(Number);
    const [hh, mm] = String(time).split(":").map(Number);

    if (!y || !m || !d || isNaN(hh) || isNaN(mm)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "פורמט תאריך או שעה לא תקין" 
        },
        { status: 400 }
      );
    }

    // יצירת המפה האסטרולוגית
    const origin = new Origin({
      year: y,
      month: m - 1,
      date: d,
      hour: hh,
      minute: mm,
      latitude: lat,
      longitude: lon,
    });

    const horoscope = new Horoscope({
      origin,
      houseSystem,
      zodiac,
    });

    // חישוב הנתונים
    const angles = extractAngles(horoscope);
    const houses = extractHouses(horoscope);
    let planets = extractPlanets(horoscope, houses);

    // נסה להוסיף אסטרואידים אם נתבקש
    if (Array.isArray(asteroids) && asteroids.length) {
      const jdDate = { y, m, d, hh, mm };
      const astros = await computeAsteroidsSwiss({ ...jdDate, zodiac, asteroids });
      if (astros.length) {
        for (const a of astros) {
          const deg = a.deg;
          const house = findHouseForPlanet(deg, houses);
          planets.push({
            key: a.key,
            nameHe: PLANET_NAMES_HE[a.key] || a.key,
            deg,
            house,
            signIndex: signIndex(deg),
            signName: signNameOf(deg),
            signGlyph: signGlyphOf(deg),
            degText: fmtInSign(deg),
            degDecText: fmtInSignDec(deg),
            degOnlyText: fmtInSignDegOnly(deg),
            retro: false,
          });
        }
      }
    }

    let aspectsOut = [];
    if (aspectMode === "degree") {
      aspectsOut = computeAspectsByDegree(planets, { aspects, orb });
    } else if (aspectMode === "sign") {
      aspectsOut = computeAspectsBySign(planets, { aspects });
    }

    // דיבאג: כמה היבטים חושבו
    try {
      console.log("[astro-api] aspects computed", {
        mode: aspectMode,
        count: Array.isArray(aspectsOut) ? aspectsOut.length : 0,
      });
    } catch {}

    const profile = computeProfile(planets, {
      includeKeys: profileIncludeKeys,
      excludeKeys: profileExcludeKeys,
    });

    // החזרת התוצאות
    return NextResponse.json({
      success: true,
      data: {
        meta: {
          houseSystem,
          zodiac,
          timestamp: new Date().toISOString(),
          input: { date, time, lat, lon },
        },
        angles,
        houses,
        planets,
        aspects: aspectsOut,
        profile,
      },
    });

  } catch (error) {
    console.error("Astro API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "שגיאה בחישוב המפה האסטרולוגית",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// GET לדוגמה או מידע על ה-API
export async function GET() {
  return NextResponse.json({
    message: "API לחישוב מפות אסטרולוגיות",
    version: "1.0.0",
    endpoints: {
      POST: "/api/astro/calculate",
    },
    requiredFields: ["date", "time", "lat", "lon"],
    optionalFields: [
      "houseSystem", 
      "zodiac", 
      "aspectMode", 
      "orb", 
      "aspects",
      "profileIncludeKeys", 
      "profileExcludeKeys"
    ],
    example: {
      date: "2010-03-16",
      time: "10:00",
      lat: 32.0853,
      lon: 34.7818,
      houseSystem: "placidus",
      zodiac: "tropical",
      aspectMode: "degree",
      orb: 7,
      profileIncludeKeys: ["sun", "moon", "mercury", "venus", "mars"]
    }
  });
}
