"use client";

import { useState } from "react";
import { STATS_CHOICES, DEFAULT_ASPECT_TYPES, DEFAULT_ASPECT_ORBS, ASPECT_TYPES, PLANET_NAMES_HE_BY_KEY } from "./utils/sources";
import { useAstroCalculation } from "./hooks/useAstroCalculation";
import { useAstroData } from "./hooks/useAstroData";
import { useThemeState } from "../../hooks/useThemeState";
import {
  PlanetsTable,
  HousesGrid,
  AspectsTable,
  HeaderDropdown,
  StatsTable,
} from "./components";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "../../../components/ui/dropdown-menu";

export default function AstroPage() {
  const { isDark } = useThemeState();

  // מחלקות שיתוף לסגנון
  const menuTriggerCls = `${isDark?"bg-neutral-900/60 border-neutral-700 text-neutral-100 hover:bg-neutral-800/80":"bg-white/60 border-neutral-200 text-neutral-900 hover:bg-white"} px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors`;
  const cardSurface = isDark ? "border-neutral-700 bg-neutral-900" : "border-neutral-200 bg-white";
  const sectionTitleCls = isDark?"text-neutral-100":"text-neutral-900";
  const sectionSubCls = isDark?"text-neutral-400":"text-neutral-600";
  const menuContentBase = isDark?"bg-neutral-900 text-neutral-100 border-neutral-700":"bg-white text-neutral-900 border-neutral-200";
  const menuLabelMutedCls = isDark?"text-neutral-300":"text-neutral-500";

  // קומפוננטת כותרת סקשן לשימוש חוזר
  const SectionHeader = ({ icon, iconCls, title, subtitle }) => (
    <div className="pb-2">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-xl ${iconCls}`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <h2 className={`text-xl lg:text-2xl font-bold ${sectionTitleCls}`}>{title}</h2>
          {subtitle && (
            <p className={`text-xs lg:text-sm ${sectionSubCls}`}>{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
  
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
  // בוטל: אזור זוויות חשובות הוסר

  // מספר עמודות דינמי לפי מה שמוצג
  const colCount = (showPlanetsSection?1:0) + (showAspectsSection?1:0) + (showStatsSection?1:0);
  const colsBase = "grid-cols-1";
  const colsMd = colCount >= 2 ? "md:grid-cols-2" : "md:grid-cols-1";
  const colsLg = colCount >= 3 ? "lg:grid-cols-3" : colCount === 2 ? "lg:grid-cols-2" : "lg:grid-cols-1";

  const { result, calculate } = useAstroCalculation();
  const {
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

  // חישוב מתבצע דרך הלחצן בתפריט העליון

  return (
  <main className={`min-h-screen ${isDark ? "bg-neutral-950" : "bg-neutral-50"}`} dir="rtl">
      {/* כותרת ראשית עם עיצוב מודרני */}
      <div className={`sticky top-16 z-40 border-b backdrop-blur-sm ${
        isDark 
          ? "bg-neutral-900/80 border-neutral-800" 
          : "bg-white/80 border-neutral-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isDark 
                  ? "bg-purple-900/30 border border-purple-800/50" 
                  : "bg-purple-100 border border-purple-200"
              }`}>
                <span className="text-xl">🌟</span>
              </div>
              <div className="leading-tight">
                <div className={`text-base font-bold ${isDark ? "text-neutral-100" : "text-neutral-900"}`}>
                  הגדרות המפה
                </div>
                <div className={`text-xs ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  בחירת תצוגה ומדדים
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* פרטי לידה */}
              <HeaderDropdown icon="📅" label="פרטי לידה" minWidth="min-w-[18rem]">
                <DropdownMenuLabel className={`${menuLabelMutedCls}`}>פרטים</DropdownMenuLabel>
                <div className="px-2 pb-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`text-xs ${isDark?"text-neutral-400":"text-neutral-600"}`}>תאריך</label>
                    <label className={`text-xs ${isDark?"text-neutral-400":"text-neutral-600"}`}>שעה</label>
                    <input type="date" name="date" value={form.date} onChange={onChange} className={`${isDark?"bg-neutral-800 border-neutral-600 text-neutral-100":"bg-white border-neutral-300 text-neutral-900"} border rounded-md px-2 py-1 text-sm`} />
                    <input type="time" name="time" value={form.time} onChange={onChange} className={`${isDark?"bg-neutral-800 border-neutral-600 text-neutral-100":"bg-white border-neutral-300 text-neutral-900"} border rounded-md px-2 py-1 text-sm`} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`text-xs ${isDark?"text-neutral-400":"text-neutral-600"}`}>קו־רוחב (lat)</label>
                    <label className={`text-xs ${isDark?"text-neutral-400":"text-neutral-600"}`}>קו־אורך (lon)</label>
                    <input type="text" name="lat" value={form.lat} onChange={onChange} className={`${isDark?"bg-neutral-800 border-neutral-600 text-neutral-100":"bg-white border-neutral-300 text-neutral-900"} border rounded-md px-2 py-1 text-sm`} placeholder="למשל 31.778" />
                    <input type="text" name="lon" value={form.lon} onChange={onChange} className={`${isDark?"bg-neutral-800 border-neutral-600 text-neutral-100":"bg-white border-neutral-300 text-neutral-900"} border rounded-md px-2 py-1 text-sm`} placeholder="למשל 35.235" />
                  </div>
                  <div className="pt-1">
                    <button onClick={async()=>{await calculate(form);}} className={`${isDark?"bg-purple-600 hover:bg-purple-700 text-white":"bg-purple-600 hover:bg-purple-700 text-white"} w-full rounded-md px-3 py-2 text-sm font-semibold`}>חשב מפה</button>
                  </div>
                </div>
              </HeaderDropdown>

              {/* תצוגה */}
              <HeaderDropdown icon="👁️" label="תצוגה" minWidth="min-w-[18rem]">
                <DropdownMenuGroup>
                  <DropdownMenuCheckboxItem checked={showPlanetsSection} onCheckedChange={(v)=>setShowPlanetsSection(!!v)} className={`${isDark?"text-neutral-100":"text-neutral-800"}`}>פלנטות ומזלות</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={showStatsSection} onCheckedChange={(v)=>setShowStatsSection(!!v)} className={`${isDark?"text-neutral-100":"text-neutral-800"}`}>יסודות ואיכויות</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={showHousesSection} onCheckedChange={(v)=>setShowHousesSection(!!v)} className={`${isDark?"text-neutral-100":"text-neutral-800"}`}>תחילת הבתים</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={showAspectsSection} onCheckedChange={(v)=>setShowAspectsSection(!!v)} className={`${isDark?"text-neutral-100":"text-neutral-800"}`}>היבטים</DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
              </HeaderDropdown>

              {/* הגדרות (מערכת בתים + זודיאק) */}
              <HeaderDropdown icon="⚙️" label="הגדרות" minWidth="min-w-[16rem]">
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>מערכת בתים</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className={`${menuContentBase} rounded-xl min-w-[16rem]`}>
                      <DropdownMenuRadioGroup value={form.houseSystem} onValueChange={(v)=>setForm((p)=>({...p,houseSystem:v}))}>
                        <DropdownMenuRadioItem value="placidus">Placidus</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="whole-sign">Whole Sign</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="equal-house">Equal</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="koch">Koch</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="regiomontanus">Regiomontanus</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="campanus">Campanus</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="topocentric">Topocentric</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>זודיאק</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className={`${menuContentBase} rounded-xl min-w-[16rem]`}>
                      <DropdownMenuRadioGroup value={form.zodiac} onValueChange={(v)=>setForm((p)=>({...p,zodiac:v}))}>
                        <DropdownMenuRadioItem value="tropical">Tropical (טרופי)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="sidereal">Sidereal (כוכבי)</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
              </HeaderDropdown>

              {/* היבטים להצגה */}
              <HeaderDropdown icon="🔗" label="היבטים">
                {ASPECT_TYPES.map((a)=> (
                  <DropdownMenuCheckboxItem key={a.key} checked={selectedAspectTypes.includes(a.key)} onCheckedChange={(checked)=> setSelectedAspectTypes((prev)=> checked ? (prev.includes(a.key)?prev:[...prev,a.key]) : prev.filter((k)=>k!==a.key))}>
                    {a.labelHe}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuCheckboxItem checked={selectedAspectTypes.length===ASPECT_TYPES.length} onCheckedChange={(checked)=> setSelectedAspectTypes(checked? ASPECT_TYPES.map((x)=>x.key): [])}>
                    בחר/נקה הכל
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={false} onCheckedChange={()=> setSelectedAspectTypes([...DEFAULT_ASPECT_TYPES])}>
                    אפס לברירת מחדל
                  </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
              </HeaderDropdown>

              {/* פלנטות (תצוגה/מדדים/להיבטים) */}
              <HeaderDropdown icon="🪐" label="פלנטות" minWidth="min-w-[16rem]">
                <DropdownMenuGroup>
                  {/* לתצוגה */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>לתצוגה</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className={`${menuContentBase} rounded-xl min-w-[18rem]`}>
                      {STATS_CHOICES.map((k)=> (
                        <DropdownMenuCheckboxItem key={`display-${k}`} checked={displayKeys.includes(k)} onCheckedChange={(checked)=> setDisplayKeys((prev)=> checked ? (prev.includes(k)?prev:[...prev,k]) : prev.filter((x)=>x!==k))}>
                          {PLANET_NAMES_HE_BY_KEY[k] || k}
                        </DropdownMenuCheckboxItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuCheckboxItem checked={displayKeys.length===STATS_CHOICES.length} onCheckedChange={(checked)=> setDisplayKeys(checked ? [...STATS_CHOICES] : [])}>
                          בחר/נקה הכל
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  {/* למדדים */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>למדדים</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className={`${menuContentBase} rounded-xl min-w-[18rem]`}>
                      {STATS_CHOICES.map((k)=> (
                        <DropdownMenuCheckboxItem key={`stats-${k}`} checked={statsIncludeKeys.includes(k)} onCheckedChange={(checked)=> setStatsIncludeKeys((prev)=> checked ? (prev.includes(k)?prev:[...prev,k]) : prev.filter((x)=>x!==k))}>
                          {PLANET_NAMES_HE_BY_KEY[k] || k}
                        </DropdownMenuCheckboxItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuCheckboxItem checked={statsIncludeKeys.length===STATS_CHOICES.length} onCheckedChange={(checked)=> setStatsIncludeKeys(checked ? [...STATS_CHOICES] : [])}>
                          בחר/נקה הכל
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked={false} onCheckedChange={()=> setStatsIncludeKeys(["sun","moon","mercury","venus","mars"]) }>
                          אפס לברירת מחדל
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  {/* להיבטים */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>להיבטים</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className={`${menuContentBase} rounded-xl min-w-[18rem]`}>
                      <DropdownMenuLabel className={`${menuLabelMutedCls}`}>מקורות</DropdownMenuLabel>
                      {STATS_CHOICES.map((k)=> (
                        <DropdownMenuCheckboxItem key={`aspect-src-${k}`} checked={aspectSourceKeys.includes(k)} onCheckedChange={(checked)=> setAspectSourceKeys((prev)=> checked ? (prev.includes(k)?prev:[...prev,k]) : prev.filter((x)=>x!==k))}>
                          {PLANET_NAMES_HE_BY_KEY[k] || k}
                        </DropdownMenuCheckboxItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className={`${menuLabelMutedCls}`}>יעדים</DropdownMenuLabel>
                      {STATS_CHOICES.map((k)=> (
                        <DropdownMenuCheckboxItem key={`aspect-tgt-${k}`} checked={aspectTargetKeys.includes(k)} onCheckedChange={(checked)=> setAspectTargetKeys((prev)=> checked ? (prev.includes(k)?prev:[...prev,k]) : prev.filter((x)=>x!==k))}>
                          {PLANET_NAMES_HE_BY_KEY[k] || k}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
              </HeaderDropdown>
            </div>
          </div>{/* end: top bar (h-16) */}
        </div>{/* end: sticky inner container */}
      </div>{/* end: sticky header */}

      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {result && (
          <div className="space-y-12">
            {/* כרטיס מאוחד: פלנטות, היבטים וסטטיסטיקות */}
            {(showPlanetsSection || showAspectsSection || showStatsSection) && (
              <section className={`relative overflow-hidden rounded-2xl border ${cardSurface}`}>
                <div className="relative p-4 sm:p-5 lg:p-6 min-h-0">
                  <div className={`grid ${colsBase} ${colsMd} ${colsLg} gap-2 items-stretch lg:auto-rows-fr lg:max-h-[calc(100vh-14rem)] lg:h-[calc(100vh-14rem)] lg:overflow-hidden`}>
                    {/* צד שמאל: פלנטות ומזלות */}
                    {showPlanetsSection && (
                      <div className="flex flex-col h-full min-h-0">
                        <div className="flex-shrink-0">
                          <SectionHeader
                            icon="🪐"
                            iconCls={isDark?"bg-amber-900/30 text-amber-300 border border-amber-800/50":"bg-amber-100 text-amber-600 border border-amber-200"}
                            title="פלנטות ומזלות"
                            subtitle="מיקום הפלנטות במזלות ובבתים"
                          />
                        </div>
                        <div className="flex-1 min-h-0 h-full pr-1">
                          <PlanetsTable displayedBodies={displayedBodies} />
                        </div>
                      </div>
                    )}

                    {/* צד ימין: היבטים עם גלילה + סטטיסטיקות מתחת */}
                    {showAspectsSection && (
                      <div className="flex flex-col h-full min-h-0">
                        <div className="flex-shrink-0">
                          <SectionHeader
                            icon="🔗"
                            iconCls={isDark?"bg-blue-900/30 text-blue-300 border border-blue-800/50":"bg-blue-100 text-blue-600 border border-blue-200"}
                            title="היבטים"
                            subtitle="זוויות וקשרים בין הפלנטות"
                          />
                        </div>
                        <div className="flex-1 min-h-0 h-full pr-1">
                          <AspectsTable niceAspects={niceAspects} />
                        </div>
                      </div>
                    )}

                    {showStatsSection && (
                      <div className="flex flex-col h-full min-h-0">
                        <div className="flex-shrink-0">
                          <SectionHeader
                            icon="📊"
                            iconCls={isDark?"bg-emerald-900/30 text-emerald-300 border border-emerald-800/50":"bg-emerald-100 text-emerald-600 border border-emerald-200"}
                            title="חלוקת יסודות ואיכויות"
                            subtitle="ניתוח סטטיסטי"
                          />
                        </div>
                        <div className="flex-1 min-h-0 h-full pr-1">
                          <StatsTable elementStats={elementStats} qualityStats={qualityStats} />
                        </div>
                      </div>
                    )}
                  </div>
                  {/* שלוש טבלאות זו לצד זו: פלנטות, היבטים, סטטיסטיקות */}
                </div>
              </section>
            )}

            {/* תחילת הבתים */}
            {showHousesSection && niceHouses.length === 12 && (
              <section className={`relative overflow-hidden rounded-2xl border ${
                isDark 
                  ? "border-neutral-700 bg-neutral-900" 
                  : "border-neutral-200 bg-white"
              }`}>
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
                      <h2 className={`text-2xl font-bold ${isDark ? "text-neutral-100" : "text-neutral-900"}`}>
                        תחילת הבתים
                      </h2>
                      <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                        מיקום קאספים והפלנטות בבתים האסטרולוגיים
                      </p>
                    </div>
                  </div>
                  <HousesGrid niceHouses={niceHouses} />
                </div>
              </section>
            )}

            {/* הוסר: סקציות נפרדות של היבטים וזוויות חשובות */}
          </div>
        )}

        {!result && (
          <div className={`text-center py-20 ${
            isDark 
              ? "bg-neutral-900 border border-neutral-700" 
              : "bg-white border border-neutral-200"
          } rounded-2xl`}>
            <div className="max-w-md mx-auto">
              <div className={`inline-flex p-4 rounded-full mb-6 ${
                isDark 
                  ? "bg-purple-900/30 text-purple-300" 
                  : "bg-purple-100 text-purple-600"
              }`}>
                <span className="text-4xl">🌟</span>
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${
                isDark ? "text-neutral-100" : "text-neutral-900"
              }`}>
                מוכן לחשב את המפה שלך?
              </h3>
              <p className={`text-sm leading-relaxed ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}>
                מלא את פרטי הלידה במקטע למעלה ולחץ על <br/>
                <span className="font-medium">"חשב מפה"</span> כדי לקבל ניתוח מפורט
              </p>
              <div className={`mt-6 p-4 rounded-xl ${
                isDark 
                  ? "bg-neutral-800 border border-neutral-600" 
                  : "bg-neutral-50 border border-neutral-200"
              }`}>
                <p className={`text-xs ${
                  isDark ? "text-neutral-500" : "text-neutral-500"
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
