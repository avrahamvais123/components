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
    <main className="min-h-screen" dir="rtl">
      <h1 className={`text-2xl font-bold p-6 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>מחשבון מפת לידה</h1>

      <div className="max-w-7xl mx-auto p-6">
        {/* פרטי לידה - תמיד בראש */}
        <div className={`border rounded-lg p-4 mb-6 ${isDark ? "border-neutral-700 bg-neutral-800" : "border-gray-200 bg-white"}`}>
          <h2 className={`text-xl font-semibold mb-3 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>פרטי לידה</h2>
          <AstroForm
            form={form}
            onChange={onChange}
            onSubmit={compute}
            loading={loading}
          />
          {err && <p className="text-red-600 mt-2">{err}</p>}
        </div>

        {result && (
          <div className="space-y-10">
            {/* פלנטות ומזלות */}
            <div>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* הגדרות תצוגת פלנטות */}
                <div className={`lg:w-1/3 border rounded-lg p-4 ${isDark ? "border-neutral-700 bg-neutral-800" : "border-gray-200 bg-white"}`}>
                  <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>תצוגת פלנטות</h3>
                  <PlanetSelector
                    selectedKeys={displayKeys}
                    onSelectionChange={setDisplayKeys}
                    title="בחר פלנטות לתצוגה"
                  />
                </div>
                
                {/* טבלת פלנטות */}
                <div className="lg:w-2/3">
                  <h2 className={`text-xl font-semibold mb-2 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>פלנטות ומזלות</h2>
                  <PlanetsTable displayedBodies={displayedBodies} />
                </div>
              </div>
            </div>

            {/* סטטיסטיקות יסודות ואיכויות */}
            <div>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* הגדרות פלנטות למדדים */}
                <div className={`lg:w-1/3 border rounded-lg p-4 ${isDark ? "border-neutral-700 bg-neutral-800" : "border-gray-200 bg-white"}`}>
                  <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>פלנטות למדדים</h3>
                  <PlanetSelector
                    selectedKeys={statsIncludeKeys}
                    onSelectionChange={setStatsIncludeKeys}
                    title="בחר פלנטות לחישוב (איכויות ויסודות)"
                  />
                </div>
                
                {/* תצוגת סטטיסטיקות */}
                <div className="lg:w-2/3">
                  <h2 className={`text-xl font-semibold mb-2 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
                    חלוקת יסודות ואיכויות
                  </h2>
                  <ElementQualityStats 
                    elementStats={elementStats} 
                    qualityStats={qualityStats} 
                  />
                </div>
              </div>
            </div>

            {/* תחילת הבתים - ללא הגדרות נוספות */}
            {niceHouses.length === 12 && <HousesGrid niceHouses={niceHouses} />}

            {/* היבטים */}
            <div>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* הגדרות היבטים */}
                <div className={`lg:w-1/3 border rounded-lg p-4 ${isDark ? "border-neutral-700 bg-neutral-800" : "border-gray-200 bg-white"} space-y-6`}>
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>מקורות ויעדים</h3>
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
                  </div>
                  
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>סוגי היבטים</h3>
                    <AspectSelector
                      selectedKeys={selectedAspectTypes}
                      onSelectionChange={setSelectedAspectTypes}
                      aspectOrbs={aspectOrbs}
                      onOrbsChange={setAspectOrbs}
                      title="בחר היבטים לתצוגה"
                    />
                  </div>
                </div>
                
                {/* טבלת היבטים */}
                <div className="lg:w-2/3">
                  <h2 className={`text-xl font-semibold mb-2 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>היבטים</h2>
                  <AspectsTable niceAspects={niceAspects} />
                </div>
              </div>
            </div>

            {/* ASC & MC - ללא הגדרות נוספות */}
            <AnglesGrid asc={result.asc} mc={result.mc} />
          </div>
        )}

        {!result && (
          <div className={`text-center py-20 ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
            <p>מלא את פרטי הלידה למעלה ולחץ על "חשב מפה" כדי לראות את התוצאות</p>
          </div>
        )}
      </div>
    </main>
  );
}
