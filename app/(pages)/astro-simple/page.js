"use client";

import { useState } from "react";
import { STATS_CHOICES, DEFAULT_ASPECT_TYPES, DEFAULT_ASPECT_ORBS } from "./utils/sources";
import { useAstroCalculation } from "./hooks/useAstroCalculation";
import { useAstroData } from "./hooks/useAstroData";
import { useThemeState } from "../../hooks/useThemeState";
import {
  AstroForm,
  PlanetSelector,
  AspectSelector,
  PlanetsTable,
  ElementQualityStats,
  HousesGrid,
  AspectsTable,
  AnglesGrid,
  DraggablePanel,
} from "./components";

export default function AstroPage() {
  const { isDark } = useThemeState();
  
  const [form, setForm] = useState({
    date: "1987-01-28",
    time: "02:30",
    lat: "31.778", // ירושלים
    lon: "35.235",
    houseSystem: "placidus",
    zodiac: "tropical",
  });

  const [displayKeys, setDisplayKeys] = useState([...STATS_CHOICES]);
  // ברירת מחדל למדדי יסודות/איכויות: 5 הפלנטות העיקריות
  const [statsIncludeKeys, setStatsIncludeKeys] = useState([
    "sun",
    "moon",
    "mercury",
    "venus",
    "mars",
  ]);
  const [selectedAspectTypes, setSelectedAspectTypes] = useState([...DEFAULT_ASPECT_TYPES]);
  const [aspectOrbs, setAspectOrbs] = useState({ ...DEFAULT_ASPECT_ORBS });
  // בחירת קבוצות להיבטים: מקורות ויעדים
  // ברירת מחדל למקורות היבטים: 5 הפלנטות העיקריות
  const [aspectSourceKeys, setAspectSourceKeys] = useState([
    "sun",
    "moon",
    "mercury",
    "venus",
    "mars",
  ]);
  // ברירת מחדל ליעדי היבטים: 5 העיקריות + חיצוניות
  const [aspectTargetKeys, setAspectTargetKeys] = useState([
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
  ]);
  // שליטה בתצוגת הפאנלים הצפים
  const [showMainSettings, setShowMainSettings] = useState(true); // טופס ראשי: פרטי לידה + מערכת בתים וזודיאק
  const [showDisplayPlanets, setShowDisplayPlanets] = useState(false);
  const [showStatsPlanets, setShowStatsPlanets] = useState(false);
  const [showAspectsSelection, setShowAspectsSelection] = useState(false); // מקורות ויעדים בכרטיס אחד
  const [showAspectTypes, setShowAspectTypes] = useState(false);

  const { result, loading, err, calculate } = useAstroCalculation();
  const {
    niceBodies,
    elementStats,
    qualityStats,
    niceHouses,
    displayedBodies,
    niceAspects,
  } = useAstroData(
    result,
    displayKeys,
    statsIncludeKeys,
    selectedAspectTypes,
    aspectSourceKeys,
    aspectTargetKeys,
    aspectOrbs
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const compute = async (e) => {
    e.preventDefault();
    await calculate(form);
  };

  return (
    <main className="max-w-6xl mx-auto p-6" dir="rtl">
      <h1 className={`text-2xl font-bold mb-6 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>מחשבון מפת לידה</h1>

      {/* תפריט עליון לבחירת הכרטיסים הצפים */}
  <nav className="sticky top-16 z-40 mb-4 bg-white/70 dark:bg-neutral-900/70 backdrop-blur rounded-lg border border-gray-200 dark:border-neutral-800 p-2">
        <div className="flex flex-wrap gap-2 justify-start">
          <button
            type="button"
            className="px-3 py-1.5 rounded-md text-sm border bg-white dark:bg-neutral-900 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800"
            onClick={() => setShowMainSettings(true)}
          >
            פרטי לידה
          </button>
          {/* כפתור מערכת בתים וזודיאק בוטל כי השדות כלולים בפרטי לידה */}
          <button
            type="button"
            className="px-3 py-1.5 rounded-md text-sm border bg-white dark:bg-neutral-900 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800"
            onClick={() => setShowDisplayPlanets(true)}
          >
            תצוגת פלנטות
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-md text-sm border bg-white dark:bg-neutral-900 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800"
            onClick={() => setShowStatsPlanets(true)}
          >
            פלנטות למדדים
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-md text-sm border bg-white dark:bg-neutral-900 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800"
            onClick={() => setShowAspectsSelection(true)}
          >
            היבטים: מקורות ויעדים
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-md text-sm border bg-white dark:bg-neutral-900 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800"
            onClick={() => setShowAspectTypes(true)}
          >
            סוגי היבטים
          </button>
        </div>
      </nav>

      <div className="relative">
        {/* פאנל: פרטי לידה – תאריך/שעה/lat/lon + מערכת בתים וזודיאק */}
        {showMainSettings && (
          <DraggablePanel
            title="פרטי לידה"
            initialTop={120}
            initialLeft={24}
            initialAlignRight
            onClose={() => setShowMainSettings(false)}
            showInlineHint={false}
            titleTooltip="ניתן לגרור את הכרטיס. דאבל־קליק על הכותרת יכווץ/ירחיב."
          >
            <AstroForm
              form={form}
              onChange={onChange}
              onSubmit={compute}
              loading={loading}
              /* שני מקבצי השדות נכללים כברירת מחדל */
            />
            {err && <p className="text-red-600">{err}</p>}
          </DraggablePanel>
        )}

        {/* פאנל: בחירת פלנטות לתצוגה */}
        {showDisplayPlanets && (
          <DraggablePanel
            title="תצוגת פלנטות"
            initialTop={120}
            initialLeft={24}
            showInlineHint={false}
            titleTooltip="ניתן לגרור את הכרטיס. דאבל־קליק על הכותרת יכווץ/ירחיב."
            onClose={() => setShowDisplayPlanets(false)}
          >
            <PlanetSelector
              selectedKeys={displayKeys}
              onSelectionChange={setDisplayKeys}
              title="בחר פלנטות לתצוגה"
            />
          </DraggablePanel>
        )}

        {/* פאנל: בחירת פלנטות לחישוב סטטיסטיקות */}
        {showStatsPlanets && (
          <DraggablePanel
            title="פלנטות למדדים"
            initialTop={300}
            initialLeft={24}
            showInlineHint={false}
            titleTooltip="ניתן לגרור את הכרטיס. דאבל־קליק על הכותרת יכווץ/ירחיב."
            onClose={() => setShowStatsPlanets(false)}
          >
            <PlanetSelector
              selectedKeys={statsIncludeKeys}
              onSelectionChange={setStatsIncludeKeys}
              title="בחר פלנטות לחישוב (איכויות ויסודות)"
            />
          </DraggablePanel>
        )}

        {/* פאנל: היבטים – מקורות ויעדים בכרטיס אחד */}
        {showAspectsSelection && (
          <DraggablePanel
            title="היבטים: מקורות ויעדים"
            initialTop={300}
            initialLeft={24}
            initialAlignRight
            showInlineHint={false}
            titleTooltip="ניתן לגרור את הכרטיס. דאבל־קליק על הכותרת יכווץ/ירחיב."
            onClose={() => setShowAspectsSelection(false)}
          >
            <div className="space-y-4">
              <PlanetSelector
                selectedKeys={aspectSourceKeys}
                onSelectionChange={setAspectSourceKeys}
                title="בחר פלנטות מקור (מולן יחושבו היבטים)"
              />
              <PlanetSelector
                selectedKeys={aspectTargetKeys}
                onSelectionChange={setAspectTargetKeys}
                title="בחר פלנטות יעד (כלפי אילו יחושבו היבטים)"
              />
            </div>
          </DraggablePanel>
        )}

        {/* פאנל: סוגי היבטים ומרווחי סבילות */}
        {showAspectTypes && (
          <DraggablePanel
            title="סוגי היבטים"
            initialTop={480}
            initialLeft={24}
            showInlineHint={false}
            titleTooltip="ניתן לגרור את הכרטיס. דאבל־קליק על הכותרת יכווץ/ירחיב."
            onClose={() => setShowAspectTypes(false)}
          >
            <AspectSelector
              selectedKeys={selectedAspectTypes}
              onSelectionChange={setSelectedAspectTypes}
              aspectOrbs={aspectOrbs}
              onOrbsChange={setAspectOrbs}
              title="בחר היבטים לתצוגה"
            />
          </DraggablePanel>
        )}

        {/* אזור התוצאות – תופס את כל הרוחב */}
        <section className="space-y-10">
          {result && (
            <>
              {/* פלנטות ומזלות */}
              <div>
                <h2 className={`text-xl font-semibold mb-2 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>פלנטות ומזלות</h2>
                <PlanetsTable displayedBodies={displayedBodies} />
              </div>

              {/* סטטיסטיקות יסודות ואיכויות */}
              <div>
                <h2 className={`text-xl font-semibold mb-2 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
                  חלוקת יסודות ואיכויות
                </h2>
                <ElementQualityStats 
                  elementStats={elementStats} 
                  qualityStats={qualityStats} 
                />
              </div>

              {/* תחילת הבתים */}
              {niceHouses.length === 12 && <HousesGrid niceHouses={niceHouses} />}

              {/* היבטים */}
              <div>
                <h2 className={`text-xl font-semibold mb-2 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>היבטים</h2>
                <AspectsTable niceAspects={niceAspects} />
              </div>

              {/* ASC & MC */}
              <AnglesGrid asc={result.asc} mc={result.mc} />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
