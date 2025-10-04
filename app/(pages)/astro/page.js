// app/astro/page.jsx
"use client";

import { useState } from "react";
import useAstroCalc from "./hooks/useAstroCalc";

function labelAspect(type) {
  const map = {
    conjunction: "צמידות",
    semisextile: "חצי־שישית (30°)",
    sextile: "שישית (60°)",
    square: "ריבוע (90°)",
    trine: "טריין (120°)",
    quincunx: "קווינקנקס (150°)",
    opposition: "מולות (180°)",
  };
  return map[type] || type;
}

export default function AstroPage() {
  const [form, setForm] = useState({
    date: "2010-03-16",
    time: "10:00",
    lat: 32.0853,
    lon: 34.7818,
    houseSystem: "placidus",
    zodiac: "tropical",
  });

  const [aspectMode, setAspectMode] = useState("sign"); // 'degree' | 'sign' | 'none'
  const [orb, setOrb] = useState(7); // רלוונטי רק ל-degree

  const { calc, loading, error, result } = useAstroCalc();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onChangeNum = (e) =>
    setForm({ ...form, [e.target.name]: parseFloat(e.target.value) });

  const run = () => calc(form, { aspectMode, orb });

  return (
    <main
      dir="rtl"
      style={{
        padding: 24,
        maxWidth: 780,
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: 12 }}>מחשבון מזלות + היבטים 💫</h1>

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
          קו רוחב
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
          קו אורך
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
          </select>
        </label>
        <label>
          זודיאק
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

        <label>
          מצב היבטים
          <select
            value={aspectMode}
            onChange={(e) => setAspectMode(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="degree">לפי מעלות (עם אורב)</option>
            <option value="sign">לפי מזלות בלבד</option>
            <option value="none">ללא היבטים</option>
          </select>
        </label>
        <label>
          אורב (מעלות) {aspectMode !== "degree" ? "— לא בשימוש" : ""}
          <input
            type="number"
            step="0.1"
            value={orb}
            onChange={(e) => setOrb(parseFloat(e.target.value))}
            disabled={aspectMode !== "degree"}
            style={{ width: "100%" }}
          />
        </label>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button
          onClick={run}
          disabled={loading}
          style={{ padding: "10px 14px", fontWeight: 600 }}
        >
          {loading ? "מחשב/ת…" : "חשב/י מפה 🚀"}
        </button>
        {error && <span style={{ color: "crimson" }}>⚠️ {error}</span>}
      </div>

      {result && (
        <section style={{ marginTop: 24 }}>
          <h2>תוצאות ✨</h2>

          <p>
            <b>אופק (ASC):</b> {result.angles.ascendant.signGlyph}{" "}
            {result.angles.ascendant.signName} {result.angles.ascendant.degText}
          </p>
          <p>
            <b>MC:</b> {result.angles.midheaven.signGlyph}{" "}
            {result.angles.midheaven.signName} {result.angles.midheaven.degText}
          </p>

          <h3 style={{ marginTop: 16 }}>בתים</h3>
          <ul style={{ columns: 2, marginTop: 8 }}>
            {result.houses.map((h) => (
              <li key={h.house}>
                בית {h.house}: {h.signGlyph} {h.signName} {h.degText}
              </li>
            ))}
          </ul>

          <h3 style={{ marginTop: 16 }}>כוכבים</h3>
          <ul style={{ columns: 2, marginTop: 8 }}>
            {result.planets.map((p) => (
              <li key={p.key}>
                {p.nameHe}: {p.signGlyph} {p.signName} {p.degText}
                {p.retro ? " ℞" : ""}
              </li>
            ))}
          </ul>

          {result.aspects?.length > 0 && (
            <>
              <h3 style={{ marginTop: 16 }}>היבטים</h3>
              <ul style={{ marginTop: 8 }}>
                {result.aspects.map((a, idx) => (
                  <li key={idx}>
                    {a.aInfo.nameHe} ({a.aInfo.glyph} {a.aInfo.sign}{" "}
                    {a.aInfo.degText}) ↔ {a.bInfo.nameHe} ({a.bInfo.glyph}{" "}
                    {a.bInfo.sign} {a.bInfo.degText}) —{" "}
                    <b>{labelAspect(a.type)}</b>
                    {a.mode === "degree"
                      ? ` (אורב ${a.orb}°)`
                      : ` (מרחק מזלות ${a.signDistance})`}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </main>
  );
}
