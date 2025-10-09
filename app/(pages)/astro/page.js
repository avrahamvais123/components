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
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span>
          {count} • {percent}%
        </span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );

  return (
    <main
      dir="rtl"
      className="p-6 max-w-4xl mx-auto font-sans bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200"
    >
      <h1 className="mb-3 text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        מחשבון מזלות + היבטים 💫
      </h1>

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
        <section className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-center">תוצאות ✨</h2>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg mb-4 border border-blue-200 dark:border-blue-700">
            <p className="mb-2">
              <span className="font-bold text-blue-700 dark:text-blue-300">אופק (ASC):</span>{" "}
              <span className="font-mono">{result.angles.ascendant.signGlyph}</span>{" "}
              {result.angles.ascendant.signName}{" "}
              {result.angles.ascendant.degOnlyText}
            </p>
            <p>
              <span className="font-bold text-purple-700 dark:text-purple-300">MC:</span>{" "}
              <span className="font-mono">{result.angles.midheaven.signGlyph}</span>{" "}
              {result.angles.midheaven.signName}{" "}
              {result.angles.midheaven.degOnlyText}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
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
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4 text-center">
              יסודות ואיכויות 🌟
              <span className="block text-sm font-normal text-gray-600 dark:text-gray-400 mt-1">
                נלקחו בחשבון:{" "}
                {result.profile.considered
                  .map((k) => PLANET_NAMES_HE[k])
                  .join(", ") || "—"}
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {/* יסודות */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h4 className="mt-0 mb-3 text-lg font-semibold flex items-center gap-2">
                  🔥 יסודות
                </h4>
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
                  <div className="mt-3 text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                    ❌ חסרים:{" "}
                    {result.profile.elements.missing
                      .map((k) => ELEMENT_NAMES[k])
                      .join(" · ")}
                  </div>
                )}
              </div>

              {/* איכויות */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h4 className="mt-0 mb-3 text-lg font-semibold flex items-center gap-2">
                  ⚡ איכויות
                </h4>
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
                  <div className="mt-3 text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                    ❌ חסרים:{" "}
                    {result.profile.qualities.missing
                      .map((k) => QUALITY_NAMES[k])
                      .join(" · ")}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 text-center bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
              💡 ברירת מחדל לחישוב: 5 הפלנטות האישיות (ניתן לשנות למעלה)
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
