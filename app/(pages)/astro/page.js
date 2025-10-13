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
import useAstroAPI from "./hooks/useAstroAPI";
import { watch, store as createStore } from "hyperactiv/react";
import { useTheme } from "./hooks/useTheme";
import { PERSONAL, GENERATIONAL } from "./utils/constants";
import AstroForm from "./components/AstroForm";
import PlanetsTable from "./components/PlanetsTable";
import HousesTable from "./components/HousesTable";
import AspectsTable from "./components/AspectsTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

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

const calculateChart = async () => {
  try {
    const response = await fetch("/api/astro/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // נתונים חובה
        date: "2010-03-16", // פורמט: YYYY-MM-DD
        time: "10:00", // פורמט: HH:MM
        lat: 32.0853, // קו רוחב (מספר)
        lon: 34.7818, // קו אורך (מספר)

        // הגדרות אופציונליות
        houseSystem: "placidus", // placidus, koch, equal-house, whole-sign
        zodiac: "tropical", // tropical, sidereal
        aspectMode: "degree", // none, sign, degree
        orb: 7, // אורב במעלות (רק עבור aspectMode: "degree")
        aspects: [
          // סוגי היבטים לחישוב
          "conjunction",
          "sextile",
          "square",
          "trine",
          "opposition",
        ],
        profileIncludeKeys: [
          // פלנטות לכלול בפרופיל
          "sun",
          "moon",
          "mercury",
          "venus",
          "mars",
        ],
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("תוצאות המפה:", data.data);
      return data.data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error("שגיאה בחישוב:", error);
    throw error;
  }
};

export default function AstroPage() {
  const { isDark, tableColors } = useTheme();

  const [form, setForm] = useState({
    date: "1987-01-28",
    time: "02:30",
    lat: 32.0853,
    lon: 34.7818,
    houseSystem: "placidus",
    zodiac: "tropical",
  });

  const [aspectMode, setAspectMode] = useState("sign");
  const [orb, setOrb] = useState(7);
  const [houseFormat, setHouseFormat] = useState("arabic"); // arabic או roman
  const [useAPI, setUseAPI] = useState(false); // בחירה בין API לחישוב מקומי

  // ✅ ברירת מחדל: 5 אישיות
  const [profileKeys, setProfileKeys] = useState([...PROFILE_DEFAULT_INCLUDE]);

  // פלנטות להצגה - ברירת מחדל: כל הפלנטות
  const [displayPlanets, setDisplayPlanets] = useState([
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
    "chiron",
    "lilith",
  ]);

  // מעקב אחרי הטאב הפעיל עבור אנימציות
  const [activeTab, setActiveTab] = useState("planets");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTabChange = (newTab) => {
    if (newTab !== activeTab) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTab(newTab);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 300);
    }
  };

  const localCalc = useAstroCalc();
  const apiCalc = useAstroAPI();

  // בחירה דינמית בין החישובים
  const { calc, loading, error, result } = useAPI ? apiCalc : localCalc;

  const run = () =>
    calc(form, {
      aspectMode,
      orb,
      profileIncludeKeys: profileKeys, // ← נעביר להוק את הבחירה
      displayPlanets, // ← פלנטות להצגה
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
    <main className="container mx-auto p-6 max-w-5xl space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
          מחשבון מזלות + היבטים 💫
        </h1>
        <p className="text-muted-foreground">
          חישוב מפה אסטרולוגית מלאה עם היבטים ופרופיל יסודות
        </p>

        <Button onClick={calculateChart}>חשב מפה אסטרולוגית</Button>

        {/* בחירת מצב חישוב */}
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <Label htmlFor="api-mode" className="text-sm font-medium">
                  {useAPI ? "🌐 חישוב בשרת (API)" : "💻 חישוב מקומי"}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {useAPI
                    ? "שליחת הנתונים לשרת לחישוב"
                    : "חישוב בדפדפן (מהיר יותר)"}
                </p>
              </div>
              <Switch
                id="api-mode"
                checked={useAPI}
                onCheckedChange={setUseAPI}
              />
            </div>
          </CardContent>
        </Card>
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
        displayPlanets={displayPlanets}
        setDisplayPlanets={setDisplayPlanets}
        loading={loading}
        error={error}
        onSubmit={run}
      />

      {error && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <div>
              <AlertTitle className="text-red-800 dark:text-red-200">
                שגיאה בחישוב
              </AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-300">
                {error}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* התראה לגבי מצב החישוב */}
          <Alert
            className={
              useAPI
                ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
            }
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{useAPI ? "🌐" : "💻"}</span>
              <div>
                <AlertTitle
                  className={
                    useAPI
                      ? "text-green-800 dark:text-green-200"
                      : "text-blue-800 dark:text-blue-200"
                  }
                >
                  {useAPI ? "חישוב באמצעות שרת API" : "חישוב מקומי"}
                </AlertTitle>
                <AlertDescription
                  className={
                    useAPI
                      ? "text-green-700 dark:text-green-300"
                      : "text-blue-700 dark:text-blue-300"
                  }
                >
                  {useAPI
                    ? "הנתונים חושבו על השרת באמצעות API מאובטח"
                    : "הנתונים חושבו מקומית בדפדפן שלך"}
                </AlertDescription>
              </div>
            </div>
          </Alert>

          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                ✨ תוצאות חישוב
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <div className="text-2xl">
                    {result.angles.ascendant.signGlyph}
                  </div>
                  <div>
                    <div className="font-semibold text-blue-700 dark:text-blue-300">
                      אופק (ASC)
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.angles.ascendant.signName}{" "}
                      {result.angles.ascendant.degOnlyText}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                  <div className="text-2xl">
                    {result.angles.midheaven.signGlyph}
                  </div>
                  <div>
                    <div className="font-semibold text-purple-700 dark:text-purple-300">
                      MC
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.angles.midheaven.signName}{" "}
                      {result.angles.midheaven.degOnlyText}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="planets" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="planets" className="flex items-center gap-2 transition-all duration-200 hover:bg-muted/50 hover:text-primary">
                🪐 פלנטות
                <Badge variant="secondary" className="ml-1">
                  {result.planets?.filter((planet) =>
                    displayPlanets.includes(planet.key)
                  ).length || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="houses" className="flex items-center gap-2 transition-all duration-200 hover:bg-muted/50 hover:text-primary">
                🏠 בתים
                <Badge variant="secondary" className="ml-1">
                  {result.houses?.length || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="aspects" className="flex items-center gap-2 transition-all duration-200 hover:bg-muted/50 hover:text-primary">
                🔗 היבטים
                <Badge variant="secondary" className="ml-1">
                  {result.aspects?.length || 0}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <div className="relative mt-4 overflow-hidden min-h-[400px]">
              <div className={`transition-all duration-500 ease-in-out transform ${
                isTransitioning ? 'opacity-0 translate-x-4 scale-95' : 'opacity-100 translate-x-0 scale-100'
              }`}>
                {activeTab === "planets" && (
                  <PlanetsTable
                    planets={result.planets.filter((planet) =>
                      displayPlanets.includes(planet.key)
                    )}
                    houseFormat={houseFormat}
                    tableColors={tableColors}
                    isDark={isDark}
                  />
                )}
                
                {activeTab === "houses" && (
                  <HousesTable
                    houses={result.houses}
                    houseFormat={houseFormat}
                    tableColors={tableColors}
                  />
                )}
                
                {activeTab === "aspects" && (
                  result.aspects?.length > 0 ? (
                    <div className="space-y-6">
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
                    </div>
                  ) : (
                    <Alert>
                      <AlertTitle>אין היבטים להצגה</AlertTitle>
                      <AlertDescription>
                        לא נמצאו היבטים בהגדרות הנוכחיות. נסה לשנות את הגדרות
                        ההיבטים בטופס.
                      </AlertDescription>
                    </Alert>
                  )
                )}
              </div>
            </div>
          </Tabs>

          {/* יסודות ואיכויות */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-center flex flex-col items-center gap-2">
                <span className="flex items-center gap-2">
                  🌟 יסודות ואיכויות
                </span>
                <span className="text-sm font-normal text-muted-foreground">
                  נלקחו בחשבון:{" "}
                  {result.profile.considered
                    .map((k) => PLANET_NAMES_HE[k])
                    .join(", ") || "—"}
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
                        ❌ חסרים:{" "}
                        {result.profile.elements.missing
                          .map((k) => ELEMENT_NAMES[k])
                          .join(" · ")}
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
                        ❌ חסרים:{" "}
                        {result.profile.qualities.missing
                          .map((k) => QUALITY_NAMES[k])
                          .join(" · ")}
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
        </div>
      )}
    </main>
  );
}
