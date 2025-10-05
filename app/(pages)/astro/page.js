// app/astro/page.jsx
"use client";

import { useMemo, useState } from "react";
import useAstroCalc, {
  ELEMENT_KEYS, ELEMENT_NAMES, ELEMENT_COLORS,
  QUALITY_KEYS, QUALITY_NAMES, QUALITY_COLORS,
  PROFILE_ALL_KEYS, PROFILE_DEFAULT_INCLUDE, PLANET_NAMES_HE,
} from "./hooks/useAstroCalc";
import CityCombobox from "./components/CityCombobox";

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

const ASPECT_COLORS = {
  conjunction: "#6b7280", semisextile: "#f59e0b", sextile: "#16a34a",
  square: "#ef4444", trine: "#0ea5e9", quincunx: "#14b8a6", opposition: "#8b5cf6",
};

const PERSONAL = new Set(["sun","moon","mercury","venus","mars"]);
const GENERATIONAL = new Set(["jupiter","saturn","uranus","neptune","pluto"]);

export default function AstroPage() {
  const [form, setForm] = useState({
    date: "2010-03-16",
    time: "10:00",
    lat: 32.0853,
    lon: 34.7818,
    houseSystem: "placidus",
    zodiac: "tropical",
  });

  const [aspectMode, setAspectMode] = useState("sign");
  const [orb, setOrb] = useState(7);

  // ✅ ברירת מחדל: 5 אישיות
  const [profileKeys, setProfileKeys] = useState([...PROFILE_DEFAULT_INCLUDE]);

  const { calc, loading, error, result } = useAstroCalc();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onChangeNum = (e) => setForm({ ...form, [e.target.name]: parseFloat(e.target.value) });

  const toggleKey = (k) => {
    setProfileKeys((prev) =>
      prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]
    );
  };
  const selectAll  = () => setProfileKeys([...PROFILE_ALL_KEYS]);
  const clearAll   = () => setProfileKeys([]);
  const setDefault = () => setProfileKeys([...PROFILE_DEFAULT_INCLUDE]);

  const run = () => calc(form, {
    aspectMode, orb,
    profileIncludeKeys: profileKeys, // ← נעביר להוק את הבחירה
  });

  // היבטים — חלוקה
  const groupedAspects = useMemo(() => {
    const all = result?.aspects || [];
    const personalsInvolved = [];
    const generationalOnly = [];
    for (const a of all) {
      const anyPersonal = PERSONAL.has(a.a) || PERSONAL.has(a.b);
      const bothGenerational = GENERATIONAL.has(a.a) && GENERATIONAL.has(a.b);
      if (anyPersonal) personalsInvolved.push(a);
      else if (bothGenerational) generationalOnly.push(a);
    }
    return { personalsInvolved, generationalOnly };
  }, [result]);

  const AspectItem = ({ a }) => {
    const color = ASPECT_COLORS[a.type] || "#000";
    return (
      <li>
        {a.aInfo.nameHe} ({a.aInfo.glyph} {a.aInfo.sign} {a.aInfo.degOnlyText}){" "}
        <span style={{ color, fontWeight: 700 }}>↔</span>{" "}
        {a.bInfo.nameHe} ({a.bInfo.glyph} {a.bInfo.sign} {a.bInfo.degOnlyText}) —{" "}
        <b style={{ color }}>
          {labelAspect(a.type)}{a.type === "conjunction" ? " (0°)" : ""}
        </b>
        {a.mode === "degree" ? ` (אורב ${a.orb}°)` : ""}
      </li>
    );
  };

  const Bar = ({ color, percent, label, count }) => (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}>
        <span>{label}</span><span>{count} • {percent}%</span>
      </div>
      <div style={{ height:8, background:"#f3f4f6", borderRadius:999 }}>
        <div style={{ width:`${percent}%`, height:"100%", background:color, borderRadius:999 }} />
      </div>
    </div>
  );

  return (
    <main dir="rtl" style={{ padding: 24, maxWidth: 880, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: 12 }}>מחשבון מזלות + היבטים 💫</h1>

      {/* בחירת עיר */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>בחר/י עיר</label>
        <CityCombobox
          language="he"
          limit={8}
          onSelect={(place) => setForm((f) => ({ ...f, lat: place.lat, lon: place.lon }))}
        />
      </div>

      {/* טופס */}
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr", alignItems: "center" }}>
        <label>תאריך לידה
          <input name="date" type="date" value={form.date} onChange={onChange} style={{ width: "100%" }}/>
        </label>
        <label>שעת לידה
          <input name="time" type="time" value={form.time} onChange={onChange} style={{ width: "100%" }}/>
        </label>
        <label>קו רוחב
          <input name="lat" type="number" step="0.0001" value={form.lat} onChange={onChangeNum} style={{ width: "100%" }}/>
        </label>
        <label>קו אורך
          <input name="lon" type="number" step="0.0001" value={form.lon} onChange={onChangeNum} style={{ width: "100%" }}/>
        </label>
        <label>שיטת בתים
          <select name="houseSystem" value={form.houseSystem} onChange={onChange} style={{ width: "100%" }}>
            <option value="placidus">Placidus</option>
            <option value="koch">Koch</option>
            <option value="equal-house">Equal</option>
            <option value="whole-sign">Whole Sign</option>
          </select>
        </label>
        <label>זודיאק
          <select name="zodiac" value={form.zodiac} onChange={onChange} style={{ width: "100%" }}>
            <option value="tropical">Tropical</option>
            <option value="sidereal">Sidereal</option>
          </select>
        </label>

        <label>מצב היבטים
          <select value={aspectMode} onChange={(e) => setAspectMode(e.target.value)} style={{ width: "100%" }}>
            <option value="degree">לפי מעלות (עם אורב)</option>
            <option value="sign">לפי מזלות בלבד</option>
            <option value="none">ללא היבטים</option>
          </select>
        </label>
        <label>אורב (מעלות) {aspectMode !== "degree" ? "— לא בשימוש" : ""}
          <input type="number" step="0.1" value={orb} onChange={(e) => setOrb(parseFloat(e.target.value))}
                 disabled={aspectMode !== "degree"} style={{ width: "100%" }}/>
        </label>
      </div>

      {/* בחירת פלנטות לפרופיל יסודות/איכויות */}
      <div style={{ marginTop: 16, border:"1px solid #eee", borderRadius:12, padding:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
          <h3 style={{ margin:0 }}>פלנטות לחישוב יסודות/איכויות</h3>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={setDefault} style={{ padding:"6px 10px" }}>ברירת מחדל (5 אישיות)</button>
            <button onClick={selectAll} style={{ padding:"6px 10px" }}>בחר הכל</button>
            <button onClick={clearAll} style={{ padding:"6px 10px" }}>נקה הכל</button>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5, minmax(120px,1fr))", gap:8, marginTop:10 }}>
          {PROFILE_ALL_KEYS.map(k => (
            <label key={k} style={{ display:"flex", gap:6, alignItems:"center" }}>
              <input type="checkbox" checked={profileKeys.includes(k)} onChange={() => toggleKey(k)} />
              <span>{PLANET_NAMES_HE[k]}</span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button onClick={run} disabled={loading} style={{ padding: "10px 14px", fontWeight: 600 }}>
          {loading ? "מחשב/ת…" : "חשב/י מפה 🚀"}
        </button>
        {error && <span style={{ color: "crimson" }}>⚠️ {error}</span>}
      </div>

      {result && (
        <section style={{ marginTop: 24 }}>
          <h2>תוצאות ✨</h2>

          <p><b>אופק (ASC):</b> {result.angles.ascendant.signGlyph} {result.angles.ascendant.signName} {result.angles.ascendant.degOnlyText}</p>
          <p><b>MC:</b> {result.angles.midheaven.signGlyph} {result.angles.midheaven.signName} {result.angles.midheaven.degOnlyText}</p>

          <h3 style={{ marginTop: 16 }}>בתים</h3>
          <ul style={{ columns: 2, marginTop: 8 }}>
            {result.houses.map((h) => (
              <li key={h.house}>בית {h.house}: {h.signGlyph} {h.signName} {h.degOnlyText}</li>
            ))}
          </ul>

          <h3 style={{ marginTop: 16 }}>כוכבים</h3>
          <ul style={{ columns: 2, marginTop: 8 }}>
            {result.planets.map((p) => (
              <li key={p.key}>
                {p.nameHe}: {p.signGlyph} {p.signName} {p.degOnlyText}{p.retro ? " ℞" : ""}
              </li>
            ))}
          </ul>

          {/* יסודות ואיכויות */}
          <div style={{ marginTop: 24 }}>
            <h3>יסודות ואיכויות (נלקחו בחשבון: {result.profile.considered.map(k => PLANET_NAMES_HE[k]).join(", ") || "—"})</h3>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:8 }}>
              {/* יסודות */}
              <div style={{ border:"1px solid #eee", borderRadius:12, padding:12 }}>
                <h4 style={{ marginTop:0, marginBottom:8 }}>יסודות</h4>
                {ELEMENT_KEYS.map(k => (
                  <Bar
                    key={k}
                    color={ELEMENT_COLORS[k]}
                    label={`${ELEMENT_NAMES[k]}`}
                    count={result.profile.elements.counts[k]}
                    percent={result.profile.elements.percents[k]}
                  />
                ))}
                {result.profile.elements.missing.length > 0 && (
                  <div style={{ marginTop:8, fontSize:13, color:"#991b1b" }}>
                    חסרים: {result.profile.elements.missing.map(k => ELEMENT_NAMES[k]).join(" · ")}
                  </div>
                )}
              </div>

              {/* איכויות */}
              <div style={{ border:"1px solid #eee", borderRadius:12, padding:12 }}>
                <h4 style={{ marginTop:0, marginBottom:8 }}>איכויות</h4>
                {QUALITY_KEYS.map(k => (
                  <Bar
                    key={k}
                    color={QUALITY_COLORS[k]}
                    label={`${QUALITY_NAMES[k]}`}
                    count={result.profile.qualities.counts[k]}
                    percent={result.profile.qualities.percents[k]}
                  />
                ))}
                {result.profile.qualities.missing.length > 0 && (
                  <div style={{ marginTop:8, fontSize:13, color:"#991b1b" }}>
                    חסרים: {result.profile.qualities.missing.map(k => QUALITY_NAMES[k]).join(" · ")}
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop:8, fontSize:12, color:"#6b7280" }}>
              * ברירת מחדל לחישוב: 5 הפלנטות האישיות (ניתן לשנות למעלה).
            </div>
          </div>

          {/* היבטים */}
          {result.aspects?.length > 0 && (
            <>
              {groupedAspects.personalsInvolved.length > 0 && (
                <>
                  <h3 style={{ marginTop: 24 }}>היבטים – פלנטות אישיות (מול כולן)</h3>
                  <ul style={{ marginTop: 8 }}>
                    {groupedAspects.personalsInvolved.map((a, idx) => (
                      <AspectItem a={a} key={`pers-${idx}`} />
                    ))}
                  </ul>
                </>
              )}
              {groupedAspects.generationalOnly.length > 0 && (
                <>
                  <h3 style={{ marginTop: 16 }}>היבטים – פלנטות דוריות עם עצמן (צדק ומעלה)</h3>
                  <ul style={{ marginTop: 8 }}>
                    {groupedAspects.generationalOnly.map((a, idx) => (
                      <AspectItem a={a} key={`gen-${idx}`} />
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </section>
      )}
    </main>
  );
}
