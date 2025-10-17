"use client";

import { useMemo, useState } from "react";
import { labelAspect } from "../astro/utils/constants";

/** שמות מזלות (0° טלה, כל 30°) */
const SIGNS = [
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

// גליפים של המזלות לפי אינדקס 0..11
const SIGN_GLYPHS = [
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

const toSign = (deg) => SIGNS[Math.floor((((deg % 360) + 360) % 360) / 30)];
const toSignGlyph = (deg) => {
  const idx = Math.floor((((deg % 360) + 360) % 360) / 30);
  return SIGN_GLYPHS[idx] || "";
};
const pad2 = (n) => String(n).padStart(2, "0");

/** פורמט מעלה-דקה (ללא שניות) מתוך מחרוזת כמו "7° 32' 11''" => "7° 32" */
function fmtDegMin(input) {
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
function normalizeBodyKey(k) {
  const s = String(k || "").toLowerCase().trim();
  if (s === "northnode" || s === "north node" || s === "meannode" || s === "mean node" || s === "true node" || s === "truenode") {
    return "truenode";
  }
  if (s === "southnode" || s === "south node") return "southnode";
  return s;
}

// מיפוי יסודות ואיכויות לפי אינדקס מזל (0: טלה, 1: שור, ... 11: דגים)
const ELEMENT_KEY_BY_SIGN_INDEX = [
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
const QUALITY_KEY_BY_SIGN_INDEX = [
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
const ELEMENT_NAME_HE = {
  fire: "אש",
  earth: "אדמה",
  air: "אוויר",
  water: "מים",
};
const QUALITY_NAME_HE = {
  cardinal: "קרדינלי",
  fixed: "קבוע",
  mutable: "משתנה",
};

// בחירות ברירת מחדל למדדי יסודות/איכויות
const DEFAULT_STATS_KEYS = [
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

// רשימת פלנטות זמינה לבחירה (כולל אופציונליות)
const STATS_CHOICES = [
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
  "ceres",
  "pallas",
  "juno",
  "vesta",
  "chiron",
  "lilith",
  "truenode",
];

/** תרגומי פלנטות/נקודות לעברית לפי key/label נפוצים */
const PLANET_NAMES_HE_BY_KEY = {
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
  ceres: "צרס",
  pallas: "פאלס",
  juno: "ג׳ונו",
  vesta: "וסטה",
  truenode: "ראש דרקון",
  meannode: "ראש דרקון (ממוצע)",
  northnode: "ראש דרקון",
  southnode: "זנב דרקון",
  lilith: "לילית",
  ascendant: "מזל עולה",
  midheaven: "מרום השמים",
  sirius: "סיריוס",
};

/** גליפים לפלנטות/נקודות */
const PLANET_GLYPHS_BY_KEY = {
  sun: "☉",
  moon: "☾",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
  uranus: "♅",
  neptune: "♆",
  pluto: "♇",
  chiron: "⚷",
  ceres: "⚳",
  pallas: "⚴",
  juno: "⚵",
  vesta: "⚶",
  truenode: "☊",
  meannode: "☊",
  northnode: "☊",
  southnode: "☋",
  lilith: "⚸",
  ascendant: "ASC",
  midheaven: "MC",
  sirius: "★",
};
const PLANET_GLYPHS_BY_EN = {
  Sun: "☉",
  Moon: "☾",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "♇",
  Chiron: "⚷",
  Ceres: "⚳",
  Pallas: "⚴",
  Juno: "⚵",
  Vesta: "⚶",
  "True Node": "☊",
  "Mean Node": "☊",
  "North Node": "☊",
  "South Node": "☋",
  Lilith: "⚸",
  Ascendant: "ASC",
  Midheaven: "MC",
  Sirius: "★",
};

/** גליפים להיבטים */
const ASPECT_GLYPHS = {
  conjunction: "☌",
  opposition: "☍",
  trine: "△",
  square: "□",
  sextile: "✶",
  semisextile: "⚺",
  quincunx: "⚻",
};
const PLANET_NAMES_HE_BY_EN = {
  Sun: "שמש",
  Moon: "ירח",
  Mercury: "מרקורי",
  Venus: "ונוס",
  Mars: "מרס",
  Jupiter: "צדק",
  Saturn: "שבתאי",
  Uranus: "אורנוס",
  Neptune: "נפטון",
  Pluto: "פלוטו",
  Chiron: "כירון",
  Ceres: "צרס",
  Pallas: "פאלס",
  Juno: "ג׳ונו",
  Vesta: "וסטה",
  "True Node": "ראש דרקון",
  "Mean Node": "ראש דרקון (ממוצע)",
  "North Node": "ראש דרקון",
  "South Node": "זנב דרקון",
  Lilith: "לילית",
  Ascendant: "מזל עולה",
  Midheaven: "מרום השמים",
  Sirius: "סיריוס",
};

/** תרגומי בתים לעברית */
const HOUSE_ORDINALS_HE = [
  "ראשון",
  "שני",
  "שלישי",
  "רביעי",
  "חמישי",
  "שישי",
  "שביעי",
  "שמיני",
  "תשיעי",
  "עשירי",
  "אחד עשר",
  "שנים עשר",
];
const HOUSE_LABELS_HE_BY_EN = {
  First: "ראשון",
  Second: "שני",
  Third: "שלישי",
  Fourth: "רביעי",
  Fifth: "חמישי",
  Sixth: "שישי",
  Seventh: "שביעי",
  Eighth: "שמיני",
  Ninth: "תשיעי",
  Tenth: "עשירי",
  Eleventh: "אחד עשר",
  Twelfth: "שנים עשר",
};

/** נירמול מספר שייתכן ונכתב עם פסיק עשרוני */
const normalizeNum = (v) =>
  typeof v === "string" ? Number(v.replace(",", ".").trim()) : Number(v);

/** מרחק קדמי על המעגל (0–360) */
const fwd = (from, to) => (((to - from) % 360) + 360) % 360;

/** מציאת בית עבור זווית Ecliptic נתונה (deg) מול קאספי בתים (אורך כל קאספ ב-DecimalDegrees) */
function findHouseForDegree(deg, cuspsDegs) {
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
function toHebBodyName({ key, label }) {
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
function planetGlyph({ key, label }) {
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
function houseNameHe({ id, label }) {
  if (Number.isInteger(id) && id >= 1 && id <= 12)
    return HOUSE_ORDINALS_HE[id - 1];
  if (label && HOUSE_LABELS_HE_BY_EN[label])
    return HOUSE_LABELS_HE_BY_EN[label];
  return id ? `מס׳ ${id}` : "";
}

export default function AstroPage() {
  const [form, setForm] = useState({
    date: "1987-01-28",
    time: "02:30",
    lat: "31.778", // ירושלים
    lon: "35.235",
    houseSystem: "placidus",
    zodiac: "tropical",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  // בחירה אילו פלנטות יוצגו בטבלה
  const [displayKeys, setDisplayKeys] = useState([...STATS_CHOICES]);
  // בחירה אילו פלנטות נספרות ליסודות/איכויות
  const [statsIncludeKeys, setStatsIncludeKeys] = useState([
    ...DEFAULT_STATS_KEYS,
  ]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const compute = async (e) => {
    e.preventDefault();
    console.log("[astro-simple] compute() start", {
      date: form.date,
      time: form.time,
      lat: form.lat,
      lon: form.lon,
      houseSystem: form.houseSystem,
      zodiac: form.zodiac,
    });
    setLoading(true);
    setErr("");
    setResult(null);

    try {
      const { Origin, Horoscope } = await import("circular-natal-horoscope-js");

      const d = new Date(`${form.date}T${form.time}:00`);
      if (Number.isNaN(d.getTime())) throw new Error("תאריך/שעה לא תקינים.");

      const lat = normalizeNum(form.lat);
      const lon = normalizeNum(form.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        throw new Error(
          "lat/lon לא מספריים. השתמש בנקודה עשרונית (.) במקום פסיק (,)."
        );
      }

      const origin = new Origin({
        year: d.getFullYear(),
        month: d.getMonth(),
        date: d.getDate(),
        hour: d.getHours(),
        minute: d.getMinutes(),
        latitude: lat,
        longitude: lon,
      });

      const tryCompute = (houseSystem) =>
        new Horoscope({
          origin,
          houseSystem,
          zodiac: form.zodiac || "tropical",
          aspectPoints: ["bodies", "points", "angles"],
          aspectWithPoints: ["bodies", "points", "angles"],
          aspectTypes: ["major", "minor"],
          language: "en", // ננהל עברית בצד שלנו
        });

      let hs = form.houseSystem || "placidus";
      let horoscope = tryCompute(hs);
      let housesArray = Array.isArray(horoscope.Houses) ? horoscope.Houses : [];

      if (housesArray.length !== 12) {
        hs = "whole-sign";
        horoscope = tryCompute(hs);
        housesArray = Array.isArray(horoscope.Houses) ? horoscope.Houses : [];
      }
      if (housesArray.length !== 12) {
        throw new Error(
          "לא חזרו 12 בתים. בדוק houseSystem, תאריך/שעה וקואורדינטות."
        );
      }

      const bodies = horoscope?.CelestialBodies?.all ?? [];
      // איסוף נקודות נוספות (לילית וראש דרקון) אם אינן כלולות ב-CelestialBodies
      const cp =
        horoscope?._celestialPoints ||
        horoscope?.CelestialPoints ||
        horoscope?.celestialPoints ||
        null;

  let pointsExt = [];
      if (cp && typeof cp === "object") {
        const pick = (obj, names) => {
          for (const n of names) {
            if (obj?.[n] != null) return obj[n];
            const lower = n.toLowerCase();
            // נסיונות השמה שונים במפתח
            for (const k of Object.keys(obj)) {
              if (k.toLowerCase() === lower) return obj[k];
            }
          }
          return null;
        };

        const lilithObj = pick(cp, ["lilith", "blackMoon", "blackmoon", "black_moon"]);
        if (lilithObj?.ChartPosition?.Ecliptic) {
          pointsExt.push({ key: "lilith", label: "Lilith", ...lilithObj });
        }
        const nodeObj = pick(cp, [
          "trueNode",
          "truenode",
          "northnode",
          "northNode",
          "node",
        ]);
        if (nodeObj?.ChartPosition?.Ecliptic) {
          pointsExt.push({ key: "truenode", label: "True Node", ...nodeObj });
        }
        // ארבעת האסטרואידים
        const ceresObj = pick(cp, ["ceres"]);
        if (ceresObj?.ChartPosition?.Ecliptic) {
          pointsExt.push({ key: "ceres", label: "Ceres", ...ceresObj });
        }
        const pallasObj = pick(cp, ["pallas"]);
        if (pallasObj?.ChartPosition?.Ecliptic) {
          pointsExt.push({ key: "pallas", label: "Pallas", ...pallasObj });
        }
        const junoObj = pick(cp, ["juno"]);
        if (junoObj?.ChartPosition?.Ecliptic) {
          pointsExt.push({ key: "juno", label: "Juno", ...junoObj });
        }
        const vestaObj = pick(cp, ["vesta"]);
        if (vestaObj?.ChartPosition?.Ecliptic) {
          pointsExt.push({ key: "vesta", label: "Vesta", ...vestaObj });
        }
      }
      // נסיון להרחיב אסטרואידים דרך ה-API בצד השרת (Swiss Ephemeris)
      try {
        // מחולל טקסט 0-30° בסגנון הספרייה (עם שניות לאפס, כדי שהמפרמט הקיים יעבוד)
        const arcFmt30 = (deg) => {
          const norm = ((deg % 360) + 360) % 360;
          const d30 = norm % 30;
          const d = Math.floor(d30);
          let m = Math.round((d30 - d) * 60);
          if (m === 60) { m = 0; }
          return `${d}° ${String(m).padStart(2, "0")}' 00''`;
        };

        console.log("[astro-simple] calling /api/astro/calculate", {
          date: form.date,
          time: form.time,
          lat,
          lon,
          houseSystem: hs,
          zodiac: form.zodiac || "tropical",
          asteroids: ["ceres", "pallas", "juno", "vesta"],
        });

        const resp = await fetch("/api/astro/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: form.date,
            time: form.time,
            lat: lat,
            lon: lon,
            houseSystem: hs,
            zodiac: form.zodiac || "tropical",
            aspectMode: "degree",
            orb: 7,
            asteroids: ["ceres", "pallas", "juno", "vesta"],
          }),
        });
        console.log("[astro-simple] API response status:", resp.status, resp.statusText);
        if (resp.ok) {
          const data = await resp.json();
          console.log("[astro-simple] API /api/astro/calculate response:", data);
          const planets = Array.isArray(data?.data?.planets)
            ? data.data.planets
            : [];
          console.log("[astro-simple] aspects from API:", data?.data?.aspects);
          const desired = new Set(["ceres", "pallas", "juno", "vesta"]);
          const apiExt = planets
            .filter((p) => desired.has(String(p?.key || "").toLowerCase()))
            .map((p) => ({
              key: String(p.key).toLowerCase(),
              label: p.key[0].toUpperCase() + String(p.key).slice(1),
              ChartPosition: {
                Ecliptic: {
                  DecimalDegrees: p.deg,
                  ArcDegreesFormatted30: arcFmt30(p.deg),
                },
              },
            }));
          console.log("[astro-simple] asteroids from API:", apiExt);
          if (apiExt.length) pointsExt = [...pointsExt, ...apiExt];
        } else {
          let text = null;
          try { text = await resp.text(); } catch {}
          console.warn("[astro-simple] API not ok:", resp.status, resp.statusText, text);
        }
      } catch (err) {
        // אם ה-API לא זמין, פשוט נמשיך ללא אסטרואידים
        console.warn("[astro-simple] failed to fetch asteroids from API", err?.message || err);
      }

      // הערה: ביטלנו fallback של SwissEph בצד לקוח כדי למנוע בעיות טעינת WASM בדפדפן.
      const aspects = horoscope?.Aspects?.all ?? [];
      const asc = horoscope?.Ascendant;
      const mc = horoscope?.Midheaven;

      console.log("[astro-simple] pointsExt keys before setResult:", pointsExt.map(p => p.key));
      setResult({
        bodies,
        aspects,
        asc,
        mc,
        houses: housesArray.map((h, idx) => {
          const start = h?.ChartPosition?.StartPosition?.Ecliptic;
          return {
            num: idx + 1,
            degDecimal: start?.DecimalDegrees,
            degFmt30: start?.ArcDegreesFormatted30,
          };
        }),
        pointsExt,
      });
    } catch (e) {
      console.error(e);
      setErr(e?.message || "בעיה בחישוב המפה.");
    } finally {
      setLoading(false);
    }
  };

  /** קאספים כמעלות דצימליות (ל־fallback חישוב בית לגופים) */
  const cuspsDegs = useMemo(() => {
    if (!result?.houses || result.houses.length !== 12) return null;
    return result.houses.map((h) => h.degDecimal);
  }, [result]);

  /** פלנטות/נקודות — עם תרגום לעברית ובית בעברית */
  const niceBodies = useMemo(() => {
    if (!result?.bodies) return [];
    // מזג פלנטות + נקודות נוספות (ללא כפילויות לפי key)
    const src = [...(result.bodies || []), ...((result.pointsExt || []))].filter(Boolean);
    const byKey = new Map();
    for (const b of src) {
      const k = normalizeBodyKey(b?.key || b?.id || "");
      if (!byKey.has(k)) byKey.set(k, b);
    }
    return Array.from(byKey.values()).map((b) => {
      const key = normalizeBodyKey(b?.key || b?.id || "");
      const labelHe = toHebBodyName({ key, label: b?.label });
      const glyph = planetGlyph({ key, label: b?.label });
      const retro = b?.isRetrograde ? "℞" : "";
      const deg = b?.ChartPosition?.Ecliptic?.DecimalDegrees;
      const deg30 = b?.ChartPosition?.Ecliptic?.ArcDegreesFormatted30;
  const deg30Short = fmtDegMin(deg30);
      const sign = Number.isFinite(deg) ? toSign(deg) : "";
      const signGlyph = Number.isFinite(deg) ? toSignGlyph(deg) : "";
      const signIndex = Number.isFinite(deg)
        ? Math.floor((((deg % 360) + 360) % 360) / 30)
        : null;

      // בית מהספרייה
      const libHouseNum = b?.House?.id ?? null; // 1..12
      const libHouseLabelHe = b?.House
        ? houseNameHe({ id: b.House.id, label: b.House.label })
        : null;

      // fallback לפי קאספים
      const calcHouseNum = cuspsDegs
        ? findHouseForDegree(deg, cuspsDegs)
        : null;
      const houseNum = libHouseNum ?? calcHouseNum;
      const houseLabelHe =
        (libHouseNum && libHouseLabelHe) ||
        (Number.isInteger(houseNum) ? HOUSE_ORDINALS_HE[houseNum - 1] : null);

      return {
        key,
        labelHe,
        glyph,
        retro,
        sign,
        signGlyph,
          signIndex,
        deg30,
        deg30Short,
        houseNum,
        houseLabelHe,
      };
    });
  }, [result, cuspsDegs]);

  // סטטיסטיקות יסודות ואיכויות מתוך פלנטות מרכזיות
  const { elementStats, qualityStats } = useMemo(() => {
    const includeKeys = new Set(
      (statsIncludeKeys || []).map((k) => String(k || "").toLowerCase())
    );

    const filtered = (niceBodies || []).filter((b) =>
      includeKeys.has(String(b.key || "").toLowerCase())
    );
    const total = filtered.length || 0;

    const elemCounts = { fire: 0, earth: 0, air: 0, water: 0 };
    const qualCounts = { cardinal: 0, fixed: 0, mutable: 0 };

    for (const b of filtered) {
      if (Number.isInteger(b?.signIndex)) {
        const eKey = ELEMENT_KEY_BY_SIGN_INDEX[b.signIndex];
        const qKey = QUALITY_KEY_BY_SIGN_INDEX[b.signIndex];
        if (eKey) elemCounts[eKey] += 1;
        if (qKey) qualCounts[qKey] += 1;
      }
    }

    const toPercents = (counts) => {
      const out = {};
      for (const [k, v] of Object.entries(counts)) {
        out[k] = total ? Math.round((v * 100) / total) : 0;
      }
      return out;
    };

    const elementStats = {
      total,
      counts: elemCounts,
      percents: toPercents(elemCounts),
      missing: Object.keys(elemCounts).filter((k) => elemCounts[k] === 0),
    };
    const qualityStats = {
      total,
      counts: qualCounts,
      percents: toPercents(qualCounts),
      missing: Object.keys(qualCounts).filter((k) => qualCounts[k] === 0),
    };

    return { elementStats, qualityStats };
  }, [niceBodies, statsIncludeKeys]);

  /** בתים — נציג שם בעברית */
  const niceHouses = useMemo(() => {
    if (!result?.houses) return [];
    return result.houses.map((h) => {
      const sign = Number.isFinite(h.degDecimal) ? toSign(h.degDecimal) : "-";
      const signGlyph = Number.isFinite(h.degDecimal)
        ? toSignGlyph(h.degDecimal)
        : "";
      const labelHe = Number.isInteger(h.num)
        ? HOUSE_ORDINALS_HE[h.num - 1]
        : `מס׳ ${h.num}`;
      return {
        num: h.num,
        labelHe,
        sign,
        signGlyph,
        degFmt: h.degFmt30 || "-",
      };
    });
  }, [result]);

  // פלנטות לתצוגה לפי בחירת המשתמש
  const displayedBodies = useMemo(() => {
    const allow = new Set(
      (displayKeys || []).map((k) => String(k || "").toLowerCase())
    );
    return (niceBodies || []).filter((b) =>
      allow.has(String(b.key || "").toLowerCase())
    );
  }, [niceBodies, displayKeys]);

  /** היבטים — מתורגמים לעברית (שם היבט ושמות נקודות) */
  const niceAspects = useMemo(() => {
    if (!result?.aspects) return [];
    return result.aspects.map((a) => {
      const p1En = a?.point1Label || a?.point1 || "";
      const p2En = a?.point2Label || a?.point2 || "";
      // נסה לגזור סוג היבט ממספר שדות נפוצים בספריות שונות
      const typeRaw =
        a?.type ??
        a?.aspect ??
        a?.aspectType ??
        a?.name ??
        a?.label ??
        a?.Type ??
        a?.Aspect ??
        "";
      // תרגום שמות נקודות
      const p1 = toHebBodyName({ label: p1En }) || p1En;
      const p2 = toHebBodyName({ label: p2En }) || p2En;
      const p1Glyph = planetGlyph({ label: p1En });
      const p2Glyph = planetGlyph({ label: p2En });
      // תרגום סוג היבט
      const typeKey =
        typeof typeRaw === "string" ? typeRaw.trim().toLowerCase() : "";
      const type =
        (typeKey && labelAspect(typeKey)) ||
        (typeof typeRaw === "string" ? typeRaw : "");
      const typeGlyph = typeKey ? ASPECT_GLYPHS[typeKey] || "" : "";
      const orb = typeof a?.orb === "number" ? a.orb.toFixed(2) : a?.orb;
      return { p1, p2, p1Glyph, p2Glyph, type, typeGlyph, orb };
    });
  }, [result]);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8" dir="rtl">
      <h1 className="text-2xl font-bold">מחשבון מפת לידה</h1>

      {/* טופס קלט */}
      <form onSubmit={compute} className="grid md:grid-cols-2 gap-4 items-end">
        <label className="flex flex-col gap-1">
          <span>תאריך לידה</span>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={onChange}
            className="border rounded p-2"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span>שעת לידה (מקומית)</span>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={onChange}
            className="border rounded p-2"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span>קו־רוחב (lat)</span>
          <input
            type="text"
            inputMode="decimal"
            name="lat"
            value={form.lat}
            onChange={onChange}
            className="border rounded p-2"
            placeholder="לדוגמה: 31.778"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span>קו־אורך (lon)</span>
          <input
            type="text"
            inputMode="decimal"
            name="lon"
            value={form.lon}
            onChange={onChange}
            className="border rounded p-2"
            placeholder="לדוגמה: 35.235"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span>House System</span>
          <select
            name="houseSystem"
            value={form.houseSystem}
            onChange={onChange}
            className="border rounded p-2"
          >
            <option value="placidus">Placidus</option>
            <option value="whole-sign">Whole Sign</option>
            <option value="equal-house">Equal</option>
            <option value="koch">Koch</option>
            <option value="regiomontanus">Regiomontanus</option>
            <option value="campanus">Campanus</option>
            <option value="topocentric">Topocentric</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span>Zodiac</span>
          <select
            name="zodiac"
            value={form.zodiac}
            onChange={onChange}
            className="border rounded p-2"
          >
            <option value="tropical">Tropical</option>
            <option value="sidereal">Sidereal</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-black text-white rounded p-3"
        >
          {loading ? "מחשב..." : "חשב מפה"}
        </button>
      </form>

      {err && <p className="text-red-600">{err}</p>}

      {/* תוצאות */}
      {result && (
        <section className="space-y-10">
          {/* פלנטות ונקודות */}
          <div>
            <h2 className="text-xl font-semibold mb-2">פלנטות ונקודות</h2>
            {/* בחירת פלנטות לתצוגה בטבלה */}
            <div className="mb-3 border rounded p-3">
              <div className="font-medium mb-2">בחר פלנטות לתצוגה</div>
              <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
                {STATS_CHOICES.map((k) => {
                  const checked = displayKeys.includes(k);
                  const nameHe = PLANET_NAMES_HE_BY_KEY[k] || k;
                  return (
                    <label key={k} className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-black"
                        checked={checked}
                        onChange={(e) => {
                          setDisplayKeys((prev) => {
                            const set = new Set(prev);
                            if (e.target.checked) set.add(k);
                            else set.delete(k);
                            return Array.from(set);
                          });
                        }}
                      />
                      <span>{nameHe}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 border">שם</th>
                    <th className="p-2 border">מזל</th>
                    <th className="p-2 border">מעלה (0–30)</th>
                    <th className="p-2 border">בית</th>
                    <th className="p-2 border">R</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedBodies.map((b) => (
                    <tr key={b.key}>
                      <td className="p-2 border">
                        <span className="inline-flex items-center gap-2">
                          <span>{b.glyph}</span>
                          <span>{b.labelHe}</span>
                        </span>
                      </td>
                      <td className="p-2 border">
                        <span className="inline-flex items-center gap-2">
                          <span>{b.signGlyph}</span>
                          <span>{b.sign}</span>
                        </span>
                      </td>
                      <td className="p-2 border">{b.deg30Short || "-"}</td>
                      <td className="p-2 border">
                        {Number.isInteger(b.houseNum) ? b.houseNum : "-"}
                      </td>
                      <td className="p-2 border">{b.retro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* סטטיסטיקות יסודות ואיכויות */}
          <div>
            <h2 className="text-xl font-semibold mb-2">חלוקת יסודות ואיכויות</h2>
            {/* בחירת פלנטות לחישוב הסטטיסטיקות */}
            <div className="mb-3 border rounded p-3">
              <div className="font-medium mb-2">בחר פלנטות לחישוב</div>
              <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
                {STATS_CHOICES.map((k) => {
                  const checked = statsIncludeKeys.includes(k);
                  const nameHe = PLANET_NAMES_HE_BY_KEY[k] || k;
                  return (
                    <label key={k} className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-black"
                        checked={checked}
                        onChange={(e) => {
                          setStatsIncludeKeys((prev) => {
                            const set = new Set(prev);
                            if (e.target.checked) set.add(k);
                            else set.delete(k);
                            return Array.from(set);
                          });
                        }}
                      />
                      <span>{nameHe}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded p-3">
                <div className="font-bold mb-2">יסודות</div>
                <ul className="space-y-1">
                  {(["fire", "earth", "air", "water"]).map((k) => (
                    <li key={k} className="flex justify-between">
                      <span>{ELEMENT_NAME_HE[k]}</span>
                      <span>{elementStats.percents[k]}%</span>
                    </li>
                  ))}
                </ul>
                {elementStats.missing.length > 0 && (
                  <div className="text-sm text-muted-foreground mt-2">
                    חסרים: {elementStats.missing.map((k) => ELEMENT_NAME_HE[k]).join(", ")}
                  </div>
                )}
              </div>
              <div className="border rounded p-3">
                <div className="font-bold mb-2">איכויות</div>
                <ul className="space-y-1">
                  {(["cardinal", "fixed", "mutable"]).map((k) => (
                    <li key={k} className="flex justify-between">
                      <span>{QUALITY_NAME_HE[k]}</span>
                      <span>{qualityStats.percents[k]}%</span>
                    </li>
                  ))}
                </ul>
                {qualityStats.missing.length > 0 && (
                  <div className="text-sm text-muted-foreground mt-2">
                    חסרים: {qualityStats.missing.map((k) => QUALITY_NAME_HE[k]).join(", ")}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* קאספים של הבתים */}
          {Array.isArray(result?.houses) && result.houses.length === 12 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">קאספים של הבתים</h2>
              <div className="grid md:grid-cols-3 gap-2">
                {niceHouses.map((h) => (
                  <div key={h.num} className="border rounded p-3">
                    <div className="font-bold">
                      בית {h.labelHe} ({h.num})
                    </div>
                    <div>
                      מזל:{" "}
                      <span className="inline-flex items-center gap-2">
                        <span>{h.signGlyph}</span>
                        <span>{h.sign}</span>
                      </span>
                    </div>
                    <div>מעלה: {h.degFmt}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* היבטים */}
          <div>
            <h2 className="text-xl font-semibold mb-2">היבטים</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 border">נק׳ 1</th>
                    <th className="p-2 border">סוג</th>
                    <th className="p-2 border">נק׳ 2</th>
                    <th className="p-2 border">אורב</th>
                  </tr>
                </thead>
                <tbody>
                  {niceAspects.map((a, i) => (
                    <tr key={i}>
                      <td className="p-2 border">
                        <span className="inline-flex items-center gap-2">
                          <span>{a.p1Glyph}</span>
                          <span>{a.p1}</span>
                        </span>
                      </td>
                      <td className="p-2 border">
                        <span className="inline-flex items-center gap-2">
                          <span>{a.typeGlyph}</span>
                          <span>{a.type}</span>
                        </span>
                      </td>
                      <td className="p-2 border">
                        <span className="inline-flex items-center gap-2">
                          <span>{a.p2Glyph}</span>
                          <span>{a.p2}</span>
                        </span>
                      </td>
                      <td className="p-2 border">{a.orb}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ASC & MC */}
          <div className="grid md:grid-cols-2 gap-4">
            <CardAngle title="מזל עולה (ASC)" obj={result.asc} />
            <CardAngle title="מרום השמים (MC)" obj={result.mc} />
          </div>
        </section>
      )}
    </main>
  );
}

/** כרטיס זווית (ASC/MC) */
function CardAngle({ title, obj }) {
  if (!obj) return null;
  const deg = obj?.ChartPosition?.Ecliptic?.DecimalDegrees;
  const sign = Number.isFinite(deg) ? toSign(deg) : "";
  const signGlyph = Number.isFinite(deg) ? toSignGlyph(deg) : "";
  const fmt = obj?.ChartPosition?.Ecliptic?.ArcDegreesFormatted30;
  return (
    <div className="border rounded p-4">
      <div className="font-semibold">{title}</div>
      <div>
        מזל:{" "}
        <span className="inline-flex items-center gap-2">
          <span>{signGlyph}</span>
          <span>{sign || "-"}</span>
        </span>
      </div>
      <div>מעלה: {fmt || "-"}</div>
    </div>
  );
}
