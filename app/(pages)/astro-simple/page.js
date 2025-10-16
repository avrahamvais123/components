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

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const compute = async (e) => {
    e.preventDefault();
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
      const aspects = horoscope?.Aspects?.all ?? [];
      const asc = horoscope?.Ascendant;
      const mc = horoscope?.Midheaven;

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
    return result.bodies.filter(Boolean).map((b) => {
      const key = b?.key || b?.id || "";
      const labelHe = toHebBodyName({ key, label: b?.label });
      const glyph = planetGlyph({ key, label: b?.label });
      const retro = b?.isRetrograde ? "℞" : "";
      const deg = b?.ChartPosition?.Ecliptic?.DecimalDegrees;
      const deg30 = b?.ChartPosition?.Ecliptic?.ArcDegreesFormatted30;
  const deg30Short = fmtDegMin(deg30);
      const sign = Number.isFinite(deg) ? toSign(deg) : "";
      const signGlyph = Number.isFinite(deg) ? toSignGlyph(deg) : "";

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
        deg30,
        deg30Short,
        houseNum,
        houseLabelHe,
      };
    });
  }, [result, cuspsDegs]);

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
                  {niceBodies.map((b) => (
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
