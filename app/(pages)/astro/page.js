// app/astro/page.jsx
"use client";

/**
 * מחשבון מזלות+בתים – קליינט בלבד
 * ספרייה: circular-natal-horoscope-js
 * מציג דרגות בתוך המזל (0–30) בפורמט d°mm'
 */

import { useState } from "react";

// שמות המזלות בעברית
const SIGN_NAMES = [
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
const signOf = (deg) =>
  SIGN_NAMES[Math.floor((((deg % 360) + 360) % 360) / 30)];

// ---------- עזר למעלות בתוך מזל ----------
const norm360 = (deg) => ((deg % 360) + 360) % 360; // נרמול ל-0..360
const degInSign = (deg) => norm360(deg) % 30; // 0..30 בתוך המזל
const fmtInSign = (deg) => {
  // פורמט d°mm'
  const x = degInSign(deg);
  let d = Math.floor(x);
  let m = Math.round((x - d) * 60);
  if (m === 60) {
    d += 1;
    m = 0;
  } // מניעת 29°60'
  return `${d}°${String(m).padStart(2, "0")}'`;
};

// ---------- קריאת מעלות ממבנים שונים שהספרייה מחזירה ----------
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

// ---------- הפקת בתים ----------
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
    return { house: i + 1, deg, sign: signOf(deg) };
  });
}

// ---------- הפקת אופק/MC ----------
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
    ascendant: { deg: ascDeg, sign: signOf(ascDeg) },
    midheaven: { deg: mcDeg, sign: signOf(mcDeg) },
  };
}

// ---------- הפקת פלנטות ----------
function extractPlanets(horoscope) {
  const all = horoscope?.CelestialBodies?.all;
  if (Array.isArray(all) && all.length) {
    return all.map((b) => {
      const deg = readDegrees(b) ?? 0;
      return {
        key: b.key || b.name || "body",
        deg,
        sign: signOf(deg),
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
  const out = [];
  for (const key of names) {
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
    out.push({ key, deg, sign: signOf(deg), retro });
  }
  return out;
}

export default function AstroPage() {
  const [form, setForm] = useState({
    date: "2010-03-16", // YYYY-MM-DD
    time: "10:00", // HH:mm – שעת לידה מקומית
    lat: 32.0853, // תל אביב – דוגמה
    lon: 34.7818,
    houseSystem: "placidus", // 'placidus' | 'koch' | 'equal-house' | 'whole-sign' | ...
    zodiac: "tropical", // 'tropical' | 'sidereal'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  console.log('result: ', result);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onChangeNum = (e) =>
    setForm({ ...form, [e.target.name]: parseFloat(e.target.value) });

  const calc = async () => {
    setErr("");
    setResult(null);
    setLoading(true);
    try {
      // ייבוא דינמי כדי לא לשבור SSR ולהקטין bundle ראשוני
      const { Origin, Horoscope } = await import("circular-natal-horoscope-js");

      // פירוק תאריך/שעה – חודש ב-Origin מבוסס 0
      const [y, m, d] = String(form.date).split("-").map(Number);
      const [hh, mm] = String(form.time).split(":").map(Number);

      if (!y || !m || !d || isNaN(hh) || isNaN(mm)) {
        throw new Error("תאריך/שעה אינם תקינים");
      }
      if (typeof form.lat !== "number" || typeof form.lon !== "number") {
        throw new Error("קו רוחב/אורך אינם תקינים");
      }

      const origin = new Origin({
        year: y,
        month: m - 1, // חשוב!
        date: d,
        hour: hh,
        minute: mm,
        latitude: form.lat,
        longitude: form.lon,
      });

      const horoscope = new Horoscope({
        origin,
        houseSystem: form.houseSystem,
        zodiac: form.zodiac,
      });

      const angles = extractAngles(horoscope);
      const houses = extractHouses(horoscope);
      const planets = extractPlanets(horoscope);

      setResult({
        angles,
        houses,
        planets,
        meta: { houseSystem: form.houseSystem, zodiac: form.zodiac },
      });
    } catch (e) {
      console.error(e);
      setErr(e?.message || "שגיאה בחישוב המפה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        padding: 24,
        maxWidth: 780,
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: 12 }}>
        מחשבון מזלות ובתים – קליינט בלבד 💫🪐
      </h1>

      <div
        style={{
          display: "grid",
          gap: 10,
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
        }}
      >
        <label>
          תאריך לידה
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={onChange}
            style={{ width: "100%" }}
          />
        </label>
        <label>
          שעת לידה
          <input
            name="time"
            type="time"
            value={form.time}
            onChange={onChange}
            style={{ width: "100%" }}
          />
        </label>
        <label>
          קו רוחב (Latitude)
          <input
            name="lat"
            type="number"
            step="0.0001"
            value={form.lat}
            onChange={onChangeNum}
            style={{ width: "100%" }}
          />
        </label>
        <label>
          קו אורך (Longitude)
          <input
            name="lon"
            type="number"
            step="0.0001"
            value={form.lon}
            onChange={onChangeNum}
            style={{ width: "100%" }}
          />
        </label>
        <label>
          שיטת בתים
          <select
            name="houseSystem"
            value={form.houseSystem}
            onChange={onChange}
            style={{ width: "100%" }}
          >
            <option value="placidus">Placidus</option>
            <option value="koch">Koch</option>
            <option value="equal-house">Equal</option>
            <option value="whole-sign">Whole Sign</option>
            <option value="regiomontanus">Regiomontanus</option>
            <option value="campanus">Campanus</option>
            <option value="topocentric">Topocentric</option>
          </select>
        </label>
        <label>
          גלגל זודיאק
          <select
            name="zodiac"
            value={form.zodiac}
            onChange={onChange}
            style={{ width: "100%" }}
          >
            <option value="tropical">Tropical</option>
            <option value="sidereal">Sidereal</option>
          </select>
        </label>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button
          onClick={calc}
          disabled={loading}
          style={{ padding: "10px 14px", fontWeight: 600 }}
        >
          {loading ? "מחשב/ת…" : "חשב/י מפה 🚀"}
        </button>
        {err && <span style={{ color: "crimson" }}>⚠️ {err}</span>}
      </div>

      {result && (
        <section style={{ marginTop: 24 }}>
          <h2>תוצאות ✨</h2>
          <p>
            <b>אופק (ASC):</b> {result.angles.ascendant.sign}{" "}
            {fmtInSign(result.angles.ascendant.deg)}{" "}
            <small title={`${result.angles.ascendant.deg.toFixed(2)}° ecl`}>
              ({result.angles.ascendant.deg.toFixed(2)}°)
            </small>
          </p>
          <p>
            <b>MC:</b> {result.angles.midheaven.sign}{" "}
            {fmtInSign(result.angles.midheaven.deg)}{" "}
            <small title={`${result.angles.midheaven.deg.toFixed(2)}° ecl`}>
              ({result.angles.midheaven.deg.toFixed(2)}°)
            </small>
          </p>

          <h3 style={{ marginTop: 16 }}>בתים</h3>
          <ul style={{ columns: 2, marginTop: 8 }}>
            {result.houses.map((h) => (
              <li key={h.house}>
                בית {h.house}: {h.sign} {fmtInSign(h.deg)}{" "}
                <small title={`${h.deg.toFixed(2)}° ecl`}>
                  ({h.deg.toFixed(2)}°)
                </small>
              </li>
            ))}
          </ul>

          <h3 style={{ marginTop: 16 }}>כוכבים</h3>
          <ul style={{ columns: 2, marginTop: 8 }}>
            {result.planets.map((p) => (
              <li key={p.key}>
                {p.key}: {p.sign} {fmtInSign(p.deg)}
                {p.retro ? " ℞" : ""}{" "}
                <small title={`${p.deg.toFixed(2)}° ecl`}>
                  ({p.deg.toFixed(2)}°)
                </small>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
