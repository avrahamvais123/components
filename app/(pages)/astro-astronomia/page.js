"use client";
import { useEffect, useState } from "react";

// ייבוא ממוקד בלבד (מצמצם bundle):
import julian from "astronomia/julian";
import planetposition from "astronomia/planetposition";
import moonposition from "astronomia/moonposition";
import elliptic from "astronomia/elliptic";
import nutation from "astronomia/nutation";
import coord from "astronomia/coord";

// VSOP87 (בחירה ידנית של מה שצריך)
import vsop87Bearth from "astronomia/data/vsop87Bearth";
import vsop87Bmercury from "astronomia/data/vsop87Bmercury";
import vsop87Bvenus from "astronomia/data/vsop87Bvenus";
import vsop87Bmars from "astronomia/data/vsop87Bmars";
import vsop87Bjupiter from "astronomia/data/vsop87Bjupiter";
import vsop87Bsaturn from "astronomia/data/vsop87Bsaturn";
import vsop87Buranus from "astronomia/data/vsop87Buranus";
import vsop87Bneptune from "astronomia/data/vsop87Bneptune";

// פלוטו – מודולים ייעודיים (אין VSOP לקובץ Pluto)
import pluto from "astronomia/pluto";
import solarxyz from "astronomia/solarxyz";
import solar from "astronomia/solar";

// חישוב בתים/זוויות בצד-לקוח
import { Origin, Horoscope } from "circular-natal-horoscope-js";
// עזרי תצוגה בעברית
import {
  signNameHe,
  signSymbol,
  planetSymbol,
  formatDegMinutes,
  degWithinSign,
  PLANETS_HE,
} from "@/utils/astro-he";
// זיהוי אזור זמן לפי קואורדינטות
import tzlookup from "tz-lookup";
import moment from "moment-timezone";

function toJulianUTC(y, m, d, hh = 0, mm = 0, ss = 0, tz = 0) {
  const H = hh + mm / 60 + ss / 3600 - tz; // UTC decimal hours
  return julian.CalendarToJD(y, m, d) + H / 24; // JD (UT)
}

// עזר: המרה מרדיאנים למעלות
const radToDeg = (rad) => rad * (180 / Math.PI);

// נרמול לזווית 0..360
const norm360 = (x) => {
  const y = x % 360;
  return y < 0 ? y + 360 : y;
};

// הפרש כיווני (b - a) בטווח [0..360)
const angDiff = (a, b) => norm360(b - a);

// חילוץ מעלות הקוספים (בית 1..12) כמספרים 0..360
function extractHouseCuspsDegrees(houses) {
  if (!houses) return null;
  let list = null;
  if (Array.isArray(houses)) {
    list = houses;
  } else if (Array.isArray(houses?.all)) {
    list = houses.all;
  } else if (typeof houses === "object") {
    // נסיון: אובייקט עם מפתחות 1..12 או house1..house12
    const entries = Object.entries(houses);
    const sorted = entries
      .map(([k, v]) => {
        let idx = null;
        if (/^\d+$/.test(k)) idx = parseInt(k, 10) - 1;
        else if (/^house\d+$/.test(k)) idx = parseInt(k.replace("house", ""), 10) - 1;
        return idx != null && idx >= 0 && idx < 12 ? { idx, v } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.idx - b.idx);
    if (sorted.length === 12) list = sorted.map((x) => x.v);
  }

  if (!Array.isArray(list) || list.length < 12) return null;

  const arr = list.map((h) => {
    if (typeof h === "number") return norm360(h);
    // נסיונות נפוצים לשדות בתוך האובייקט
    const d1 = h?.Ecliptic?.DecimalDegrees;
    const d2 = h?.ChartPosition?.Ecliptic?.DecimalDegrees;
    const d3 = h?.Ecliptic?.ArcDegrees?.DecimalDegrees;
    const d4 = h?.DecimalDegrees;
    const d = [d1, d2, d3, d4].find((v) => typeof v === "number");
    return typeof d === "number" ? norm360(d) : NaN;
  });
  if (arr.some((v) => Number.isNaN(v))) return null;
  return arr;
}

// מציאת בית (1..12) עבור אורך אקליפטי מסוים
function findHouse(cuspsDeg, lonDeg) {
  if (!cuspsDeg) return null;
  const L = norm360(lonDeg);
  for (let i = 0; i < 12; i++) {
    const ci = cuspsDeg[i];
    const cnext = cuspsDeg[(i + 1) % 12];
    const dToL = angDiff(ci, L);
    const dSpan = angDiff(ci, cnext);
    if (dToL >= 0 && dToL < dSpan) return i + 1; // בתים ממוספרים 1..12
  }
  return null;
}

// חילוץ מעלות מאובייקט זווית/בית ב-Horoscope
function extractAngleDeg(obj) {
  if (!obj || typeof obj !== "object") return null;
  const numVal = (v) => {
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const p = parseFloat(v);
      return Number.isFinite(p) ? p : null;
    }
    return null;
  };

  // ניסיון מסלולים נפוצים ל-DecimalDegrees
  const candidates = [
    obj?.Ecliptic?.DecimalDegrees,
    obj?.ChartPosition?.Ecliptic?.DecimalDegrees,
    obj?.Ecliptic?.ArcDegrees?.DecimalDegrees,
    obj?.DecimalDegrees,
    obj?.EclipticDecimalDegrees,
  ];
  for (const c of candidates) {
    const n = numVal(c);
    if (n != null) return norm360(n);
  }

  // ניסיון דרך ArcDegrees {degrees, minutes, seconds}
  const arcCandidates = [
    obj?.Ecliptic?.ArcDegrees,
    obj?.ChartPosition?.Ecliptic?.ArcDegrees,
    obj?.ArcDegrees,
  ];
  for (const a of arcCandidates) {
    const d = numVal(a?.degrees);
    const m = numVal(a?.minutes) || 0;
    const s = numVal(a?.seconds) || 0;
    if (d != null) {
      return norm360(d + m / 60 + s / 3600);
    }
  }

  // ניסיון לפענח מחרוזת "180° 38' 2''"
  const fmtCandidates = [
    obj?.Ecliptic?.ArcDegreesFormatted,
    obj?.ChartPosition?.Ecliptic?.ArcDegreesFormatted,
    obj?.ArcDegreesFormatted,
  ];
  for (const f of fmtCandidates) {
    if (typeof f === "string") {
      const match = f.match(/(-?\d+(?:\.\d+)?)°\s*(\d+)'\s*(\d+)?/);
      if (match) {
        const d = parseFloat(match[1]);
        const m = parseFloat(match[2] || "0");
        const s = parseFloat(match[3] || "0");
        return norm360(d + m / 60 + s / 3600);
      }
    }
  }

  return null;
}

// פלוטו גיאו־צנטרי (Meeus): פלוטו הליו־צנטרי - ארץ הליו־צנטרית
function plutoGeocentricLonLatDeg(jd, E) {
  const { lon: lam, lat: bet, range: r } = pluto.heliocentric(jd); // הליו-צנטרי (רדיאנים, AU)

  // פלוטו הליו-צנטרי → מלבני
  const xP = r * Math.cos(bet) * Math.cos(lam);
  const yP = r * Math.cos(bet) * Math.sin(lam);
  const zP = r * Math.sin(bet);

  // מיקום הארץ הליו-צנטרי = -(מיקום השמש הגיאו-צנטרי)
  const { x: xS, y: yS, z: zS } = solarxyz.position(E, jd); // AU
  const xE = -xS,
    yE = -yS,
    zE = -zS;

  // פלוטו גיאו-צנטרי
  const x = xP - xE,
    y = yP - yE,
    z = zP - zE;

  const lon = Math.atan2(y, x);
  const lat = Math.atan2(z, Math.hypot(x, y));
  return { longitude: radToDeg(lon), latitude: radToDeg(lat) };
}

export default function AstronomiaClientDemo() {
  const [out, setOut] = useState(null);
  const [form, setForm] = useState({
    date: "1987-01-28", // YYYY-MM-DD
    time: "02:30", // HH:mm
    latitude: 31.7683, // ירושלים
    longitude: 35.2137, // ירושלים
    houseSystem: "placidus",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(0);

  const computeChart = async () => {
    try {
      setLoading(true);
      setError(0);
      const [y, m, d] = form.date.split("-").map((v) => parseInt(v, 10)); // m: 1..12
      const [hh, mm] = form.time.split(":").map((v) => parseInt(v, 10));
      const second = 0;
      const lat = Number(form.latitude);
      const lon = Number(form.longitude);
      const houseSystem = form.houseSystem;

      // קביעת אזור הזמן לפי קואורדינטות ותאריך
      const tzName = tzlookup(lat, lon);
      const mLocal = moment.tz({ year: y, month: m - 1, day: d, hour: hh, minute: mm, second }, tzName);
      const tzOffset = mLocal.utcOffset() / 60; // שעות

      // 1) זמן יוליאני (UTC)
      const jd = toJulianUTC(y, m, d, hh, mm, second, tzOffset);

      // 2) אובייקטים של VSOP87
      const E = new planetposition.Planet(vsop87Bearth);
      const P = {
        mercury: new planetposition.Planet(vsop87Bmercury),
        venus: new planetposition.Planet(vsop87Bvenus),
        mars: new planetposition.Planet(vsop87Bmars),
        jupiter: new planetposition.Planet(vsop87Bjupiter),
        saturn: new planetposition.Planet(vsop87Bsaturn),
        uranus: new planetposition.Planet(vsop87Buranus),
        neptune: new planetposition.Planet(vsop87Bneptune),
      };

      const posPlanet = (pl) => {
        // מיקום גיאוצנטרי-אפארנטי של פלנטה: RA/DEC → המרה חזרה לאקליפטי
        const eq = elliptic.position(pl, E, jd); // { ra, dec }
        const [_, dEps] = nutation.nutation(jd);
        const eps = nutation.meanObliquity(jd) + dEps;
        const ecl = new coord.Equatorial(eq.ra, eq.dec).toEcliptic(eps);
        return { longitude: radToDeg(ecl.lon), latitude: radToDeg(ecl.lat) };
      };

      const posMoon = () => {
        const m = moonposition.position(jd); // lon/lat ברדיאנים
        return {
          longitude: radToDeg(m.lon),
          latitude: radToDeg(m.lat),
        };
      };

      // שמש: שימוש בפונקציה הייעודית מהספרייה (מיקום גיאוצנטרי אפארנטי)
      const sunGeo = solar.apparentVSOP87(E, jd);
      const positions = {
        sun: { longitude: radToDeg(sunGeo.lon), latitude: radToDeg(sunGeo.lat) },
        moon: posMoon(),
        mercury: posPlanet(P.mercury),
        venus: posPlanet(P.venus),
        mars: posPlanet(P.mars),
        jupiter: posPlanet(P.jupiter),
        saturn: posPlanet(P.saturn),
        uranus: posPlanet(P.uranus),
        neptune: posPlanet(P.neptune),
        pluto: plutoGeocentricLonLatDeg(jd, E),
      };

      // 3) בתים/ASC/MC בעזרת circular-natal-horoscope-js
      const origin = new Origin({
        year: y,
        month: m - 1,
        date: d,
        hour: hh,
        minute: mm,
        latitude: lat,
        longitude: lon,
      });
      const horoscope = new Horoscope({ origin, houseSystem, zodiac: "tropical" });
      const houses = horoscope.Houses;
      const angles = { ascendant: horoscope.Ascendant, midheaven: horoscope.Midheaven };

      setOut({ input: { tzName, tzOffset, y, m, d, hh, mm, lat, lon, houseSystem }, jd, positions, houses, angles });
    } catch (e) {
      console.error(e);
      setError(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    computeChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // חישוב אוטומטי בעת שינוי הקלט (debounce) כדי שהמזלות יתעדכנו מידית
  useEffect(() => {
    const t = setTimeout(() => {
      computeChart();
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.date, form.time, form.latitude, form.longitude, form.houseSystem]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  if (!out) return <div>מחשב מיקום כוכבים… ✨</div>;

  // בניית נתוני תצוגה לפלנטות
  const planetOrder = [
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
  const cusps = extractHouseCuspsDegrees(out.houses);
  const ascDeg = extractAngleDeg(out.angles?.ascendant);
  const mcDeg = extractAngleDeg(out.angles?.midheaven);
  const ascRow = ascDeg != null ? {
    label: "ASC",
    signSym: signSymbol(ascDeg),
    signName: signNameHe(ascDeg),
    degStr: formatDegMinutes(degWithinSign(ascDeg)),
  } : null;
  const mcRow = mcDeg != null ? {
    label: "MC",
    signSym: signSymbol(mcDeg),
    signName: signNameHe(mcDeg),
    degStr: formatDegMinutes(degWithinSign(mcDeg)),
  } : null;
  const rows = planetOrder.map((key) => {
    const p = out.positions?.[key];
    if (!p || typeof p.longitude !== "number") return null;
    const lon = norm360(p.longitude);
    const signSym = signSymbol(lon);
    const signName = signNameHe(lon);
    const degInSign = degWithinSign(lon);
    const house = findHouse(cusps, lon);
    return {
      key,
      name: key,
      symbol: planetSymbol(key),
      signSym,
      signName,
      degStr: formatDegMinutes(degInSign),
      house,
    };
  }).filter(Boolean);

  return (
    <div className="min-h-[calc(100dvh-4rem)] p-6 max-w-6xl mx-auto">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-center text-primary">
          מחשבון אסטרולוגי - מפת לידה 🌟
        </h1>
        {/* טופס קלט נתוני לידה */}
        <form
          className="grid md:grid-cols-6 gap-3 items-end bg-white p-4 rounded shadow"
          onSubmit={(e) => {
            e.preventDefault();
            computeChart();
          }}
        >
          <label className="flex flex-col text-sm">
            תאריך (מקומי)
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={onChange}
              className="border rounded p-2"
            />
          </label>
          <label className="flex flex-col text-sm">
            שעה (מקומית)
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={onChange}
              className="border rounded p-2"
            />
          </label>
          <label className="flex flex-col text-sm">
            רוחב (lat)
            <input
              type="number"
              name="latitude"
              step="0.0001"
              value={form.latitude}
              onChange={onChange}
              className="border rounded p-2"
            />
          </label>
          <label className="flex flex-col text-sm">
            אורך (lon)
            <input
              type="number"
              name="longitude"
              step="0.0001"
              value={form.longitude}
              onChange={onChange}
              className="border rounded p-2"
            />
          </label>
          <label className="flex flex-col text-sm">
            שיטת בתים
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
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white rounded p-2 md:col-span-1"
          >
            חשב
          </button>
        </form>
        {error ? (
          <div className="text-red-600 text-sm">אירעה שגיאה בעת חישוב המפה. בדוק את הקלט.</div>
        ) : null}
        {/* טבלה מסכמת של הפלנטות: סימן, מעלות ובית */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white rounded shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right p-2">פלנטה</th>
                <th className="text-right p-2">מזל</th>
                <th className="text-right p-2">מעלות</th>
                <th className="text-right p-2">בית</th>
              </tr>
            </thead>
            <tbody>
              {ascRow || mcRow ? (
                <tr className="border-b">
                  <td className="p-2 whitespace-nowrap">
                    {ascRow ? `ASC` : ""} {ascRow ? `${ascRow.signSym} ${ascRow.signName} ${ascRow.degStr}` : ""}
                    {mcRow ? ` | MC ${mcRow.signSym} ${mcRow.signName} ${mcRow.degStr}` : ""}
                  </td>
                  <td className="p-2" colSpan={3}></td>
                </tr>
              ) : null}
              {rows.map((r) => (
                <tr key={r.key} className="border-b last:border-none">
                  <td className="p-2 whitespace-nowrap">{r.symbol} {PLANETS_HE[r.key] || r.name}</td>
                  <td className="p-2 whitespace-nowrap">{r.signSym} {r.signName}</td>
                  <td className="p-2 whitespace-nowrap">{r.degStr}</td>
                  <td className="p-2 whitespace-nowrap">{r.house != null ? `בית ${r.house}` : "?"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* קוספי הבתים 1..12 */}
        {(() => {
          const cuspsDbg = extractHouseCuspsDegrees(out.houses);
          return Array.isArray(cuspsDbg) && cuspsDbg.length >= 12 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm bg-white rounded shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right p-2">בית</th>
                  <th className="text-right p-2">מזל</th>
                  <th className="text-right p-2">מעלות</th>
                </tr>
              </thead>
              <tbody>
                {cuspsDbg.map((d, idx) => {
                  if (d == null) return (
                    <tr key={idx} className="border-b last:border-none">
                      <td className="p-2 whitespace-nowrap">{idx + 1}</td>
                      <td className="p-2 whitespace-nowrap">—</td>
                      <td className="p-2 whitespace-nowrap">—</td>
                    </tr>
                  );
                  return (
                    <tr key={idx} className="border-b last:border-none">
                      <td className="p-2 whitespace-nowrap">{idx + 1}</td>
                      <td className="p-2 whitespace-nowrap">{signSymbol(d)} {signNameHe(d)}</td>
                      <td className="p-2 whitespace-nowrap">{formatDegMinutes(degWithinSign(d))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          ) : null;
        })()}
        {loading ? (
          <div className="text-sm text-gray-500">מחשב לפי הנתונים החדשים…</div>
        ) : null}
        <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
          {JSON.stringify({
            tz: out?.input?.tzName,
            housesSample: extractHouseCuspsDegrees(out.houses),
            housesRawType: typeof out.houses,
            housesKeys: out.houses && typeof out.houses === 'object' ? Object.keys(out.houses) : null,
            ascDeg,
            mcDeg,
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
