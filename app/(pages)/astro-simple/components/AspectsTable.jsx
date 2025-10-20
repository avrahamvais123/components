"use client";

import { useThemeState } from "../../../hooks/useThemeState";

// צבעים להיבטים השונים
const ASPECT_COLORS = {
  conjunction: { light: "text-blue-600 bg-blue-50", dark: "text-blue-300 bg-blue-950/30" },
  trine: { light: "text-green-600 bg-green-50", dark: "text-green-300 bg-green-950/30" },
  sextile: { light: "text-emerald-600 bg-emerald-50", dark: "text-emerald-300 bg-emerald-950/30" },
  opposition: { light: "text-red-600 bg-red-50", dark: "text-red-300 bg-red-950/30" },
  square: { light: "text-orange-600 bg-orange-50", dark: "text-orange-300 bg-orange-950/30" },
  semisextile: { light: "text-cyan-600 bg-cyan-50", dark: "text-cyan-300 bg-cyan-950/30" },
  quincunx: { light: "text-purple-600 bg-purple-50", dark: "text-purple-300 bg-purple-950/30" },
  semisquare: { light: "text-yellow-600 bg-yellow-50", dark: "text-yellow-300 bg-yellow-950/30" },
  sesquiquadrate: { light: "text-pink-600 bg-pink-50", dark: "text-pink-300 bg-pink-950/30" },
  quintile: { light: "text-indigo-600 bg-indigo-50", dark: "text-indigo-300 bg-indigo-950/30" },
  biquintile: { light: "text-violet-600 bg-violet-50", dark: "text-violet-300 bg-violet-950/30" },
  default: { light: "text-neutral-600 bg-neutral-50", dark: "text-neutral-300 bg-neutral-950/30" },
};

// פונקציה לקבלת צבע לפי סוג היבט (כולל תמיכה בתרגומים עבריים)
const getAspectColor = (aspectType, isDark) => {
  if (!aspectType) return isDark ? ASPECT_COLORS.default.dark : ASPECT_COLORS.default.light;
  const normalizedType = String(aspectType).toLowerCase().trim();
  const hebrewToEnglish = {
    'צירוף': 'conjunction', 'צמידות': 'conjunction',
    'התנגדות': 'opposition', 'מולות': 'opposition',
    'ריבוע': 'square',
    'משולש': 'trine', 'טריגון': 'trine', 'טריין': 'trine',
    'משושה': 'sextile', 'סקסטיל': 'sextile', 'שישית': 'sextile',
    'חצי-משושה': 'semisextile', 'חצי־שישית': 'semisextile',
    'חמישון': 'quincunx', 'קווינקוקס': 'quincunx', 'קווינקנקס': 'quincunx',
    // English
    'conjunction': 'conjunction', 'opposition': 'opposition', 'square': 'square',
    'trine': 'trine', 'sextile': 'sextile', 'semisextile': 'semisextile', 'quincunx': 'quincunx',
  };
  const cleanType = normalizedType.split(/[\s\(]/)[0];
  let englishType = hebrewToEnglish[cleanType] || hebrewToEnglish[normalizedType] || cleanType;
  if (!hebrewToEnglish[cleanType] && !hebrewToEnglish[normalizedType]) {
    for (const [he, en] of Object.entries(hebrewToEnglish)) {
      if (normalizedType.includes(he)) { englishType = en; break; }
    }
  }
  const colorScheme = ASPECT_COLORS[englishType] || ASPECT_COLORS.default;
  return isDark ? colorScheme.dark : colorScheme.light;
};

export default function AspectsTable({ niceAspects }) {
  const { isDark } = useThemeState();

  const totalCount = Array.isArray(niceAspects) ? niceAspects.length : 0;

  return (
    <>
      {totalCount === 0 && (
        <div className={`${isDark ? 'bg-neutral-800 border border-neutral-700 text-neutral-400' : 'bg-neutral-50 border border-neutral-200 text-neutral-600'} mb-6 p-6 rounded-xl text-center`}>
          <span className="text-4xl mb-2 block">🌌</span>
          <p className="text-sm font-medium">אין היבטים לתצוגה</p>
        </div>
      )}

      {totalCount > 0 && (
        <div className={`h-full w-full rounded-xl border ${isDark ? 'border-neutral-700 bg-neutral-800' : 'border-neutral-200 bg-white'} flex flex-col overflow-hidden`}>
          {/* כותרת קבועה */}
          <div className={`${isDark ? 'bg-neutral-800' : 'bg-neutral-50'} border-b ${isDark ? 'border-neutral-700' : 'border-neutral-200'} flex-shrink-0`}>
            <div className="flex">
              <div className={`py-1.5 px-2 text-right font-semibold flex-1 ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
                פלנטה 1
              </div>
              <div className={`py-1.5 px-2 text-center font-semibold w-24 ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
                סוג ההיבט
              </div>
              <div className={`py-1.5 px-2 text-right font-semibold flex-1 ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
                פלנטה 2
              </div>
              <div className={`py-1.5 px-2 text-center font-semibold w-16 ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
                אורב
              </div>
            </div>
          </div>
          
          {/* תוכן עם גלילה */}
          <div className="flex-1 overflow-auto min-h-0">
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {niceAspects.map((a, i) => {
                const aspectColorClass = getAspectColor(a.type, isDark);
                return (
                  <div key={i} className={`flex ${isDark ? 'hover:bg-neutral-700/30' : 'hover:bg-neutral-50'}`}>
                    <div className="py-1.5 px-2 flex-1">
                      <div className="flex items-start gap-1">
                        <span className={isDark ? 'text-amber-300 text-lg' : 'text-amber-600 text-lg'}>{a.p1Glyph}</span>
                        <div className="leading-tight">
                          <div className={isDark ? 'text-neutral-200 font-medium' : 'text-neutral-900 font-medium'}>{a.p1}</div>
                          {(a.p1Sign || a.p1SignGlyph) && (
                            <div className={isDark ? 'mt-0 flex items-center gap-0.5 text-xs text-neutral-400' : 'mt-0 flex items-center gap-0.5 text-xs text-neutral-500'}>
                              {a.p1SignGlyph && <span className="text-xs">{a.p1SignGlyph}</span>}
                              {a.p1Sign && <span>{a.p1Sign}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="py-1.5 px-2 text-center w-24 flex items-center justify-center">
                      <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-medium ${aspectColorClass}`}>
                        <span className="text-base">{a.typeGlyph}</span>
                        <span className="text-xs">{a.type}</span>
                      </div>
                    </div>

                    <div className="py-1.5 px-2 flex-1">
                      <div className="flex items-start gap-1">
                        <span className={isDark ? 'text-amber-300 text-lg' : 'text-amber-600 text-lg'}>{a.p2Glyph}</span>
                        <div className="leading-tight">
                          <div className={isDark ? 'text-neutral-200 font-medium' : 'text-neutral-900 font-medium'}>{a.p2}</div>
                          {(a.p2Sign || a.p2SignGlyph) && (
                            <div className={isDark ? 'mt-0 flex items-center gap-0.5 text-xs text-neutral-400' : 'mt-0 flex items-center gap-0.5 text-xs text-neutral-500'}>
                              {a.p2SignGlyph && <span className="text-xs">{a.p2SignGlyph}</span>}
                              {a.p2Sign && <span>{a.p2Sign}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="py-1.5 px-2 text-center w-16 flex items-center justify-center">
                      <span className={isDark ? 'inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-mono bg-neutral-700 text-neutral-300 border border-neutral-600' : 'inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-mono bg-neutral-100 text-neutral-700 border border-neutral-200'}>
                        {a.orb}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
