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
    <main className="max-w-4xl mx-auto p-6 space-y-8" dir="rtl">
      <h1 className={`text-2xl font-bold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>מחשבון מפת לידה</h1>

      {/* טופס קלט */}
      <AstroForm 
        form={form} 
        onChange={onChange} 
        onSubmit={compute} 
        loading={loading} 
      />

      {err && <p className="text-red-600">{err}</p>}

      {/* תוצאות */}
      {result && (
        <section className="space-y-10">
          {/* פלנטות ונקודות */}
          <div>
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>פלנטות ונקודות</h2>
            <PlanetSelector
              selectedKeys={displayKeys}
              onSelectionChange={setDisplayKeys}
              title="בחר פלנטות לתצוגה"
            />
            <PlanetsTable displayedBodies={displayedBodies} />
          </div>

          {/* סטטיסטיקות יסודות ואיכויות */}
          <div>
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
              חלוקת יסודות ואיכויות
            </h2>
            <PlanetSelector
              selectedKeys={statsIncludeKeys}
              onSelectionChange={setStatsIncludeKeys}
              title="בחר פלנטות לחישוב"
            />
            <ElementQualityStats 
              elementStats={elementStats} 
              qualityStats={qualityStats} 
            />
          </div>

          {/* קאספים של הבתים */}
          {niceHouses.length === 12 && <HousesGrid niceHouses={niceHouses} />}

          {/* היבטים */}
          <div>
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>היבטים</h2>
            {/* בחירת קבוצות להיבטים: מקורות ויעדים */}
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
            <AspectsTable niceAspects={niceAspects} />
          </div>

          {/* ASC & MC */}
          <AnglesGrid asc={result.asc} mc={result.mc} />
        </section>
      )}
    </main>
  );
}
