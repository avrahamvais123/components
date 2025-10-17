"use client";

import { useState } from "react";
import { DEFAULT_STATS_KEYS, STATS_CHOICES, DEFAULT_ASPECT_TYPES, ALL_ASPECT_TYPES, DEFAULT_ASPECT_ORBS } from "./utils/sources";
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
  const [statsIncludeKeys, setStatsIncludeKeys] = useState([...DEFAULT_STATS_KEYS]);
  const [selectedAspectTypes, setSelectedAspectTypes] = useState([...DEFAULT_ASPECT_TYPES]);
  const [aspectOrbs, setAspectOrbs] = useState({ ...DEFAULT_ASPECT_ORBS });
  // בחירת קבוצות להיבטים: מקורות ויעדים
  const [aspectSourceKeys, setAspectSourceKeys] = useState([...DEFAULT_STATS_KEYS]);
  const [aspectTargetKeys, setAspectTargetKeys] = useState([...STATS_CHOICES]);
  const [showSettings, setShowSettings] = useState(true);

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

      <div className="relative">
        {/* פאנל צף וגריר להגדרות - לא תופס מקום בפריסה */}
        {showSettings && (
          <DraggablePanel
            title="הגדרות מחשבון"
            initialTop={100}
            initialLeft={24}
            initialAlignRight
            onClose={() => setShowSettings(false)}
          >
          <AstroForm
            form={form}
            onChange={onChange}
            onSubmit={compute}
            loading={loading}
          />
          {err && <p className="text-red-600">{err}</p>}

          <PlanetSelector
            selectedKeys={displayKeys}
            onSelectionChange={setDisplayKeys}
            title="בחר פלנטות לתצוגה"
          />

          <PlanetSelector
            selectedKeys={statsIncludeKeys}
            onSelectionChange={setStatsIncludeKeys}
            title="בחר פלנטות לחישוב (איכויות ויסודות)"
          />

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

          <AspectSelector
            selectedKeys={selectedAspectTypes}
            onSelectionChange={setSelectedAspectTypes}
            aspectOrbs={aspectOrbs}
            onOrbsChange={setAspectOrbs}
            title="בחר היבטים לתצוגה"
          />
        </DraggablePanel>
        )}

        {!showSettings && (
          <button
            type="button"
            className="fixed z-40 bottom-6 right-6 rounded-full px-4 py-2 shadow-lg bg-white dark:bg-neutral-900 border dark:border-neutral-800 text-gray-800 dark:text-neutral-100 hover:bg-gray-50 dark:hover:bg-neutral-800"
            onClick={() => setShowSettings(true)}
          >
            הצג הגדרות
          </button>
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
