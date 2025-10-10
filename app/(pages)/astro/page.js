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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {count} • {percent}%
        </span>
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
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
      className="container mx-auto p-6 max-w-5xl space-y-6"
    >
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
          מחשבון מזלות + היבטים 💫
        </h1>
        <p className="text-muted-foreground">
          חישוב מפה אסטרולוגית מלאה עם היבטים ופרופיל יסודות
        </p>
      </div>

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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                ✨ תוצאות חישוב
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <div className="text-2xl">{result.angles.ascendant.signGlyph}</div>
                  <div>
                    <div className="font-semibold text-blue-700 dark:text-blue-300">אופק (ASC)</div>
                    <div className="text-sm text-muted-foreground">
                      {result.angles.ascendant.signName} {result.angles.ascendant.degOnlyText}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                  <div className="text-2xl">{result.angles.midheaven.signGlyph}</div>
                  <div>
                    <div className="font-semibold text-purple-700 dark:text-purple-300">MC</div>
                    <div className="text-sm text-muted-foreground">
                      {result.angles.midheaven.signName} {result.angles.midheaven.degOnlyText}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-center flex flex-col items-center gap-2">
                <span className="flex items-center gap-2">🌟 יסודות ואיכויות</span>
                <span className="text-sm font-normal text-muted-foreground">
                  נלקחו בחשבון: {result.profile.considered.map((k) => PLANET_NAMES_HE[k]).join(", ") || "—"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* יסודות */}
                <Card className="transition-all duration-300 hover:shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      🔥 יסודות
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {ELEMENT_KEYS.map((k) => (
                      <Bar
                        key={k}
                        color={ELEMENT_COLORS[k]}
                        label={ELEMENT_NAMES[k]}
                        count={result.profile.elements.counts[k]}
                        percent={result.profile.elements.percents[k]}
                      />
                    ))}
                    {result.profile.elements.missing.length > 0 && (
                      <div className="mt-4 text-xs text-destructive bg-destructive/10 border border-destructive/20 p-2 rounded-lg">
                        ❌ חסרים: {result.profile.elements.missing.map((k) => ELEMENT_NAMES[k]).join(" · ")}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* איכויות */}
                <Card className="transition-all duration-300 hover:shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      ⚡ איכויות
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {QUALITY_KEYS.map((k) => (
                      <Bar
                        key={k}
                        color={QUALITY_COLORS[k]}
                        label={QUALITY_NAMES[k]}
                        count={result.profile.qualities.counts[k]}
                        percent={result.profile.qualities.percents[k]}
                      />
                    ))}
                    {result.profile.qualities.missing.length > 0 && (
                      <div className="mt-4 text-xs text-destructive bg-destructive/10 border border-destructive/20 p-2 rounded-lg">
                        ❌ חסרים: {result.profile.qualities.missing.map((k) => QUALITY_NAMES[k]).join(" · ")}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-4" />
              <div className="text-xs text-muted-foreground text-center bg-muted/30 p-3 rounded-lg">
                💡 ברירת מחדל לחישוב: 5 הפלנטות האישיות (ניתן לשנות למעלה)
              </div>
            </CardContent>
          </Card>

          {/* היבטים */}
          {result.aspects?.length > 0 && (
            <>
              <AspectsTable
                aspects={groupedAspects.personalsInvolved}
                title="⭐ היבטים – פלנטות אישיות (מול כולן)"
                tableColors={tableColors}
                isDark={isDark}
              />
              <AspectsTable
                aspects={groupedAspects.generationalOnly}
                title="🌌 היבטים – פלנטות דוריות עם עצמן (צדק ומעלה)"
                tableColors={tableColors}
                isDark={isDark}
              />
            </>
          )}
        </div>
      )}
    </main>
  );
}
