const SIGNS_EN = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const SIGNS_HE = [
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

// סימני המזלות
export const SIGNS_SYMBOLS = [
  "♈", // Aries - טלה
  "♉", // Taurus - שור
  "♊", // Gemini - תאומים
  "♋", // Cancer - סרטן
  "♌", // Leo - אריה
  "♍", // Virgo - בתולה
  "♎", // Libra - מאזניים
  "♏", // Scorpio - עקרב
  "♐", // Sagittarius - קשת
  "♑", // Capricorn - גדי
  "♒", // Aquarius - דלי
  "♓", // Pisces - דגים
];

export const PLANETS_EN = [
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
export const PLANETS_HE = {
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

// סימני הפלנטות
export const PLANETS_SYMBOLS = {
  sun: "☉",     // שמש
  moon: "☽",    // ירח
  mercury: "☿", // מרקורי
  venus: "♀",   // ונוס
  mars: "♂",    // מרס
  jupiter: "♃", // צדק
  saturn: "♄",  // שבתאי
  uranus: "♅",  // אורנוס
  neptune: "♆", // נפטון
  pluto: "♇",   // פלוטו
};

// נרמול לזווית 0..360
function norm360(x) {
  const y = x % 360;
  return y < 0 ? y + 360 : y;
}

// ממעלות לאורך המזלות (0..360) לשם מזל (עברית)
export function signNameHe(longitudeDd) {
  const idx = Math.floor(norm360(longitudeDd) / 30);
  return SIGNS_HE[idx];
}

// ממעלות לאורך המזלות לסימן המזל
export function signSymbol(longitudeDd) {
  const idx = Math.floor(norm360(longitudeDd) / 30);
  return SIGNS_SYMBOLS[idx];
}

// קבלת סימן הפלנטה
export function planetSymbol(planetKey) {
  return PLANETS_SYMBOLS[planetKey] || "?";
}

// קבלת כל המזלות עם הסימנים שלהם
export function getAllSigns() {
  return SIGNS_HE.map((name, idx) => ({
    name,
    symbol: SIGNS_SYMBOLS[idx],
    english: SIGNS_EN[idx],
    index: idx,
  }));
}

// קבלת כל הפלנטות עם הסימנים שלהם
export function getAllPlanets() {
  return PLANETS_EN.map(key => ({
    key,
    name: PLANETS_HE[key],
    symbol: PLANETS_SYMBOLS[key],
    english: key,
  }));
}

// כמה מעלות בתוך המזל (0..30)
export function degWithinSign(longitudeDd) {
  return norm360(longitudeDd) % 30;
}

// פורמט מעלות → "13°40′" (ללא שניות, אפשר להוסיף אם תרצה)
export function formatDegMinutes(dd) {
  const d = Math.floor(dd);
  const m = Math.round((dd - d) * 60);
  const mm = m.toString().padStart(2, "0");
  return `${d}°${mm}′`;
}

// ממיר Ephemeris.getAllPlanets -> אובייקט בעברית מוכן לשימוש/תצוגה
export function ephemToHebrew(ephem) {
  const obs = ephem?.observed ?? {};
  const out = {
    תאריך: ephem?.date?.gregorianUniversal || "",
    צופה: {
      אורך: ephem?.observer?.longitudeGeodetic,
      רוחב: ephem?.observer?.latitudeGeodetic,
      גובה: ephem?.observer?.heightGeodetic,
    },
    פלנטות: {},
  };

  for (const key of PLANETS_EN) {
    const p = obs[key];
    const heName = PLANETS_HE[key];
    if (!p || typeof p.apparentLongitudeDd !== "number") continue;

    const lon = p.apparentLongitudeDd;
    const sign = signNameHe(lon);
    const signSym = signSymbol(lon);
    const planetSym = planetSymbol(key);
    const degInSign = degWithinSign(lon);
    
    out.פלנטות[heName] = {
      מזל: sign,
      סימןמזל: signSym,
      סימןפלנטה: planetSym,
      מעלות: Number(degInSign.toFixed(2)),
      תצוגה: `${planetSym} ${heName} ב${signSym} ${sign} ${formatDegMinutes(degInSign)}`,
      תצוגהקצרה: `${planetSym} ${signSym} ${formatDegMinutes(degInSign)}`,
      נסיגה: !!p.is_retrograde,
    };
  }
  return out;
}
