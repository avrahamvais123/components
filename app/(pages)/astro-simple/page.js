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
import { Switch } from "../../../components/ui/switch";

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
  // מתגי תצוגה לאזורים השונים
  const [showPlanetsSection, setShowPlanetsSection] = useState(true);
  const [showStatsSection, setShowStatsSection] = useState(true);
  const [showHousesSection, setShowHousesSection] = useState(true);
  const [showAspectsSection, setShowAspectsSection] = useState(true);
  const [showAnglesSection, setShowAnglesSection] = useState(true);

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
    <main className={`min-h-screen ${isDark ? "bg-neutral-950" : "bg-gray-50"}`} dir="rtl">
      {/* כותרת ראשית עם עיצוב מודרני */}
      <div className={`sticky top-0 z-10 border-b backdrop-blur-sm ${
        isDark 
          ? "bg-neutral-900/80 border-neutral-800" 
          : "bg-white/80 border-gray-200"
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              isDark 
                ? "bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-800/50" 
                : "bg-gradient-to-br from-purple-100 to-blue-100 border border-purple-200"
            }`}>
              <span className="text-2xl">🌟</span>
            </div>
            <div>
              <h1 className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                isDark 
                  ? "from-purple-300 to-blue-300" 
                  : "from-purple-600 to-blue-600"
              }`}>
                מחשבון מפת לידה
              </h1>
              <p className={`text-sm mt-1 ${
                isDark ? "text-neutral-400" : "text-gray-600"
              }`}>
                כלי מקצועי לחישוב ופרשנות מפות אסטרולוגיות
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* פרטי לידה ומתגי תצוגה */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* פרטי לידה - כרטיס מודרני */}
          <div className={`relative overflow-hidden rounded-2xl shadow-lg border ${
            isDark 
              ? "border-neutral-700 bg-gradient-to-br from-neutral-800 to-neutral-900" 
              : "border-gray-200 bg-gradient-to-br from-white to-gray-50"
          }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-purple-500/5"></div>
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${
                  isDark 
                    ? "bg-purple-900/30 text-purple-300" 
                    : "bg-purple-100 text-purple-600"
                }`}>
                  <span className="text-lg">📅</span>
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
                  פרטי לידה
                </h2>
              </div>
              <AstroForm
                form={form}
                onChange={onChange}
                onSubmit={compute}
                loading={loading}
              />
              {err && (
                <div className={`mt-4 p-4 rounded-xl border ${
                  isDark 
                    ? "bg-red-950/30 border-red-800/50 text-red-300" 
                    : "bg-red-50 border-red-200 text-red-700"
                }`}>
                  <div className="flex items-center gap-2">
                    <span>⚠️</span>
                    <p className="font-medium">{err}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* מתגי תצוגה */}
          <div className={`relative overflow-hidden rounded-2xl shadow-lg border ${
            isDark 
              ? "border-neutral-700 bg-gradient-to-br from-neutral-800 to-neutral-900" 
              : "border-gray-200 bg-gradient-to-br from-white to-gray-50"
          }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-500/5"></div>
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${
                  isDark 
                    ? "bg-blue-900/30 text-blue-300" 
                    : "bg-blue-100 text-blue-600"
                }`}>
                  <span className="text-lg">👁️</span>
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
                  בחר אזורים לתצוגה
                </h2>
              </div>
              
              <div className="space-y-4">
                {/* מתג פלנטות */}
                <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  showPlanetsSection 
                    ? (isDark ? "bg-amber-900/20 border-amber-800/50" : "bg-amber-50 border-amber-200")
                    : (isDark ? "bg-neutral-700/30 border-neutral-600" : "bg-gray-50 border-gray-200")
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🪐</span>
                    <div>
                      <h3 className={`font-semibold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
                        פלנטות ומזלות
                      </h3>
                      <p className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                        טבלת מיקום הפלנטות
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={showPlanetsSection}
                    onCheckedChange={setShowPlanetsSection}
                    activeColor={isDark ? "#d97706" : "#f59e0b"}
                  />
                </div>

                {/* מתג סטטיסטיקות */}
                <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  showStatsSection 
                    ? (isDark ? "bg-emerald-900/20 border-emerald-800/50" : "bg-emerald-50 border-emerald-200")
                    : (isDark ? "bg-neutral-700/30 border-neutral-600" : "bg-gray-50 border-gray-200")
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📊</span>
                    <div>
                      <h3 className={`font-semibold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
                        יסודות ואיכויות
                      </h3>
                      <p className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                        ניתוח סטטיסטי
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={showStatsSection}
                    onCheckedChange={setShowStatsSection}
                    activeColor={isDark ? "#059669" : "#10b981"}
                  />
                </div>

                {/* מתג בתים */}
                <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  showHousesSection 
                    ? (isDark ? "bg-purple-900/20 border-purple-800/50" : "bg-purple-50 border-purple-200")
                    : (isDark ? "bg-neutral-700/30 border-neutral-600" : "bg-gray-50 border-gray-200")
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏠</span>
                    <div>
                      <h3 className={`font-semibold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
                        תחילת הבתים
                      </h3>
                      <p className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                        קאספים ופלנטות בבתים
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={showHousesSection}
                    onCheckedChange={setShowHousesSection}
                    activeColor={isDark ? "#7c3aed" : "#8b5cf6"}
                  />
                </div>

                {/* מתג היבטים */}
                <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  showAspectsSection 
                    ? (isDark ? "bg-blue-900/20 border-blue-800/50" : "bg-blue-50 border-blue-200")
                    : (isDark ? "bg-neutral-700/30 border-neutral-600" : "bg-gray-50 border-gray-200")
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🔗</span>
                    <div>
                      <h3 className={`font-semibold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
                        היבטים
                      </h3>
                      <p className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                        זוויות וקשרים בין פלנטות
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={showAspectsSection}
                    onCheckedChange={setShowAspectsSection}
                    activeColor={isDark ? "#2563eb" : "#3b82f6"}
                  />
                </div>

                {/* מתג זוויות */}
                <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  showAnglesSection 
                    ? (isDark ? "bg-rose-900/20 border-rose-800/50" : "bg-rose-50 border-rose-200")
                    : (isDark ? "bg-neutral-700/30 border-neutral-600" : "bg-gray-50 border-gray-200")
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📐</span>
                    <div>
                      <h3 className={`font-semibold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
                        זוויות חשובות
                      </h3>
                      <p className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                        אסצנדנט ו-MC
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={showAnglesSection}
                    onCheckedChange={setShowAnglesSection}
                    activeColor={isDark ? "#e11d48" : "#f43f5e"}
                  />
                </div>
              </div>
              
              {/* כפתורי כל או כלום */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPlanetsSection(true);
                    setShowStatsSection(true);
                    setShowHousesSection(true);
                    setShowAspectsSection(true);
                    setShowAnglesSection(true);
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    isDark 
                      ? "bg-green-900/30 text-green-300 border border-green-800/50 hover:bg-green-900/50" 
                      : "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                  }`}
                >
                  ✓ הצג הכל
                </button>
                <button
                  onClick={() => {
                    setShowPlanetsSection(false);
                    setShowStatsSection(false);
                    setShowHousesSection(false);
                    setShowAspectsSection(false);
                    setShowAnglesSection(false);
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    isDark 
                      ? "bg-red-900/30 text-red-300 border border-red-800/50 hover:bg-red-900/50" 
                      : "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
                  }`}
                >
                  ✕ הסתר הכל
                </button>
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div className="space-y-12">
            {/* פלנטות ומזלות */}
            {showPlanetsSection && (
            <section className={`relative overflow-hidden rounded-2xl shadow-lg border ${
              isDark 
                ? "border-neutral-700 bg-gradient-to-br from-neutral-800 to-neutral-900" 
                : "border-gray-200 bg-gradient-to-br from-white to-gray-50"
            }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-amber-500/5"></div>
              <div className="relative">
                {/* כותרת הסקציה */}
                <div className="p-6 pb-0">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-xl ${
                      isDark 
                        ? "bg-amber-900/30 text-amber-300 border border-amber-800/50" 
                        : "bg-amber-100 text-amber-600 border border-amber-200"
                    }`}>
                      <span className="text-xl">🪐</span>
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
                        פלנטות ומזלות
                      </h2>
                      <p className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                        מיקום הפלנטות במזלות ובבתים
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6 p-6">
                  {/* הגדרות תצוגת פלנטות */}
                  <div className={`lg:w-1/3 rounded-xl border p-6 ${
                    isDark 
                      ? "border-neutral-600 bg-neutral-800/50 backdrop-blur-sm" 
                      : "border-gray-300 bg-white/50 backdrop-blur-sm"
                  }`}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">⚙️</span>
                      <h3 className={`text-lg font-semibold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
                        תצוגת פלנטות
                      </h3>
                    </div>
                    <PlanetSelector
                      selectedKeys={displayKeys}
                      onSelectionChange={setDisplayKeys}
                      title="בחר פלנטות לתצוגה"
                    />
                  </div>
                  
                  {/* טבלת פלנטות */}
                  <div className="lg:w-2/3">
                    <PlanetsTable displayedBodies={displayedBodies} />
                  </div>
                </div>
              </div>
            </section>
            )}

            {/* סטטיסטיקות יסודות ואיכויות */}
            {showStatsSection && (
            <section className={`relative overflow-hidden rounded-2xl shadow-lg border ${
              isDark 
                ? "border-neutral-700 bg-gradient-to-br from-neutral-800 to-neutral-900" 
                : "border-gray-200 bg-gradient-to-br from-white to-gray-50"
            }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-emerald-500/5"></div>
              <div className="relative">
                {/* כותרת הסקציה */}
                <div className="p-6 pb-0">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-xl ${
                      isDark 
                        ? "bg-emerald-900/30 text-emerald-300 border border-emerald-800/50" 
                        : "bg-emerald-100 text-emerald-600 border border-emerald-200"
                    }`}>
                      <span className="text-xl">📊</span>
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
                        חלוקת יסודות ואיכויות
                      </h2>
                      <p className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                        ניתוח סטטיסטי של התפלגות הפלנטות
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6 p-6">
                  {/* הגדרות פלנטות למדדים */}
                  <div className={`lg:w-1/3 rounded-xl border p-6 ${
                    isDark 
                      ? "border-neutral-600 bg-neutral-800/50 backdrop-blur-sm" 
                      : "border-gray-300 bg-white/50 backdrop-blur-sm"
                  }`}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">🎯</span>
                      <h3 className={`text-lg font-semibold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
                        פלנטות למדדים
                      </h3>
                    </div>
                    <PlanetSelector
                      selectedKeys={statsIncludeKeys}
                      onSelectionChange={setStatsIncludeKeys}
                      title="בחר פלנטות לחישוב (איכויות ויסודות)"
                    />
                  </div>
                  
                  {/* תצוגת סטטיסטיקות */}
                  <div className="lg:w-2/3">
                    <ElementQualityStats 
                      elementStats={elementStats} 
                      qualityStats={qualityStats} 
                    />
                  </div>
                </div>
              </div>
            </section>
            )}

            {/* תחילת הבתים */}
            {showHousesSection && niceHouses.length === 12 && (
              <section className={`relative overflow-hidden rounded-2xl shadow-lg border ${
                isDark 
                  ? "border-neutral-700 bg-gradient-to-br from-neutral-800 to-neutral-900" 
                  : "border-gray-200 bg-gradient-to-br from-white to-gray-50"
              }`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-purple-500/5"></div>
                <div className="relative p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-xl ${
                      isDark 
                        ? "bg-purple-900/30 text-purple-300 border border-purple-800/50" 
                        : "bg-purple-100 text-purple-600 border border-purple-200"
                    }`}>
                      <span className="text-xl">🏠</span>
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
                        תחילת הבתים
                      </h2>
                      <p className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                        מיקום קאספים והפלנטות בבתים האסטרולוגיים
                      </p>
                    </div>
                  </div>
                  <HousesGrid niceHouses={niceHouses} />
                </div>
              </section>
            )}

            {/* היבטים */}
            {showAspectsSection && (
            <section className={`relative overflow-hidden rounded-2xl shadow-lg border ${
              isDark 
                ? "border-neutral-700 bg-gradient-to-br from-neutral-800 to-neutral-900" 
                : "border-gray-200 bg-gradient-to-br from-white to-gray-50"
            }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-500/5"></div>
              <div className="relative">
                {/* כותרת הסקציה */}
                <div className="p-6 pb-0">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-xl ${
                      isDark 
                        ? "bg-blue-900/30 text-blue-300 border border-blue-800/50" 
                        : "bg-blue-100 text-blue-600 border border-blue-200"
                    }`}>
                      <span className="text-xl">🔗</span>
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
                        היבטים
                      </h2>
                      <p className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                        זוויות וקשרים בין הפלנטות
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6 p-6">
                  {/* הגדרות היבטים */}
                  <div className={`lg:w-1/3 rounded-xl border p-6 space-y-8 ${
                    isDark 
                      ? "border-neutral-600 bg-neutral-800/50 backdrop-blur-sm" 
                      : "border-gray-300 bg-white/50 backdrop-blur-sm"
                  }`}>
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">🎯</span>
                        <h3 className={`text-lg font-semibold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
                          מקורות ויעדים
                        </h3>
                      </div>
                      <div className="space-y-6">
                        <div className={`p-4 rounded-lg border ${
                          isDark 
                            ? "border-neutral-600 bg-neutral-700/30" 
                            : "border-gray-200 bg-gray-50/50"
                        }`}>
                          <PlanetSelector
                            selectedKeys={aspectSourceKeys}
                            onSelectionChange={setAspectSourceKeys}
                            title="בחר פלנטות מקור (מולן יחושבו היבטים)"
                          />
                        </div>
                        <div className={`p-4 rounded-lg border ${
                          isDark 
                            ? "border-neutral-600 bg-neutral-700/30" 
                            : "border-gray-200 bg-gray-50/50"
                        }`}>
                          <PlanetSelector
                            selectedKeys={aspectTargetKeys}
                            onSelectionChange={setAspectTargetKeys}
                            title="בחר פלנטות יעד (כלפי אילו יחושבו היבטים)"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">⚙️</span>
                        <h3 className={`text-lg font-semibold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
                          סוגי היבטים
                        </h3>
                      </div>
                      <div className={`p-4 rounded-lg border ${
                        isDark 
                          ? "border-neutral-600 bg-neutral-700/30" 
                          : "border-gray-200 bg-gray-50/50"
                      }`}>
                        <AspectSelector
                          selectedKeys={selectedAspectTypes}
                          onSelectionChange={setSelectedAspectTypes}
                          aspectOrbs={aspectOrbs}
                          onOrbsChange={setAspectOrbs}
                          title="בחר היבטים לתצוגה"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* טבלת היבטים */}
                  <div className="lg:w-2/3">
                    <AspectsTable niceAspects={niceAspects} />
                  </div>
                </div>
              </div>
            </section>
            )}

            {/* זוויות חשובות */}
            {showAnglesSection && (
            <section className={`relative overflow-hidden rounded-2xl shadow-lg border ${
              isDark 
                ? "border-neutral-700 bg-gradient-to-br from-neutral-800 to-neutral-900" 
                : "border-gray-200 bg-gradient-to-br from-white to-gray-50"
            }`}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-rose-500/5"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-xl ${
                    isDark 
                      ? "bg-rose-900/30 text-rose-300 border border-rose-800/50" 
                      : "bg-rose-100 text-rose-600 border border-rose-200"
                  }`}>
                    <span className="text-xl">📐</span>
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
                      זוויות חשובות
                    </h2>
                    <p className={`text-sm ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
                      אסצנדנט ומקמן הזניט - נקודות המפתח במפה
                    </p>
                  </div>
                </div>
                <AnglesGrid asc={result.asc} mc={result.mc} />
              </div>
            </section>
            )}
          </div>
        )}

        {!result && (
          <div className={`text-center py-20 ${
            isDark 
              ? "bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700" 
              : "bg-gradient-to-br from-gray-50 to-white border border-gray-200"
          } rounded-2xl shadow-lg`}>
            <div className="max-w-md mx-auto">
              <div className={`inline-flex p-4 rounded-full mb-6 ${
                isDark 
                  ? "bg-purple-900/30 text-purple-300" 
                  : "bg-purple-100 text-purple-600"
              }`}>
                <span className="text-4xl">🌟</span>
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${
                isDark ? "text-neutral-100" : "text-gray-900"
              }`}>
                מוכן לחשב את המפה שלך?
              </h3>
              <p className={`text-sm leading-relaxed ${
                isDark ? "text-neutral-400" : "text-gray-600"
              }`}>
                מלא את פרטי הלידה במקטע למעלה ולחץ על <br/>
                <span className="font-medium">"חשב מפה"</span> כדי לקבל ניתוח מפורט
              </p>
              <div className={`mt-6 p-4 rounded-xl ${
                isDark 
                  ? "bg-neutral-800 border border-neutral-600" 
                  : "bg-gray-50 border border-gray-200"
              }`}>
                <p className={`text-xs ${
                  isDark ? "text-neutral-500" : "text-gray-500"
                }`}>
                  💡 הכלי מחשב מיקום פלנטות, בתים, היבטים וסטטיסטיקות אסטרולוגיות
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
