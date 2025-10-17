"use client";

import { useState } from "react";
import { DEFAULT_STATS_KEYS, STATS_CHOICES } from "./utils/sources";
import { useAstroCalculation } from "./hooks/useAstroCalculation";
import { useAstroData } from "./hooks/useAstroData";
import {
  AstroForm,
  PlanetSelector,
  PlanetsTable,
  ElementQualityStats,
  HousesGrid,
  AspectsTable,
  AnglesGrid,
} from "./components";

export default function AstroPage() {
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

  const { result, loading, err, calculate } = useAstroCalculation();
  const {
    niceBodies,
    elementStats,
    qualityStats,
    niceHouses,
    displayedBodies,
    niceAspects,
  } = useAstroData(result, displayKeys, statsIncludeKeys);

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
      <h1 className="text-2xl font-bold">מחשבון מפת לידה</h1>

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
            <h2 className="text-xl font-semibold mb-2">פלנטות ונקודות</h2>
            <PlanetSelector
              selectedKeys={displayKeys}
              onSelectionChange={setDisplayKeys}
              title="בחר פלנטות לתצוגה"
            />
            <PlanetsTable displayedBodies={displayedBodies} />
          </div>

          {/* סטטיסטיקות יסודות ואיכויות */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
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
          <AspectsTable niceAspects={niceAspects} />

          {/* ASC & MC */}
          <AnglesGrid asc={result.asc} mc={result.mc} />
        </section>
      )}
    </main>
  );
}
