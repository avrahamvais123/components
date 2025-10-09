"use client";

import React, { useMemo, useState } from "react";
import useAstroCalc, {
  ELEMENT_KEYS,
  ELEMENT_NAMES,
  ELEMENT_COLORS,
  QUALITY_KEYS,
  QUALITY_NAMES,
  QUALITY_COLORS,
  PROFILE_DEFAULT_INCLUDE,
  PLANET_NAMES_HE,
} from "./hooks/useAstroCalc";
import { watch, store as createStore } from "hyperactiv/react";
import { useTheme } from "./hooks/useTheme";
import { PERSONAL, GENERATIONAL } from "./utils/constants";
import AstroForm from "./components/AstroForm";
import PlanetsTable from "./components/PlanetsTable";
import HousesTable from "./components/HousesTable";
import AspectsTable from "./components/AspectsTable";

/* const store = createStore({ counter: 0, test: "test" });

const Counter = watch(() => {
  console.log("store🔴: ", store);

  return (
    <div>
      <h1>Counter: {store.counter}</h1>
      <button onClick={() => (store.counter += 1)}>Click me</button>
    </div>
  );
}); */

export default function AstroPage() {
  const { isDark, tableColors } = useTheme();

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
  const [houseFormat, setHouseFormat] = useState("arabic"); // arabic או roman

  // ✅ ברירת מחדל: 5 אישיות
  const [profileKeys, setProfileKeys] = useState([...PROFILE_DEFAULT_INCLUDE]);

  const { calc, loading, error, result } = useAstroCalc();

  const run = () =>
    calc(form, {
      aspectMode,
      orb,
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

  const Bar = ({ color, percent, label, count }) => (
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          marginBottom: 4,
        }}
      >
        <span>{label}</span>
        <span>
          {count} • {percent}%
        </span>
      </div>
      <div style={{ height: 8, background: "#f3f4f6", borderRadius: 999 }}>
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: color,
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  );

  return (
    <main
      dir="rtl"
      style={{
        padding: 24,
        maxWidth: 880,
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: 12 }}>מחשבון מזלות + היבטים 💫</h1>

      <AstroForm
        form={form}
        setForm={setForm}
        aspectMode={aspectMode}
        setAspectMode={setAspectMode}
        orb={orb}
        setOrb={setOrb}
        houseFormat={houseFormat}
        setHouseFormat={setHouseFormat}
        profileKeys={profileKeys}
        setProfileKeys={setProfileKeys}
        loading={loading}
        error={error}
        onSubmit={run}
      />

      {result && (
        <section style={{ marginTop: 24 }}>
          <h2>תוצאות ✨</h2>

          <p>
            <b>אופק (ASC):</b> {result.angles.ascendant.signGlyph}{" "}
            {result.angles.ascendant.signName}{" "}
            {result.angles.ascendant.degOnlyText}
          </p>
          <p>
            <b>MC:</b> {result.angles.midheaven.signGlyph}{" "}
            {result.angles.midheaven.signName}{" "}
            {result.angles.midheaven.degOnlyText}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              marginTop: 16,
            }}
          >
            <PlanetsTable
              planets={result.planets}
              houseFormat={houseFormat}
              tableColors={tableColors}
              isDark={isDark}
            />
            <HousesTable
              houses={result.houses}
              houseFormat={houseFormat}
              tableColors={tableColors}
            />
          </div>

          {/* יסודות ואיכויות */}
          <div style={{ marginTop: 24 }}>
            <h3>
              יסודות ואיכויות (נלקחו בחשבון:{" "}
              {result.profile.considered
                .map((k) => PLANET_NAMES_HE[k])
                .join(", ") || "—"}
              )
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginTop: 8,
              }}
            >
              {/* יסודות */}
              <div
                style={{
                  border: "1px solid #eee",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <h4 style={{ marginTop: 0, marginBottom: 8 }}>יסודות</h4>
                {ELEMENT_KEYS.map((k) => (
                  <Bar
                    key={k}
                    color={ELEMENT_COLORS[k]}
                    label={`${ELEMENT_NAMES[k]}`}
                    count={result.profile.elements.counts[k]}
                    percent={result.profile.elements.percents[k]}
                  />
                ))}
                {result.profile.elements.missing.length > 0 && (
                  <div style={{ marginTop: 8, fontSize: 13, color: "#991b1b" }}>
                    חסרים:{" "}
                    {result.profile.elements.missing
                      .map((k) => ELEMENT_NAMES[k])
                      .join(" · ")}
                  </div>
                )}
              </div>

              {/* איכויות */}
              <div
                style={{
                  border: "1px solid #eee",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <h4 style={{ marginTop: 0, marginBottom: 8 }}>איכויות</h4>
                {QUALITY_KEYS.map((k) => (
                  <Bar
                    key={k}
                    color={QUALITY_COLORS[k]}
                    label={`${QUALITY_NAMES[k]}`}
                    count={result.profile.qualities.counts[k]}
                    percent={result.profile.qualities.percents[k]}
                  />
                ))}
                {result.profile.qualities.missing.length > 0 && (
                  <div style={{ marginTop: 8, fontSize: 13, color: "#991b1b" }}>
                    חסרים:{" "}
                    {result.profile.qualities.missing
                      .map((k) => QUALITY_NAMES[k])
                      .join(" · ")}
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
              * ברירת מחדל לחישוב: 5 הפלנטות האישיות (ניתן לשנות למעלה).
            </div>
          </div>

          {/* היבטים */}
          {result.aspects?.length > 0 && (
            <>
              <AspectsTable
                aspects={groupedAspects.personalsInvolved}
                title="היבטים – פלנטות אישיות (מול כולן)"
                tableColors={tableColors}
                isDark={isDark}
              />
              <AspectsTable
                aspects={groupedAspects.generationalOnly}
                title="היבטים – פלנטות דוריות עם עצמן (צדק ומעלה)"
                tableColors={tableColors}
                isDark={isDark}
              />
            </>
          )}
        </section>
      )}
    </main>
  );
}
